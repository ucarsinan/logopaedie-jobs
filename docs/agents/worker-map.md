# Worker Map — logopaedie-jobs

Diese Datei ist die dauerhafte Zuordnung fuer Agentenarbeit.

## Worker A — Public Website und SEO

Zustaendig fuer:

- Landingpages
- Joblisten
- Sitemap, Robots, Canonicals
- Redirects
- strukturierte Inhalte und Indexierbarkeit

Typische Dateien:

- `src/pages/`
- `src/components/`
- `astro.config.mjs`
- `public/robots.txt`

## Worker B — Bewerbungs- und Formularfluss

Zustaendig fuer:

- Bewerbungsformulare
- Validierung
- API-Routen fuer Bewerbungen/Jobs
- Fehler- und Erfolgsmeldungen
- Datenschutztexte im Formularfluss

Typische Dateien:

- `src/pages/jobs/`
- `src/pages/api/`
- Zod-Schemas

## Worker C — Supabase, Admin und Datenmodell

Zustaendig fuer:

- Supabase-Schema
- Admin-Bereich
- Zugriffsschutz
- Datenbankregeln und Datenlebenszyklus

Typische Dateien:

- `supabase/`
- `src/pages/admin/`
- serverseitige API-/Datenzugriffe

## Worker D — Designsystem und UI-Komponenten

Zustaendig fuer:

- Navigation
- Footer
- Komponenten
- Responsive Verhalten
- Accessibility

Typische Dateien:

- `src/components/`
- Layouts und globale Styles

## Worker E — CI, Tooling und Deploy

Zustaendig fuer:

- Build-/Verify-Skripte
- GitHub Actions
- Vercel-Konfiguration
- Env-Beispiele
- Projekt-Dokumentation

Typische Dateien:

- `scripts/`
- `.github/workflows/`
- `package.json`
- `.env.example`
- Dokumentation
