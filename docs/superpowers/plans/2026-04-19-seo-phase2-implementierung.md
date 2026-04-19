# Implementierungsplan: SEO Phase 2 — Migration, Schemas, AI SEO

**Datum:** 2026-04-19
**Spec:** `docs/superpowers/specs/2026-04-19-seo-phase2-migration-schemas-ai.md`
**Branch:** main

---

## Phase 1 — Migration der Standalone-Seiten

### Schritt 1a — Redirects in astro.config.mjs eintragen

**Datei:** `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://xn--logopdiejobs-kcb.de',
  redirects: {
    '/gehalt/': '/ratgeber/gehalt-logopaedie-nrw/',
    '/4-tage-woche/': '/ratgeber/4-tage-woche-logopaedie/',
    '/bilingual/': '/ratgeber/bilinguale-sprachtherapie/',
  },
  // ... rest bleibt unverändert
});
```

**Verifikation:** `npm run build` — Astro sollte keine Fehler werfen. Redirects erscheinen in `.vercel/output/config.json`.

---

### Schritt 1b — gehalt.astro → Markdown-Artikel migrieren

**Neue Datei:** `src/content/ratgeber/gehalt-logopaedie-nrw.md`

Frontmatter:
```yaml
---
title: "Logopädie Gehalt NRW 2026 — Was verdient eine Logopädin in Duisburg?"
description: "Aktuelle Gehaltszahlen für Logopädinnen in NRW und Duisburg 2026. Durchschnittsgehalt, Einstiegsgehalt, Einflussfaktoren und warum Praxis Şimşek über Durchschnitt zahlt."
kategorie: "Gehalt"
pubDate: 2026-04-14
author: "Redaktion"
draft: false
relatedArticles: ["ausbildung-nrw-2026", "bewerbung-logopaedie-tipps", "4-tage-woche-logopaedie"]
---
```

Body: Gesamten Artikel-Text aus `gehalt.astro` (innerhalb von `<div class="article-body">`) als Markdown übertragen. Kein HTML — reines Markdown mit `##`-Überschriften.

Danach: `src/pages/gehalt.astro` löschen.

---

### Schritt 1c — 4-tage-woche.astro → Markdown-Artikel migrieren

**Neue Datei:** `src/content/ratgeber/4-tage-woche-logopaedie.md`

Frontmatter:
```yaml
---
title: "4-Tage-Woche in der Logopädie — Erfahrungen & Modelle 2026"
description: "Funktioniert die 4-Tage-Woche als Logopädin? Praxis Şimşek in Duisburg macht es vor: Erfahrungen, Arbeitszeitmodelle und warum ausgeruhte Therapeuten bessere Therapie machen."
kategorie: "Arbeitszeit"
pubDate: 2026-04-14
author: "Redaktion"
draft: false
relatedArticles: ["teilzeit-modelle", "arbeiten-duisburg", "bewerbung-logopaedie-tipps"]
---
```

Body: Artikel-Text aus `4-tage-woche.astro` als Markdown übertragen.

Danach: `src/pages/4-tage-woche.astro` löschen.

---

### Schritt 1d — bilingual.astro → Inhalt in bestehende .md mergen

`bilingual.astro` behandelt die Patienten-/Arbeitgeber-Perspektive (Warum bilinguale Therapie?), `bilinguale-sprachtherapie.md` die Logopädin-Perspektive (Spezialisierung).

Vorgehen:
1. `bilingual.astro` lesen — was ist inhaltlich einzigartig (nicht in `.md` vorhanden)?
2. Fehlende Abschnitte am Ende von `bilinguale-sprachtherapie.md` ergänzen unter neuem `##`-Header „Bilinguale Therapie aus Patientenperspektive"
3. `bilingual.astro` löschen

---

### Schritt 1e — Interne Links aktualisieren

Alle Verweise auf alte URLs ersetzen:

Suche in `src/` nach:
- `href="/gehalt/"` → `href="/ratgeber/gehalt-logopaedie-nrw/"`
- `href="/4-tage-woche/"` → `href="/ratgeber/4-tage-woche-logopaedie/"`
- `href="/bilingual/"` → `href="/ratgeber/bilinguale-sprachtherapie/"`

Auch in `.md`-Dateien Links prüfen (z.B. in `ausbildung-nrw-2026.md` gibt es einen Link auf `/gehaltsrechner/` und `/4-tage-woche/`).

---

### Schritt 1f — relatedArticles in bestehenden Artikeln ergänzen

Neue Artikel-IDs in bestehende Artikel eintragen:
- `teilzeit-modelle.md` → `"4-tage-woche-logopaedie"` hinzufügen
- `arbeiten-duisburg.md` → `"gehalt-logopaedie-nrw"` hinzufügen
- `willkommen.md` → `"gehalt-logopaedie-nrw"`, `"4-tage-woche-logopaedie"` hinzufügen

---

### Verifikation Phase 1

```bash
npm run build
```

- Build sauber ohne Fehler
- `dist/client/gehalt/` existiert nicht mehr (oder enthält nur Redirect)
- `dist/client/ratgeber/gehalt-logopaedie-nrw/index.html` existiert
- `dist/client/ratgeber/4-tage-woche-logopaedie/index.html` existiert
- `npm run preview` → `/gehalt/` im Browser → 301 auf `/ratgeber/gehalt-logopaedie-nrw/`

---

## Phase 2 — Fehlende Schemas

### Schritt 2a — CollectionPage auf /ratgeber/index.astro

In `src/pages/ratgeber/index.astro` Frontmatter: alle veröffentlichten Artikel laden und CollectionPage JSON-LD in `slot="head"` injizieren:

```astro
---
const alleArtikel = await getCollection('ratgeber', ({ data }) => !data.draft);
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Ratgeber für Logopädinnen — NRW & Duisburg",
  "description": "Artikel, Guides und Erfahrungsberichte rund um Karriere, Gehalt und Arbeitszeit in der Logopädie.",
  "url": "https://xn--logopdiejobs-kcb.de/ratgeber/",
  "hasPart": alleArtikel.map(a => ({
    "@type": "Article",
    "url": `https://xn--logopdiejobs-kcb.de/ratgeber/${a.id}/`,
    "name": a.data.title
  }))
};
---
```

```html
<script slot="head" type="application/ld+json" is:inline set:html={JSON.stringify(collectionSchema)} />
```

---

### Schritt 2b — WebApplication auf /gehaltsrechner.astro

In `src/pages/gehaltsrechner.astro` JSON-LD in `slot="head"` hinzufügen:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Gehaltsrechner Logopädie NRW",
  "description": "Berechne dein Bruttogehalt als Logopädin in NRW — nach Erfahrung, Setting und Stundenmodell.",
  "url": "https://xn--logopdiejobs-kcb.de/gehaltsrechner/",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

---

### Schritt 2c — AggregateRating in index.astro

⚠️ **Vor der Implementierung:** User muss folgende Werte aus dem Google Business Profile liefern:
- `ratingValue`: Gesamtbewertung (z.B. `"4.8"`)
- `reviewCount`: Anzahl Rezensionen (z.B. `"47"`)

Dann im bestehenden `LocalBusiness`-Schema-Objekt in `index.astro` ergänzen:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "[USER-WERT]",
  "reviewCount": "[USER-WERT]",
  "bestRating": "5",
  "worstRating": "1"
}
```

---

### Verifikation Phase 2

- Google Rich Results Test auf `/ratgeber/` → CollectionPage valide
- Google Rich Results Test auf `/gehaltsrechner/` → WebApplication valide
- Google Rich Results Test auf `/` → AggregateRating im LocalBusiness valide

---

## Phase 3 — AI SEO / Answer Engine Optimization

### Schritt 3a — content.config.ts erweitern

```typescript
const ratgeber = defineCollection({
  schema: z.object({
    // ... bestehende Felder ...
    definition: z.string().optional(),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});
```

---

### Schritt 3b — DefinitionBox.astro erstellen

**Neue Datei:** `src/components/DefinitionBox.astro`

```astro
---
interface Props {
  text: string;
}
const { text } = Astro.props;
---

<div class="definition-box my-8 border-l-4 border-simsek-green bg-simsek-green/5 rounded-r-2xl px-6 py-5">
  <p class="text-sm font-bold uppercase tracking-widest text-simsek-green mb-2">Auf einen Blick</p>
  <p class="text-slate-700 leading-relaxed font-medium">{text}</p>
</div>
```

---

### Schritt 3c — FAQBlock.astro erstellen

**Neue Datei:** `src/components/FAQBlock.astro`

```astro
---
interface FAQ {
  q: string;
  a: string;
}
interface Props {
  faqs: FAQ[];
}
const { faqs } = Astro.props;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
};
---

<script slot="head" type="application/ld+json" is:inline set:html={JSON.stringify(faqSchema)} />

<section class="mt-14 pt-8 border-t border-slate-100">
  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Häufige Fragen</h3>
  <dl class="space-y-4">
    {faqs.map(({ q, a }) => (
      <details class="group border border-slate-100 rounded-2xl overflow-hidden">
        <summary class="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-slate-800 text-sm list-none hover:bg-slate-50 transition-colors">
          {q}
          <svg class="w-4 h-4 shrink-0 text-simsek-green transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </summary>
        <div class="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed">{a}</div>
      </details>
    ))}
  </dl>
</section>
```

⚠️ Der `slot="head"` im `FAQBlock` funktioniert nur wenn `FAQBlock` direkt innerhalb von `<Layout>` gerendert wird, nicht als Child einer anderen Komponente. In `[slug].astro` direkt als Kind von `<Layout>` einbinden.

---

### Schritt 3d — [slug].astro anpassen

Imports ergänzen:
```astro
import DefinitionBox from '../../components/DefinitionBox.astro';
import FAQBlock from '../../components/FAQBlock.astro';
```

`speakable`-Schema in Frontmatter berechnen und in `slot="head"` injizieren:

```astro
const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".definition-box", "article h2:first-of-type + p"]
  },
  "url": canonicalURL
};
```

Im Template:
```astro
<!-- Nach <Content /> -->
{beitrag.data.definition && (
  <DefinitionBox text={beitrag.data.definition} />
)}

<!-- Vor CTA-Block -->
{beitrag.data.faq && beitrag.data.faq.length > 0 && (
  <FAQBlock faqs={beitrag.data.faq} />
)}
```

---

### Schritt 3e — Artikel mit definition + faq befüllen

Priorität 1 — `gehalt-logopaedie-nrw.md`:
```yaml
definition: "Logopädinnen verdienen in NRW 2026 durchschnittlich 3.820 € brutto pro Monat. Die Spanne reicht von ca. 2.800 € für Berufseinsteiger bis über 4.000 € für erfahrene Spezialistinnen. Duisburg liegt dabei im oberen Bereich des NRW-Vergleichs."
faq:
  - q: "Was verdient eine Logopädin in NRW 2026?"
    a: "Das Durchschnittsgehalt liegt bei ca. 3.820 € brutto pro Monat (ca. 45.850 € jährlich). Berufseinsteiger starten bei 2.800–3.200 €, erfahrene Therapeutinnen mit Spezialisierung können 4.000 € und mehr erreichen."
  - q: "Verdienen Logopädinnen in Kliniken mehr als in Praxen?"
    a: "In Kliniken gilt meist der TVöD-Tarifvertrag, der klare Einstiegsstufen definiert. In Praxen ist mehr Verhandlungsspielraum vorhanden — manche Praxen zahlen deutlich über Tarifniveau, andere darunter. Ein Vergleich lohnt sich."
  - q: "Welche Faktoren erhöhen das Gehalt als Logopädin?"
    a: "Spezialisierungen (Neurologie, Stottertherapie, bilinguale Therapie), Berufserfahrung, Arbeitgeber (Klinik vs. Praxis) und Region sind die wichtigsten Faktoren. Auch Zusatzleistungen wie Fortbildungsübernahme oder flexible Arbeitszeit sollten eingerechnet werden."
```

Priorität 2 — `bewerbung-logopaedie-tipps.md`:
```yaml
definition: "Eine Bewerbung als Logopädin braucht vier Kernelemente: Anschreiben, tabellarischer Lebenslauf, staatliche Anerkennungsurkunde und relevante Arbeitszeugnisse. Im aktuellen Arbeitnehmermarkt sind Bewerberinnen in einer guten Verhandlungsposition — trotzdem entscheidet die Passgenauigkeit zur Praxis über die Einladung."
faq:
  - q: "Was gehört in eine Bewerbung als Logopädin?"
    a: "Pflicht: Anschreiben, Lebenslauf, staatliche Anerkennungsurkunde. Sinnvoll: aktuelle Arbeitszeugnisse, Fortbildungsnachweise mit Relevanz zur Stelle. Mehr als vier bis fünf Dokumente wird selten erwartet."
  - q: "Wie lang sollte das Anschreiben einer Logopädin sein?"
    a: "Maximal eine DIN-A4-Seite. Praxisinhaber lesen Anschreiben diagonal — kurz, konkret und praxisbezogen überzeugt mehr als ein langer Fließtext mit allgemeinen Formulierungen."
  - q: "Wann sollte ich das Gehalt im Vorstellungsgespräch ansprechen?"
    a: "Erst wenn der Arbeitgeber das Thema aufbringt oder direkt danach fragt. In Kliniken mit Tarifbindung sind die Stufen meist bekannt — hier geht es eher um die richtige Eingruppierung. In Praxen ist mehr Spielraum, aber Zahlen erst nennen wenn gefragt."
```

Priorität 3–7 — restliche Artikel nach demselben Muster befüllen (in separatem Schritt).

---

## Gesamte Verifikations-Checkliste

- [ ] `npm run build` sauber
- [ ] `/gehalt/` → 301 → `/ratgeber/gehalt-logopaedie-nrw/`
- [ ] `/4-tage-woche/` → 301 → `/ratgeber/4-tage-woche-logopaedie/`
- [ ] `/bilingual/` → 301 → `/ratgeber/bilinguale-sprachtherapie/`
- [ ] Keine internen Links mehr auf alte URLs
- [ ] Rich Results Test: CollectionPage auf `/ratgeber/`
- [ ] Rich Results Test: WebApplication auf `/gehaltsrechner/`
- [ ] Rich Results Test: AggregateRating auf `/`
- [ ] Rich Results Test: FAQPage auf Artikeln mit `faq`-Frontmatter
- [ ] DefinitionBox erscheint auf Artikeln mit `definition`-Frontmatter
- [ ] FAQBlock erscheint auf Artikeln mit `faq`-Frontmatter (Akkordeon funktioniert)
- [ ] speakable-Schema in Page-Source der Ratgeber-Artikel vorhanden

---

## Bevor Phase 2c beginnt (AggregateRating)

User-Input erforderlich:
- **Gesamtbewertung** der Praxis auf Google (z.B. 4.8)
- **Anzahl der Rezensionen** (z.B. 47)

Diese Werte direkt aus dem Google Business Profile ablesen.
