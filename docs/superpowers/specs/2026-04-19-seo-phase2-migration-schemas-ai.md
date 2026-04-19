# SEO Phase 2 — Migration, Schemas, AI SEO

**Datum:** 2026-04-19
**Projekt:** logopädiejobs.de
**Status:** Approved

---

## Ziel

Drei parallele SEO-Verbesserungen als sequenzielle Phasen:
1. Standalone-Seiten in die Ratgeber-Collection migrieren
2. Fehlende Schema.org-Typen nachrüsten
3. Inhalte für AI-Suchsysteme (ChatGPT, Perplexity, Google AI Overviews) optimieren

---

## Phase 1 — Migration der Standalone-Seiten

### Kontext

Drei Seiten existieren als eigenständige `.astro`-Dateien außerhalb der Ratgeber-Collection. Sie haben kein Article-Schema, keinen relatedArticles-Block und sind nicht im Pillar-Cluster-Netzwerk verankert.

| Datei | Aktuelle URL | Neue URL |
|---|---|---|
| `src/pages/gehalt.astro` | `/gehalt/` | `/ratgeber/gehalt-logopaedie-nrw/` |
| `src/pages/4-tage-woche.astro` | `/4-tage-woche/` | `/ratgeber/4-tage-woche-logopaedie/` |
| `src/pages/bilingual.astro` | `/bilingual/` | Redirect auf bestehendes `/ratgeber/bilinguale-sprachtherapie/` |

### Durchführung

**gehalt.astro und 4-tage-woche.astro:**
- Inhalt aus `.astro`-Datei in neue `.md`-Datei übertragen (als Markdown-Body)
- Frontmatter befüllen: `title`, `description`, `kategorie`, `pubDate`, `author`, `relatedArticles`
- Alte `.astro`-Datei löschen
- Redirect in `astro.config.mjs` eintragen

**bilingual.astro:**
- Sonderfall: `bilinguale-sprachtherapie.md` existiert bereits in der Collection
- Inhalt von `bilingual.astro` prüfen — was davon fehlt in der bestehenden `.md`?
- Fehlende Inhalte in `bilinguale-sprachtherapie.md` ergänzen
- `bilingual.astro` löschen, Redirect auf `/ratgeber/bilinguale-sprachtherapie/` setzen

### Redirects in astro.config.mjs

```js
redirects: {
  '/gehalt/': '/ratgeber/gehalt-logopaedie-nrw/',
  '/4-tage-woche/': '/ratgeber/4-tage-woche-logopaedie/',
  '/bilingual/': '/ratgeber/bilinguale-sprachtherapie/',
}
```

Astro generiert daraus automatisch 301-Header auf Vercel. Google überträgt Link-Juice auf die neuen URLs.

### Interne Links aktualisieren

Nach der Migration alle internen Links auf die alten URLs suchen und ersetzen:
- `/gehalt/` → `/ratgeber/gehalt-logopaedie-nrw/`
- `/4-tage-woche/` → `/ratgeber/4-tage-woche-logopaedie/`
- `/bilingual/` → `/ratgeber/bilinguale-sprachtherapie/`

Betroffen: `index.astro`, alle `.astro`-Seiten, alle `.md`-Artikel.

### relatedArticles nach Migration

Neue Artikel-IDs für relatedArticles in bestehenden Artikeln ergänzen:
- `gehalt-logopaedie-nrw` ↔ `ausbildung-nrw-2026`, `bewerbung-logopaedie-tipps`, `gehaltsrechner` (externer Link)
- `4-tage-woche-logopaedie` ↔ `teilzeit-modelle`, `arbeiten-duisburg`

### Ergebnis

Alle fünf Ratgeber-Kernthemen sind in der Collection — Article-Schema, Breadcrumbs, relatedArticles-Block greifen automatisch über `[slug].astro`.

---

## Phase 2 — Fehlende Schemas

### 2a — CollectionPage auf /ratgeber/

**Datei:** `src/pages/ratgeber/index.astro`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Ratgeber für Logopädinnen — NRW & Duisburg",
  "description": "Artikel, Guides und Erfahrungsberichte rund um Karriere, Gehalt und Arbeitszeit in der Logopädie.",
  "url": "https://xn--logopdiejobs-kcb.de/ratgeber/",
  "hasPart": [
    { "@type": "Article", "url": "...", "name": "..." }
    // automatisch aus getCollection('ratgeber') generieren
  ]
}
```

### 2b — WebApplication auf /gehaltsrechner/

**Datei:** `src/pages/gehaltsrechner.astro`

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

### 2c — AggregateRating im LocalBusiness-Schema auf index.astro

Das bestehende `LocalBusiness`-Schema auf der Startseite wird um `aggregateRating` erweitert:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "TODO: echten Wert eintragen (z.B. 4.8)",
  "reviewCount": "TODO: echten Wert eintragen (z.B. 47)",
  "bestRating": "5",
  "worstRating": "1"
}
```

**Wichtig:** `ratingValue` und `reviewCount` müssen vom User aus dem Google Business Profile übernommen werden. Keine Platzhalterwerte im produktiven Code.

---

## Phase 3 — AI SEO / Answer Engine Optimization

### Kontext

ChatGPT, Perplexity und Google AI Overviews bevorzugen Seiten, die eine Frage direkt und kompakt beantworten. Drei Maßnahmen machen Artikel zitierfähig.

### 3a — DefinitionBox-Komponente

**Neue Datei:** `src/components/DefinitionBox.astro`

Ein hervorgehobener Kasten direkt nach dem Artikel-Intro. Enthält die Kernfrage des Artikels in 2–3 prägnanten Sätzen. Perplexity und ChatGPT bevorzugen diese Blöcke für Direktzitate.

**Design:** Grüner linker Rand (`border-l-4 border-simsek-green`), leicht getönter Hintergrund (`bg-simsek-green/5`), `<p class="font-medium">` für den Inhalt.

**Verwendung in [slug].astro:** Als erste Komponente nach dem `<Content />`-Block, befüllt aus neuem Frontmatter-Feld `definition: string`.

### 3b — FAQBlock-Komponente mit Schema

**Neue Datei:** `src/components/FAQBlock.astro`

Props: `faqs: Array<{ q: string; a: string }>`

Rendert:
- HTML: Akkordeon-Liste (details/summary oder einfache div-Struktur)
- Schema: `FAQPage` JSON-LD in `slot="head"` injiziert

**Verwendung in [slug].astro:** Vor dem CTA-Block, wenn `beitrag.data.faq` vorhanden ist.

**Frontmatter-Erweiterung in content.config.ts:**
```typescript
faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
definition: z.string().optional(),
```

### 3c — speakable-Schema in [slug].astro

Markiert zitierfähige Abschnitte für AI-Systeme:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".definition-box", "article h2:first-of-type + p"]
  }
}
```

Wird dem bestehenden Article-Schema als zusätzliches Objekt in `slot="head"` hinzugefügt.

### 3d — Bestehende Artikel befüllen

Alle 7 Ratgeber-Artikel bekommen `definition` und `faq` im Frontmatter. Priorität:
1. `gehalt-logopaedie-nrw` (höchstes Suchvolumen)
2. `bewerbung-logopaedie-tipps`
3. `ausbildung-nrw-2026`
4. Restliche 4 Artikel

---

## Dateien die geändert / erstellt werden

| Datei | Aktion |
|---|---|
| `src/pages/gehalt.astro` | Löschen → Inhalt wird zu `.md` |
| `src/pages/4-tage-woche.astro` | Löschen → Inhalt wird zu `.md` |
| `src/pages/bilingual.astro` | Löschen → Redirect |
| `src/content/ratgeber/gehalt-logopaedie-nrw.md` | Neu erstellen |
| `src/content/ratgeber/4-tage-woche-logopaedie.md` | Neu erstellen |
| `src/content/ratgeber/bilinguale-sprachtherapie.md` | Inhalt ergänzen |
| `astro.config.mjs` | Redirects hinzufügen |
| `src/pages/ratgeber/index.astro` | CollectionPage-Schema |
| `src/pages/gehaltsrechner.astro` | WebApplication-Schema |
| `src/pages/index.astro` | AggregateRating im LocalBusiness-Schema |
| `src/components/DefinitionBox.astro` | Neu erstellen |
| `src/components/FAQBlock.astro` | Neu erstellen |
| `src/pages/ratgeber/[slug].astro` | DefinitionBox, FAQBlock, speakable-Schema |
| `src/content.config.ts` | `faq` und `definition` Felder ergänzen |
| Alle 7 `.md`-Artikel | `faq` und `definition` im Frontmatter befüllen |

---

## Erfolgskriterien

- [ ] `/gehalt/` → 301 → `/ratgeber/gehalt-logopaedie-nrw/` verifiziert
- [ ] `/4-tage-woche/` → 301 → `/ratgeber/4-tage-woche-logopaedie/` verifiziert
- [ ] Google Rich Results Test: valides `CollectionPage` auf `/ratgeber/`
- [ ] Google Rich Results Test: valides `WebApplication` auf `/gehaltsrechner/`
- [ ] Google Rich Results Test: `AggregateRating` im LocalBusiness-Schema auf Index
- [ ] `FAQPage`-Schema auf mindestens 3 Ratgeber-Artikeln valide
- [ ] `speakable`-Schema auf Ratgeber-Artikeln vorhanden
- [ ] Keine internen Links mehr auf alte URLs `/gehalt/`, `/4-tage-woche/`, `/bilingual/`

---

## Nicht im Scope

- Neue Ratgeber-Artikel schreiben (separater Task)
- Analytics-Integration
- Google Search Console Konfiguration (manuell)
- Backlink-Aufbau
