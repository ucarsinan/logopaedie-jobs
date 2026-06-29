# PROJECT_CONTEXT.md

## Projekt

Name: logopaedie-jobs

## Zweck

`logopaedie-jobs` ist eine Astro/Vercel-Website fuer Logopaedie-Jobs. Sie verbindet oeffentliche SEO-/Landingpages mit Joblisten, Bewerbungswegen, Admin-Funktionen und Supabase-Anbindung.

## Stack

- Astro 6
- Vercel Adapter
- Tailwind CSS v4
- Supabase Client
- Zod fuer Validierung
- Sitemap-Integration

## Wichtige Systembereiche

| Bereich | Verantwortung |
| --- | --- |
| `src/pages/` | oeffentliche Seiten, Admin-Seiten, API-Routen |
| `src/components/` | Navigation, Footer, UI-Bausteine |
| `src/pages/api/` | Formular-/Job-APIs |
| `supabase/` | Datenbank-/Schema-/Policy-Artefakte |
| `astro.config.mjs` | Site-URL, Adapter, Sitemap-Filter, Vite/Tailwind |
| `public/` | statische Assets |
| `.github/workflows/` | CI/Automation |

## Kritische Grenzen

- Bewerbungsdaten sind personenbezogen und duerfen nicht ungefragt offengelegt oder in Fixtures kopiert werden.
- Supabase-Zugriffe brauchen klare Trennung zwischen Public-, Admin- und Server-Kontext.
- Admin-Routen duerfen nicht indexierbar sein.
- Datenschutz, Impressum, Consent und Formulartexte sind produktrelevant.
- Domain/Sitemap/Redirect-Aenderungen koennen SEO direkt beeinflussen.

## Aktueller Installationsstand

Der Agentic-Workflow ist Prozess- und Governance-Struktur. Er ist keine Produkt-Agentenfunktion und fuehrt keine Runtime-Automatisierung ein.
