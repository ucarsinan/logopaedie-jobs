# TESTING.md

## Zentraler Check

```bash
./scripts/verify.sh
```

## Standardchecks

`./scripts/verify.sh` fuehrt lokal sichere Checks aus:

- optional `npm run check`, falls ein Check-Skript existiert
- optional `npx astro check`, falls `@astrojs/check` installiert ist
- `npm run build`
- `git diff --check`
- Whitespace-/EOF-Check fuer relevante untracked Dateien

## Freigabepflichtige Checks

Nur mit ausdruecklicher Freigabe:

- Tests gegen produktive Datenbanken oder externe Datenservices
- echte Bewerbungs- oder Kontaktdaten
- Vercel Deploy/Promote
- Live-Domain-/DNS-Pruefungen, die externe Dienste veraendern

## Kritische Testmatrix

| Bereich | Erwartete Pruefung |
| --- | --- |
| Jobseiten | Build, Links, leere/volle Joblisten |
| Bewerbungsformular | Validierung, Fehlertexte, Datenschutz |
| Admin | Zugriffsschutz, keine Indexierung |
| Daten/Backend | Kein ungefragt eingefuehrter Datenbankzwang, sichere Env-Grenzen, keine Secret-Leaks |
| SEO | Sitemap, Canonicals, Robots, Redirects |
| UI | Mobile Navigation, Formularzustände, Barrierefreiheit |
