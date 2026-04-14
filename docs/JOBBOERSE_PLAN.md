# Jobbörse Phase 2 — Architekturplan

> Stand: April 2026. Noch nicht implementiert. Dieser Plan beschreibt die technische
> und produktseitige Grundlage für den Ausbau von logopädiejobs.de zur Nischen-Jobbörse.

---

## 1. Produktvision

Logopädiejobs.de wird zur ersten spezialisierten Jobbörse für Logopäd:innen in NRW.
Arbeitgeber (Praxen, Kliniken, Frühförderstellen) können Stellen selbst einreichen.
Bewerber:innen finden und filtern Stellen ohne Registrierungszwang.
Admins moderieren Einreichungen vor Veröffentlichung.

---

## 2. Datenmodell (Supabase / PostgreSQL + RLS)

### Tabellen

```sql
-- Arbeitgeber (Self-Service, optional verifiziert)
CREATE TABLE employers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL UNIQUE,
  website     text,
  verified    boolean DEFAULT false,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Stellenanzeigen
CREATE TABLE job_postings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz DEFAULT now(),
  employer_id     uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  description     text NOT NULL,            -- Markdown
  location_city   text NOT NULL,
  location_zip    text,
  employment_type text[] DEFAULT '{"FULL_TIME"}', -- FULL_TIME | PART_TIME
  work_hours_min  int,                      -- z.B. 20
  work_hours_max  int,                      -- z.B. 40
  salary_min      int,                      -- brutto/Monat in EUR, optional
  salary_max      int,
  valid_through   date,
  status          text NOT NULL DEFAULT 'pending',
                  -- pending | published | rejected | expired
  premium         boolean DEFAULT false,    -- Premium-Listing (Monetarisierung)
  apply_url       text,                     -- externer Bewerbungslink
  apply_email     text                      -- oder direktes Bewerben per E-Mail
);

-- Bewerbungen (optional, Phase 3)
CREATE TABLE applications (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz DEFAULT now(),
  job_posting_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  message        text,
  status         text DEFAULT 'new'         -- new | reviewed | rejected
);
```

### Row Level Security

```sql
-- job_postings: öffentlich lesbar wenn published
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published"
  ON job_postings FOR SELECT
  USING (status = 'published');

-- Arbeitgeber sehen nur eigene Stellen (alle Status)
CREATE POLICY "employer sees own postings"
  ON job_postings FOR ALL
  USING (employer_id IN (
    SELECT id FROM employers WHERE auth_user_id = auth.uid()
  ));

-- Admins sehen alles (via service_role oder custom claim)
-- → Vercel API-Route nutzt service_role-Key, nie im Frontend exponieren
```

### Slug-Generierung

Format: `logopaedie-[city-slug]-[employer-slug]-[nanoid-6]`
Beispiel: `logopaedie-duisburg-praxis-simsek-a3f8kq`
Wird server-seitig beim Einreichen generiert.

---

## 3. Einreichungsflow

```
Arbeitgeber füllt Formular aus (/jobs/neu/)
         ↓
API-Route: POST /api/jobs/submit
  → Validierung (Zod)
  → Employer anlegen oder verknüpfen (Supabase Auth Magic Link)
  → job_postings.status = 'pending'
  → E-Mail an Admin: "Neue Einreichung prüfen"
         ↓
Admin-Ansicht (/admin/ via Decap oder eigenes Mini-Dashboard)
  → Vorschau der Anzeige
  → Approve → status = 'published', Vercel Revalidate-Hook
  → Reject → status = 'rejected', E-Mail an Arbeitgeber
         ↓
Veröffentlicht unter /jobs/[slug]/
  → JSON-LD JobPosting wird server-seitig gerendert
  → Sitemap-Eintrag wird automatisch generiert
```

**Moderationsprioritäten:**
- Spam-Filter: Pflichtfelder, Honeypot-Feld, Rate-Limit per IP (Vercel Edge Middleware)
- Inhaltsprüfung manuell durch Admin (kein KI-Auto-Approve in Phase 1)
- Ablaufende Stellen: Cron-Job (Vercel Cron) setzt `status = 'expired'` wenn `valid_through < now()`

---

## 4. Frontend-Struktur (Astro + Supabase)

```
/jobs/                    → Übersicht mit Filter (Stadt, Arbeitszeit, Setting)
/jobs/[slug]/             → Einzelansicht + JSON-LD JobPosting
/jobs/neu/                → Einreichungsformular (öffentlich, kein Login nötig)
/jobs/dashboard/          → Arbeitgeber-Dashboard (eigene Anzeigen, Login required)
```

**Filterlogik:** Client-seitig (Astro Islands mit Preact) oder Server-seitig (Astro SSR via `output: 'server'`). Empfehlung: SSR mit URL-Parametern (`?city=duisburg&type=PART_TIME`), damit Filter-URLs indexierbar sind.

**Astro-Modus wechseln:** Aktuell `output: 'static'`. Für dynamische Jobseiten muss auf `output: 'hybrid'` oder `output: 'server'` + Vercel Adapter umgestellt werden.

---

## 5. SEO

### JSON-LD JobPosting pro Stelle

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "[job_postings.title]",
  "datePosted": "[created_at]",
  "validThrough": "[valid_through]",
  "employmentType": "[employment_type]",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "[employers.name]",
    "sameAs": "[employers.website]"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "[location_city]",
      "postalCode": "[location_zip]",
      "addressRegion": "Nordrhein-Westfalen",
      "addressCountry": "DE"
    }
  },
  "baseSalary": { ... }   // nur wenn salary_min/max gesetzt
}
```

### Dynamische Sitemap

Astro `@astrojs/sitemap` reicht für statische Seiten. Für dynamische Jobs:
Eigene `/sitemap-jobs.xml`-Route implementieren, die alle `published`-Jobs aus Supabase liest.

### URL-Struktur

Saubere, keyword-reiche Slugs: `/jobs/logopaedie-duisburg-praxis-simsek/`
Kein `/jobs?id=abc` — Google indexiert Parameter-URLs schlechter.

---

## 6. Rollen und Zugriffsmodell

| Rolle | Zugang | Auth |
|---|---|---|
| Öffentlicher Besucher | Alle published Jobs, Einreichungsformular | Keine |
| Arbeitgeber | Eigene Anzeigen verwalten, Status einsehen | Supabase Magic Link (E-Mail) |
| Admin | Alle Anzeigen, Approve/Reject, Arbeitgeber-Übersicht | Supabase Auth + admin-Claim |

Admin-Claim: `user_metadata.role = 'admin'` setzen via Supabase Dashboard oder Service-Role-API.

---

## 7. Monetarisierung (Phase 3+)

Nicht für Phase 2 geplant, aber die Datenbankstruktur (`premium`-Flag) ist bereits vorbereitet.

**Option A — Premium-Listing (Stripe)**
Arbeitgeber zahlen einmalig für hervorgehobene Platzierung (z. B. 49 €/Monat).
Technisch: Stripe Checkout → Webhook → `job_postings.premium = true`.

**Option B — Paketbuchung**
3er-Paket (3 Anzeigen / 3 Monate) für 99 €. Kleinere Praxen buchen selten einzeln.

**Option C — Newsletter-Sponsoring**
Stellenmarkt-Newsletter (wöchentlich, NRW-fokussiert) mit gesponserten Slots.
Niedrigschwellig: kein Stripe nötig, Buchung per E-Mail, Bezahlung per Überweisung.

**Empfehlung für Phase 2:** Starte mit kostenlosem Einreichen, keine Paywall.
Ziel: kritische Masse an Arbeitgebern und Stellenanzeigen aufbauen.
Monetarisierung erst einführen, wenn die Plattform organischen Traffic hat.

---

## 8. Technische Abhängigkeiten und Voraussetzungen

| Komponente | Status | Aufwand |
|---|---|---|
| Supabase-Projekt anlegen | offen | 30 min |
| Astro `output: 'hybrid'` + Vercel Adapter | offen | 1–2h |
| Einreichungsformular + Zod-Validierung | offen | 1 Tag |
| Admin-Moderation (einfaches Dashboard) | offen | 1–2 Tage |
| JSON-LD + dynamische Sitemap | offen | 4–6h |
| Supabase RLS konfigurieren | offen | 2–3h |
| Stripe-Integration (Monetarisierung) | zurückgestellt | Phase 3 |

---

## 9. Offene Entscheidungen vor Phase-2-Start

1. **Supabase-Projekt:** Neues Projekt oder bestehendes aus anderem Stack verwenden?
2. **Astro-Modus:** `hybrid` (statische Seiten + dynamische API-Routes) empfohlen — aber Vercel Adapter muss hinzugefügt werden (`@astrojs/vercel`).
3. **Moderation:** Decap-CMS erweitern (neue Collection `jobs`) oder eigenes Mini-Dashboard bauen? Eigenes Dashboard ist flexibler, aber mehr Aufwand.
4. **E-Mail-Versand:** Resend oder SendGrid für Benachrichtigungen an Admin und Arbeitgeber.
