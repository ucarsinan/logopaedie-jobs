# Logopädiejobs.de

Recruitingwebsite der **Praxis für Logopädie Şimşek** für eigene offene Stellen in Duisburg. Das Projekt ist keine allgemeine Jobbörse und nimmt keine Stellenanzeigen externer Arbeitgeber an.

## Zweck

Die Website macht freigegebene Arbeitsbedingungen sichtbar, beantwortet typische Berufs- und Bewerbungsfragen und führt zu einem unverbindlichen Erstkontakt. Maßgeblich für Arbeitgeberversprechen ist die zentrale `EMPLOYER_TRUTH.md` im Strategie-Repository.

## Stack

- Astro 6 mit Vercel Adapter
- Tailwind CSS v4
- statische Seiten und Sitemap
- optionales GA4-Consent-Gating; Vercel Web Analytics ist separat eingebunden

## Entwicklung

```bash
npm run dev
npm run build
npm run preview
./scripts/verify.sh
```

## Wichtige Bereiche

| Bereich | Pfad |
| --- | --- |
| Seiten und Stellen | `src/pages/` |
| UI und Bewerbungsfluss | `src/components/` |
| Ratgeberinhalte | `src/content/ratgeber/` |
| Gehaltsdaten | `src/lib/gehalt-daten.ts` |
| Assets, Robots und `llms.txt` | `public/` |
| Sitemap und Vercel | `astro.config.mjs`, `vercel.json` |

## Produktgrenzen

- Nur Stellen der Praxis für Logopädie Şimşek
- keine Supabase-/Mehr-Arbeitgeber-Jobbörse
- keine produktiven Bewerbungsdaten in Tests oder Dokumentation
- keine neuen Arbeitgeberversprechen außerhalb der freigegebenen Arbeitgeberwahrheit
- keine Tracking-, Ads-, Vercel-, DNS- oder Indexierungsänderungen ohne Freigabe

## Projektkontext

Vor Änderungen zuerst `AGENTS.md`, `PROJECT_CONTEXT.md`, `PROJECT_REALITY.md`, `WORKFLOW.md`, `TESTING.md` und `SECURITY.md` lesen.

Produktion: <https://xn--logopdiejobs-kcb.de/>
