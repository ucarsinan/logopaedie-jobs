import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const prerender = false;

// Server-side Supabase client mit Service Role (bypasses RLS)
function getServiceClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY nicht gesetzt');
  return createClient(url, key);
}

const SubmitSchema = z.object({
  // Arbeitgeber
  employer_name:  z.string().min(2).max(200),
  employer_email: z.string().email(),
  employer_website: z.string().url().optional().or(z.literal('')),

  // Stelle
  title:           z.string().min(5).max(200),
  description:     z.string().min(50),
  location_city:   z.string().min(2).max(100),
  location_zip:    z.string().regex(/^\d{5}$/).optional().or(z.literal('')),
  employment_type: z.array(z.enum(['FULL_TIME', 'PART_TIME'])).min(1),
  work_hours_min:  z.coerce.number().int().min(1).max(40).optional(),
  work_hours_max:  z.coerce.number().int().min(1).max(40).optional(),
  salary_min:      z.coerce.number().int().min(1).optional(),
  salary_max:      z.coerce.number().int().min(1).optional(),
  valid_through:   z.string().date().optional().or(z.literal('')),
  apply_url:       z.string().url().optional().or(z.literal('')),
  apply_email:     z.string().email().optional().or(z.literal('')),

  // Honeypot — muss leer bleiben
  _honeypot: z.literal('').optional(),
});

function generateSlug(city: string, employer: string): string {
  const toSlug = (s: string) =>
    s.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(36))
    .join('')
    .slice(0, 6);

  return `logopaedie-${toSlug(city)}-${toSlug(employer)}-${rand}`;
}

export const POST: APIRoute = async ({ request }) => {
  // Honeypot: Bot-Check via Referer optional; Hauptschutz ist das leere Feld
  const formData = await request.formData();

  // Honeypot prüfen
  if (formData.get('_honeypot')) {
    return new Response(JSON.stringify({ error: 'Spam erkannt.' }), { status: 400 });
  }

  // employment_type kommt als mehrere Werte
  const rawEmploymentType = formData.getAll('employment_type') as string[];

  const raw = {
    employer_name:    formData.get('employer_name'),
    employer_email:   formData.get('employer_email'),
    employer_website: formData.get('employer_website') ?? '',
    title:            formData.get('title'),
    description:      formData.get('description'),
    location_city:    formData.get('location_city'),
    location_zip:     formData.get('location_zip') ?? '',
    employment_type:  rawEmploymentType,
    work_hours_min:   formData.get('work_hours_min') || undefined,
    work_hours_max:   formData.get('work_hours_max') || undefined,
    salary_min:       formData.get('salary_min') || undefined,
    salary_max:       formData.get('salary_max') || undefined,
    valid_through:    formData.get('valid_through') ?? '',
    apply_url:        formData.get('apply_url') ?? '',
    apply_email:      formData.get('apply_email') ?? '',
    _honeypot:        formData.get('_honeypot') ?? '',
  };

  const parsed = SubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Validierungsfehler', details: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  const data = parsed.data;

  let supabase;
  try {
    supabase = getServiceClient();
  } catch {
    return new Response(JSON.stringify({ error: 'Server-Konfigurationsfehler.' }), { status: 500 });
  }

  // Arbeitgeber anlegen oder vorhandenen finden
  let employerId: string;
  const { data: existingEmployer } = await supabase
    .from('employers')
    .select('id')
    .eq('email', data.employer_email)
    .single();

  if (existingEmployer) {
    employerId = existingEmployer.id;
  } else {
    const { data: newEmployer, error: employerError } = await supabase
      .from('employers')
      .insert({
        name:    data.employer_name,
        email:   data.employer_email,
        website: data.employer_website || null,
      })
      .select('id')
      .single();

    if (employerError || !newEmployer) {
      return new Response(JSON.stringify({ error: 'Arbeitgeber konnte nicht angelegt werden.' }), { status: 500 });
    }
    employerId = newEmployer.id;
  }

  // Stelle einreichen
  const slug = generateSlug(data.location_city, data.employer_name);
  const { error: jobError } = await supabase.from('job_postings').insert({
    employer_id:     employerId,
    title:           data.title,
    slug,
    description:     data.description,
    location_city:   data.location_city,
    location_zip:    data.location_zip || null,
    employment_type: data.employment_type,
    work_hours_min:  data.work_hours_min ?? null,
    work_hours_max:  data.work_hours_max ?? null,
    salary_min:      data.salary_min ?? null,
    salary_max:      data.salary_max ?? null,
    valid_through:   data.valid_through || null,
    apply_url:       data.apply_url || null,
    apply_email:     data.apply_email || null,
    status:          'pending',
  });

  if (jobError) {
    return new Response(JSON.stringify({ error: 'Stelle konnte nicht gespeichert werden.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 201 });
};
