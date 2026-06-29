# PROJECT_REALITY

Last audit: 2026-06-29
Recommendation: simplify
Confidence: high

## Product Decision

`logopaedie-jobs` ist aktuell keine klassische Jobboerse. Die Website agiert zum jetzigen Zeitpunkt nur fuer
die Praxis fuer Logopaedie Simsek. Andere Arbeitgeber sollen keine Anzeigen einreichen koennen und keine
fremden Anzeigen duerfen auf der Website erscheinen.

Konsequenz: Supabase, Datenbanktabellen, Arbeitgeber-Self-Service, Admin-Moderation und ein
Mehr-Arbeitgeber-Einreichungsflow sind aktuell nicht erforderlich und nicht freigegeben.

## Core Problem
- Problem: Die Praxis fuer Logopaedie Simsek braucht qualifizierte Bewerbungen auf eigene offene Stellen.
- Affected user: Logopaedinnen/Sprachtherapeutinnen, die sich bei der Praxis Simsek bewerben koennen.
- Painful current workflow: Bewerberinnen muessen Stellen, Arbeitsmodell, Gehalt und Praxispassung schnell einschaetzen koennen.
- Desired real-world outcome: Bewerbungen und Anfragen fuer echte Praxis-Simsek-Stellen.
- Success criteria: Qualifizierte Bewerbungen/Anfragen fuer die Praxis, valide JobPosting-Sichtbarkeit fuer eigene Stellen, klare Datenschutz- und Kontaktwege.

## Current State
- Implemented: Astro/Vercel-Site, statische Praxis-Stelle, Berufshandbuch-Content, Decap-CMS-Konfiguration und Consent-Gating.
- Not approved: Supabase-basierte dynamische Jobdetailroute, oeffentliches `/jobs/neu/`-Einreichformular, dynamische Mehr-Arbeitgeber-Uebersicht, Submit-API, Adminliste, Expire-Cron-Code, `.env.example` fuer Supabase und Supabase-Migration.
- Last stopping point: Der zuvor vorbereitete Mehr-Arbeitgeber-/Supabase-Scope wurde durch die Produktentscheidung vom 2026-06-29 gestoppt.

## Reality Findings
- Local evidence: Die getrackte Website enthaelt bereits eine eigene Praxis-Stelle und SEO-/Ratgeber-Inhalte.
- Stopped scope: Supabase, Einreichformular fuer externe Arbeitgeber, Admin-Moderation und dynamische Mehr-Arbeitgeber-Jobliste gehoeren nicht mehr zum aktuellen Zielbild.
- Best-practice implications: Komplexitaet entfernen, statischen Praxis-Stellenflow staerken und erst bei neuer ausdruecklicher Produktentscheidung ueber Datenbank/Jobboerse sprechen.
- Key uncertainty: Welche eigene Praxis-Stelle aktuell aktiv beworben werden soll und welcher Bewerbungsweg bevorzugt ist.

## Gaps And Risks
- Missing essentials: Nach der Bereinigung pruefen, ob wirklich keine aktive Supabase-/Jobboard-Route mehr im Build haengt.
- Drift warnings: Mehr-Arbeitgeber-Jobboerse, Arbeitgeber-Dashboard, Supabase-Moderation, Cron und Premium-Listings sind aktuell ausserhalb des Zielbilds.
- Risks: Alte historische Planungsdokumente koennen missverstanden werden; aktive Arbeitsregeln muessen deshalb AGENTS.md und PROJECT_CONTEXT.md folgen.

## Next Logical Step
1. Step: Mehr-Arbeitgeber-/Supabase-Artefakte aus dem aktiven Codepfad entfernen und den Build pruefen.
   Why: Das aktuelle Produkt soll nur Praxis-Simsek-Stellen zeigen.
   Validation: Build bleibt gruen, `/jobs/` und die eigene Stellenanzeige funktionieren ohne Datenbankpflicht.
   Stop/continue rule: Keine Datenbank-/Jobboersen-Arbeit fortsetzen, bis Sinan sie ausdruecklich neu freigibt.

## Do Not Build Yet
- Stripe/Premium-Listings
- Arbeitgeber-Dashboard
- Supabase-Jobboerse
- oeffentliches Stellen-Einreichformular fuer externe Arbeitgeber
- Admin-Moderation fuer fremde Anzeigen
- weitere Content-Cluster ohne Messziel
- KI-Auto-Moderation
- komplexe Filterlogik vor echter Jobdatenbasis

## Source Links
- Google Search Central JobPosting: https://developers.google.com/search/docs/appearance/structured-data/job-posting
