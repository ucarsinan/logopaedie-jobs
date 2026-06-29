# PROJECT_CONTEXT.md

## Projekt

Name: logopaedie-jobs

## Zweck

`logopaedie-jobs` ist aktuell eine Astro/Vercel-Website fuer Stellen und Karriereinhalte der Praxis fuer
Logopaedie Simsek. Sie ist zum jetzigen Zeitpunkt keine offene Jobboerse und keine Plattform fuer externe
Arbeitgeberanzeigen.

## Aktuelle Produktgrenze

- Stellenangebote beziehen sich auf die Praxis fuer Logopaedie Simsek.
- Externe Arbeitgeber duerfen derzeit keine Anzeigen einreichen.
- Ein oeffentlicher Mehr-Arbeitgeber-Flow ist nicht freigegeben.
- Supabase, Datenbanktabellen, Admin-Moderation und Arbeitgeber-Self-Service sind aktuell kein Zielbild.
- Uncommitted Supabase-/Jobboard-Artefakte sind als Entwurf zu behandeln und duerfen nicht ohne neue Freigabe committed werden.

## Stack

- Astro 6
- Vercel Adapter
- Tailwind CSS v4
- Sitemap-Integration

## Wichtige Systembereiche

| Bereich | Verantwortung |
| --- | --- |
| `src/pages/` | oeffentliche Seiten, Admin-Seiten, API-Routen |
| `src/components/` | Navigation, Footer, UI-Bausteine |
| `src/pages/api/` | API-Routen, falls fuer Praxis-Flows noetig |
| `astro.config.mjs` | Site-URL, Adapter, Sitemap-Filter, Vite/Tailwind |
| `public/` | statische Assets |
| `.github/workflows/` | CI/Automation |

## Kritische Grenzen

- Bewerbungsdaten sind personenbezogen und duerfen nicht ungefragt offengelegt oder in Fixtures kopiert werden.
- Keine Datenbank-, Admin- oder Mehr-Arbeitgeber-Flows einfuehren, solange sie nicht explizit freigegeben sind.
- Admin-Routen duerfen nicht indexierbar sein, falls Admin-Funktionen spaeter wieder freigegeben werden.
- Datenschutz, Impressum, Consent und Formulartexte sind produktrelevant.
- Domain/Sitemap/Redirect-Aenderungen koennen SEO direkt beeinflussen.

## Aktueller Installationsstand

Der Agentic-Workflow ist Prozess- und Governance-Struktur. Er ist keine Produkt-Agentenfunktion und fuehrt keine Runtime-Automatisierung ein.
