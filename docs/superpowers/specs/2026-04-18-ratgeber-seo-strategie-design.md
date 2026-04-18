# Ratgeber-Ausbau + SEO-Infrastruktur — Design Spec

**Datum:** 2026-04-18  
**Projekt:** logopädiejobs.de  
**Status:** Approved

---

## Ziel

Den bestehenden `/ratgeber/` zum SEO-Hauptkanal ausbauen und gleichzeitig die fehlende technische SEO-Infrastruktur nachrüsten. Keine URL-Migration, kein separater Blog — der Ratgeber bleibt der Content-Hub.

---

## Sektion 1: Content-Strategie (Pillar-Cluster)

### Architektur

Jedes Hauptthema hat einen langen Pillar-Artikel (1.500+ Wörter, breite Keywords) und mehrere kurze Cluster-Artikel (Long-Tail-Keywords), die intern auf den Pillar verlinken.

```
/ratgeber/
├── [Pillar] gehalt-logopaedie-nrw/
│   ├── [Cluster] tarif-vs-privatpraxis/
│   ├── [Cluster] gehaltsverhandlung-tipps/
│   └── [Cluster] nrw-vs-bundesschnitt/
│
├── [Pillar] 4-tage-woche-logopaedie/
│   ├── [Cluster] teilzeit-modelle-vergleich/
│   └── [Cluster] work-life-balance/
│
├── [Pillar] logopaedin-duisburg-karriere/
│   ├── [Cluster] ausbildung-nrw-2026/
│   └── [Cluster] arbeiten-duisburg/
│
└── [Pillar] bilinguale-logopaedie/
    └── [Cluster] tuerkisch-deutsch-therapie/
```

Bestehende 6 Artikel werden in diese Struktur eingeordnet — keine URL-Änderungen, nur Frontmatter-Kategorisierung und interne Verlinkung nachrüsten.

### Kategorien

| Kategorie | Zielgruppe | Beispiel-Keywords |
|---|---|---|
| Karriere | Stellensuchende | "Logopädin Duisburg Stelle", "Bewerbung Logopädie" |
| Gehalt | Stellensuchende | "Gehalt Logopädie NRW 2026", "Tarifgehalt" |
| Arbeitszeit | Stellensuchende | "4-Tage-Woche Logopädie", "Teilzeit Sprachtherapie" |
| Fachwissen | Alle Logopädinnen | "Stottertherapie", "bilinguale Therapie" |
| Für Patienten *(neu)* | Eltern, Betroffene | "Was macht eine Logopädin?", "Logopädie Duisburg" |

Die Kategorie "Für Patienten" bringt Suchanfragen von Eltern/Betroffenen herein — sekundärer Effekt: mehr Domainautorität, die auf Job-Seiten ausstrahlt.

### Content-Kalender

- **Monat 1-2:** Bestehende Pillar-Artikel auf 1.500+ Wörter ausbauen
- **Ab Monat 3:** 1 neuer Cluster-Artikel/Monat, 1 neuer Pillar alle 2 Monate
- **Prinzip:** Evergreen-First — kein Datum im Titel, regelmäßig aktualisieren

---

## Sektion 2: Technische SEO-Infrastruktur

### Was bereits vorhanden ist

- Statisches HTML (Astro) → Core Web Vitals Basis exzellent
- Breadcrumb-Daten im Layout-Komponenten
- `title` und `description` pro Seite
- Kategorisierte Artikel mit `pubDate` im Frontmatter

### Was gebaut wird

#### 1. Sitemap + robots.txt

- `@astrojs/sitemap` in `astro.config.mjs` integrieren
- Alle Seiten inkl. Ratgeber-Artikel in `sitemap.xml` automatisch
- `pubDate` als `lastmod` in Sitemap übergeben
- `/public/robots.txt` als statische Datei

#### 2. Schema.org Structured Data (JSON-LD)

Eingebettet im `<head>` via Layout-Prop, pro Seiten-Typ unterschiedlich:

| Seite | Schema-Typ | Effekt |
|---|---|---|
| `index.astro` | `JobPosting` + `LocalBusiness` | Google Jobs Rich Results |
| `/ratgeber/[slug]` | `Article` + `BreadcrumbList` | Artikel-Rich-Snippet mit Autor |
| `/ratgeber/` | `CollectionPage` | Hub klar als Sammlung |
| FAQ-Section auf Index | `FAQPage` | FAQ-Accordion direkt in SERP |
| `/gehaltsrechner/` | `WebApplication` | Tool-Snippet |

`JobPosting` auf der Startseite ist der größte Quick Win — Google Jobs ist ein eigener Kanal für Stellenanzeigen.

#### 3. Open Graph + Twitter Cards

- `og:title`, `og:description`, `og:image`, `og:type` in Layout-`<head>`
- Fallback-OG-Image für Artikel ohne `heroImage` (statisches Bild in `/public/`)
- Relevant für LinkedIn-Sharing (Zielgruppe Logopädinnen)

#### 4. Kanonische URLs

- `<link rel="canonical" href="...">` im Layout für jede Seite
- Verhindert Duplicate-Content-Probleme bei Astro trailing-slash Varianten

#### 5. Interne Verlinkung

- Neues Frontmatter-Feld `relatedArticles: string[]` in Ratgeber-Schema
- "Weitere Artikel"-Block am Ende jedes Ratgeber-Artikels (2-3 Links)
- Pillar verlinkt auf Cluster, Cluster verlinkt zurück auf Pillar

### Implementierungs-Reihenfolge (nach Priorität)

1. `JobPosting` + `LocalBusiness` Schema auf Index
2. Sitemap (`@astrojs/sitemap`) + robots.txt
3. Canonical URLs im Layout
4. `Article` Schema auf `/ratgeber/[slug]`
5. OG-Images im Layout
6. `relatedArticles` Frontmatter + Verlinkungsblock

### Nicht im Scope

- Google Search Console Setup (Account-Arbeit, kein Code)
- Backlink-Aufbau (außerhalb des Projekts)
- Analytics (separates Thema)

---

## Dateien die geändert werden

| Datei | Änderung |
|---|---|
| `astro.config.mjs` | `@astrojs/sitemap` hinzufügen, `site`-URL setzen |
| `src/layouts/Layout.astro` | Canonical URL, OG-Tags, Schema-Prop |
| `src/pages/index.astro` | `JobPosting` + `LocalBusiness` + `FAQPage` JSON-LD |
| `src/pages/ratgeber/[slug].astro` | `Article` Schema, `relatedArticles`-Block |
| `src/pages/ratgeber/index.astro` | `CollectionPage` Schema |
| `src/pages/gehaltsrechner.astro` | `WebApplication` Schema |
| `src/content/config.ts` | `relatedArticles` Feld in Ratgeber-Schema |
| `public/robots.txt` | neu erstellen |
| `public/og-default.jpg` | Fallback OG-Image (manuell hinzufügen) |

---

## Erfolgskriterien

- [ ] `sitemap.xml` unter `logopädiejobs.de/sitemap-index.xml` erreichbar
- [ ] `robots.txt` unter `logopädiejobs.de/robots.txt` erreichbar
- [ ] Google Rich Results Test zeigt valides `JobPosting` Schema auf Index
- [ ] Google Rich Results Test zeigt valides `Article` Schema auf Ratgeber-Artikeln
- [ ] Jede Seite hat `<link rel="canonical">` im `<head>`
- [ ] Ratgeber-Artikel haben `relatedArticles`-Block wenn Feld befüllt
- [ ] OG-Tags sichtbar wenn URL in LinkedIn/Slack geteilt wird
