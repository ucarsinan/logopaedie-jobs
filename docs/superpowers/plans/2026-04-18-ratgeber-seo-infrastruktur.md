# Implementierungsplan: Ratgeber-Ausbau + SEO-Infrastruktur

**Datum:** 2026-04-18  
**Spec:** `docs/superpowers/specs/2026-04-18-ratgeber-seo-strategie-design.md`  
**Branch:** main

---

## Schritt 1 — Sitemap + robots.txt

**Ziel:** Google kann alle Seiten crawlen und findet eine valide Sitemap.

### 1a — `@astrojs/sitemap` installieren und konfigurieren

```bash
npm install @astrojs/sitemap
```

**`astro.config.mjs` ändern:**
- `sitemap()` zu `integrations` hinzufügen
- `site: 'https://xn--logopdiejobs-kcb.de'` setzen (bereits bekannt aus Breadcrumbs)

### 1b — `public/robots.txt` erstellen

```
User-agent: *
Allow: /

Sitemap: https://xn--logopdiejobs-kcb.de/sitemap-index.xml
```

**Verifikation:**
- `npm run build && npm run preview`
- `/sitemap-index.xml` im Browser prüfen
- Alle Ratgeber-Artikel erscheinen darin

---

## Schritt 2 — Canonical URLs im Layout

**Ziel:** Kein Duplicate-Content durch trailing-slash Varianten.

**`src/layouts/Layout.astro` ändern:**
- `const canonicalURL = new URL(Astro.url.pathname, Astro.site);` im Frontmatter
- `<link rel="canonical" href={canonicalURL} />` im `<head>`

**Verifikation:**
- Page-Source auf `/` und `/ratgeber/` prüfen → `<link rel="canonical">` vorhanden

---

## Schritt 3 — Open Graph + Twitter Cards im Layout

**Ziel:** Korrektes Preview-Bild und -Text beim Teilen auf LinkedIn, Slack, WhatsApp.

**`src/layouts/Layout.astro` — neue Props:**
```typescript
interface Props {
  title: string;
  description: string;
  ogImage?: string;      // neu
  ogType?: string;       // neu, default: 'website'
  breadcrumbs?: ...;     // bereits vorhanden
}
```

**Im `<head>` hinzufügen:**
```html
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType ?? 'website'} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={ogImage ?? '/og-default.jpg'} />
<meta name="twitter:card" content="summary_large_image" />
```

**`public/og-default.jpg`:** Manuell hinzufügen (1200×630px, Praxis-Branding). Platzhalter bis dahin: leeres JPG oder bestehendes Bild.

**`src/pages/ratgeber/[slug].astro` anpassen:**
- `ogImage={beitrag.data.heroImage}` und `ogType="article"` an Layout übergeben

**Verifikation:**
- URL in [opengraph.xyz](https://www.opengraph.xyz) eingeben → Preview prüfen

---

## Schritt 4 — Schema.org: JobPosting + LocalBusiness + FAQPage auf Index

**Ziel:** Google Jobs Rich Results und FAQ-Accordion direkt in der SERP.

**`src/pages/index.astro` — JSON-LD Script-Block hinzufügen:**

```json
// JobPosting Schema
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Logopädin / Logopäde (m/w/d)",
  "description": "...",
  "datePosted": "2026-01-01",
  "validThrough": "2026-12-31",
  "employmentType": ["FULL_TIME", "PART_TIME"],
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Praxis für Logopädie Şimşek",
    "sameAs": "https://logopaedie-simsek.de",
    "logo": "..."
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tonhallenstraße 21",
      "addressLocality": "Duisburg",
      "postalCode": "47051",
      "addressCountry": "DE"
    }
  }
}
```

```json
// LocalBusiness Schema
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Praxis für Logopädie Şimşek",
  "address": { ... },
  "telephone": "+492033486869",
  "url": "https://logopaedie-simsek.de"
}
```

```json
// FAQPage Schema — aus bestehender FaqSection.astro Daten ableiten
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Welche Stelle bietet die Praxis Şimşek an?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    },
    ...
  ]
}
```

**⚠ Wichtig:** `datePosted`, `validThrough`, `telephone` und andere Faktenwerte **nicht erfinden** — beim User erfragen oder aus bestehenden Dateien übernehmen.

**Verifikation:**
- [Google Rich Results Test](https://search.google.com/test/rich-results) auf Index-URL

---

## Schritt 5 — Schema.org: Article auf Ratgeber-Artikeln

**Ziel:** Artikel-Rich-Snippet mit Autor und Datum in Google.

**`src/pages/ratgeber/[slug].astro` — JSON-LD hinzufügen:**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{beitrag.data.title}",
  "description": "{beitrag.data.description}",
  "datePublished": "{beitrag.data.pubDate.toISOString()}",
  "dateModified": "{beitrag.data.pubDate.toISOString()}",
  "author": {
    "@type": "Person",
    "name": "{beitrag.data.author}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Logopädiejobs.de"
  },
  "mainEntityOfPage": "{canonicalURL}"
}
```

`BreadcrumbList` Schema aus den bestehenden `breadcrumbs`-Props generieren.

---

## Schritt 6 — relatedArticles Frontmatter + Verlinkungsblock

**Ziel:** Interne Verlinkung für Pillar-Cluster-Struktur.

### 6a — Content-Schema erweitern

**`src/content/config.ts` — Ratgeber-Schema:**
```typescript
relatedArticles: z.array(z.string()).optional(),
// Werte sind Artikel-IDs, z.B. ["gehalt-logopaedie-nrw", "ausbildung-nrw-2026"]
```

### 6b — Verlinkungsblock im Artikel-Template

**`src/pages/ratgeber/[slug].astro`:**
- Wenn `beitrag.data.relatedArticles` vorhanden: alle verlinkten Artikel aus Collection laden
- Unter dem Artikel-Body, vor dem CTA-Block: "Weitere Artikel"-Sektion mit Karten (Titel + Kategorie-Badge + Pfeil-Link)

### 6c — Bestehende Artikel-Frontmatter befüllen

Für alle 6 vorhandenen Artikel `relatedArticles` sinnvoll befüllen:
- `willkommen.md` → verlinkt auf alle anderen
- `gehalt-...` ↔ `ausbildung-nrw-2026`
- `bilinguale-...` ↔ `stottertherapie-...`

---

## Verifikations-Checkliste (Gesamt)

- [ ] `/sitemap-index.xml` erreichbar und enthält alle Seiten inkl. Ratgeber
- [ ] `/robots.txt` erreichbar
- [ ] Jede Seite hat `<link rel="canonical">` im `<head>`
- [ ] Google Rich Results Test: valides `JobPosting` auf Index
- [ ] Google Rich Results Test: valides `Article` auf Ratgeber-Artikel
- [ ] Google Rich Results Test: valides `FAQPage` auf Index
- [ ] OG-Preview korrekt bei LinkedIn/Slack-Sharing
- [ ] `relatedArticles`-Block erscheint auf Artikeln mit befülltem Frontmatter

---

## Nach der Implementierung (manuell)

1. **Google Search Console:** Domain verifizieren, Sitemap einreichen
2. **URL Inspection Tool:** Index-Seite und einen Ratgeber-Artikel auf Indexierung prüfen
3. **OG-Default-Image:** 1200×630px Bild mit Praxis-Branding erstellen und unter `/public/og-default.jpg` ablegen
