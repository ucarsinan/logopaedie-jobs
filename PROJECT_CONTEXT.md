# PROJECT_CONTEXT.md

## Projekt

Name: logopaedie-jobs

## Verbund mit der Praxiswebsite

Dieses Repository wird gemeinsam mit der Praxiswebsite betrachtet:

| Bereich | Repository | Produktive Domain | Aufgabe |
| --- | --- | --- | --- |
| Recruiting | `/Users/sinan/Development/logopaedie-jobs` | `logopädiejobs.de` | Stellen, Arbeitgeberkommunikation und Bewerbungswege der Praxis für Logopädie Şimşek |
| Praxis | `/Users/sinan/Development/logopaedie-simsek-3` | `logopaedie-simsek.de` | Praxis-, Therapie-, Team- und Kontaktinformationen auf Deutsch und Türkisch |

Bei Aufgaben zu SEO, Karriere, internen Links, Marke oder Conversion sind beide Websites auf widerspruchsfreie Aussagen und eine klare Suchintention zu prüfen. Änderungen bleiben dennoch repository-spezifisch: Vor Arbeiten im Schwester-Repository sind dessen eigene `AGENTS.md` und Pflichtdokumente zu lesen und dessen Checks auszuführen.

## Zweck

`logopaedie-jobs` ist aktuell eine Astro/Vercel-Website fuer Stellen und Karriereinhalte der Praxis für Logopädie Şimşek.
Sie ist zum jetzigen Zeitpunkt keine offene Jobboerse und keine Plattform fuer externe
Arbeitgeberanzeigen.

## Aktuelle Produktgrenze

- Stellenangebote beziehen sich auf die Praxis für Logopädie Şimşek.
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
