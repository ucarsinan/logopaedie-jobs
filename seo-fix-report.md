# SEO-Fix-Bericht — logopädiejobs.de

**Datum:** 2026-05-23
**Bearbeiter:** Claude Code
**Auftrags-ID:** seo-fix-2026-ratgeber-trailing-slash

---

## 1. Zusammenfassung in einem Absatz

Die fehlerhafte `/ratgeber/`-Wildcard-Regel in `vercel.json` wurde durch zwei korrekte Regeln mit `:slug+` ersetzt, die beide Slash-Varianten der Quelle abfangen und direkt (1 Hop) auf die kanonische Trailing-Slash-Form `/berufshandbuch/<slug>/` weiterleiten. Der lokale Build lief fehlerfrei durch (~5,2 s) und erzeugte sauberes HTML mit korrekten Canonical-Tags (Punycode + Trailing-Slash) sowie eine valide Sitemap mit 18 kanonischen URLs. Im Code gibt es keine internen Links mehr auf `/ratgeber/` — der einzige Treffer ist der Dateisystem-Basispfad der Content-Collection und wurde bewusst nicht angefasst. `astro.config.mjs` setzt `trailingSlash` und `build.format` nicht explizit (Astro-Defaults greifen, Build-Ergebnis korrekt) — laut Auftrag wurde dies nicht selbständig geändert, sondern unter „Offene Fragen" dokumentiert. Der Commit ist erstellt, aber noch nicht gepusht.

## 2. Repo-Inventar (Ist-Zustand vor Änderung)

- **Astro-Version:** 6.1.7 (`@astrojs/sitemap` 3.7.2, `@astrojs/vercel` 10.x)
- **Vercel-Config:** vorhanden, `vercel.json` (2336 Bytes, Repo-Root)
- **Anzahl Routen in src/pages:** 20 Dateien
- **Routen-Liste:**
  - `src/pages/4-tage-woche.astro`
  - `src/pages/404.astro`
  - `src/pages/admin/actions/approve/[id].ts`
  - `src/pages/admin/actions/logout.ts`
  - `src/pages/admin/actions/reject/[id].ts`
  - `src/pages/admin/jobs/index.astro`
  - `src/pages/admin/login.astro`
  - `src/pages/api/jobs/submit.ts`
  - `src/pages/berufshandbuch/[slug].astro`
  - `src/pages/berufshandbuch/index.astro`
  - `src/pages/bilingual.astro`
  - `src/pages/cron/expire-jobs.ts`
  - `src/pages/datenschutz.astro`
  - `src/pages/gehalt.astro`
  - `src/pages/gehaltsrechner.astro`
  - `src/pages/impressum.astro`
  - `src/pages/index.astro`
  - `src/pages/jobs/[slug].astro`
  - `src/pages/jobs/index.astro`
  - `src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro`
  - `src/pages/jobs/neu.astro`
- **Content Collections:** eine Collection, geladen aus `./src/content/ratgeber` (13 Markdown-Dateien), gerendert unter der Route `/berufshandbuch/<slug>/` via `src/pages/berufshandbuch/[slug].astro`. Dateien: `arbeiten-duisburg`, `ausbildung-nrw-2026`, `bewerbung-logopaedie-tipps`, `bilinguale-sprachtherapie`, `deutsch-tuerkische-logopaedie-duisburg`, `4-tage-woche-logopaedie`, `freie-praxis-oder-klinik-logopaedie`, `gehalt-logopaedie-nrw`, `logopaedie-bewerbung-ohne-anschreiben`, `logopaedin-duisburg-gesucht`, `stottertherapie-spezialisierung`, `teilzeit-modelle`, `willkommen`.

## 3. Durchgeführte Änderungen

### 3.1 vercel.json

**Vorher:**
```json
{
  "source": "/ratgeber/:slug*",
  "destination": "/berufshandbuch/:slug*",
  "permanent": true
},
```

**Nachher:**
```json
{
  "source": "/ratgeber/:slug+",
  "destination": "/berufshandbuch/:slug+/",
  "permanent": true
},
{
  "source": "/ratgeber/:slug+/",
  "destination": "/berufshandbuch/:slug+/",
  "permanent": true
},
```

**Begründung:** `:slug+` matched ein oder mehr Segmente (statt null-oder-mehr bei `:slug*`) und vermeidet Konflikte mit den separaten Top-Level-Regeln `/ratgeber` und `/ratgeber/`. Beide Quell-Varianten (mit/ohne Trailing-Slash) werden explizit abgedeckt, und die Destination trägt nun einen Trailing-Slash, sodass Google direkt (1 Hop) auf die kanonische Ziel-URL geleitet wird. Damit liefert auch `/ratgeber/<slug>/` (zuvor 404) korrekt 308.

Die Top-Level-Regeln (`/ratgeber`, `/ratgeber/`) und alle übrigen Redirects (`/gehalt`, `/4-tage-woche`, `/bilingual`, `/index.html`, `/:path*/index.html`) sowie der `crons`-Block blieben unverändert.

## 4. Validierungen ohne Änderung

| Komponente | Status | Befund |
|---|---|---|
| astro.config.mjs `site` | ✓ | `https://xn--logopdiejobs-kcb.de` (Punycode, korrekt) |
| astro.config.mjs `trailingSlash` | ⚠️ | **Nicht explizit gesetzt** (Astro-Default `'ignore'`). Nicht eigenmächtig geändert — siehe „Offene Fragen". Build erzeugt dennoch korrekt Trailing-Slash-URLs (Directory-Format). |
| astro.config.mjs `build.format` | ⚠️ | **Nicht explizit gesetzt** (Astro-Default `'directory'`). Nicht geändert — siehe „Offene Fragen". Output enthält durchgehend `<slug>/index.html`. |
| BaseLayout Canonical-Tag | ✓ | `src/layouts/Layout.astro:32` — `new URL(canonicalUrl ?? Astro.url.pathname, Astro.site)`, nutzt `Astro.site` (kein Hardcode), liefert Punycode + Trailing-Slash. |
| robots.txt | ✓ | unverändert, vorher live verifiziert |
| Sitemap-Plugin-Config | ✓ | `@astrojs/sitemap` mit `filter`, der `/admin/` und 6 Noindex-Landingpages ausschließt; erzeugt 18 kanonische URLs. |

## 5. Interne Links — Audit-Ergebnis

### 5.1 Treffer für `/ratgeber/` im Code

| Datei | Zeile | Treffer | Aktion |
|---|---|---|---|
| `src/content.config.ts` | 7 | `base: './src/content/ratgeber'` | Belassen — Dateisystem-Basispfad der Content-Collection, **kein** URL/Link. Änderung würde den Build brechen. |

Keine `/ratgeber/`-**URL**-Referenzen (Links/hrefs) im gesamten Code, Public-Ordner oder Content.

### 5.2 Treffer für Umlaut-Domain hartkodiert

| Datei | Zeile | Treffer | Aktion |
|---|---|---|---|
| `src/content/ratgeber/logopaedin-duisburg-gesucht.md` | 20 | `… direkt auf logopädiejobs.de.` | Belassen — Fließtext (Markenname im FAQ-Antworttext), kein Link/Canonical, nicht SEO-relevant. Punycode im Fließtext wäre eine UX-Verschlechterung. |
| `src/pages/admin/login.astro` | 44 | `<h1>Admin · logopädiejobs.de</h1>` | Belassen — Anzeigetext der noindex/nofollow-Admin-Seite, kein Link. |

### 5.3 Treffer für www.-Variante hartkodiert

| Datei | Zeile | Treffer | Aktion |
|---|---|---|---|
| — | — | keine Treffer | — |

### 5.4 noindex-Tags

| Datei | Zeile | Bewertung |
|---|---|---|
| `src/layouts/Layout.astro` | 51 | Erwartungsgemäß — `noindex,nofollow` nur für Legal-Seiten (`/impressum`, `/datenschutz`), sonst Index-Default. |
| `src/pages/bilingual.astro` | 11 | Erwartungsgemäß — `noindex,follow`; Seite ist Redirect-Quelle und aus Sitemap ausgeschlossen. |
| `src/pages/gehalt.astro` | 13 | Erwartungsgemäß — `noindex,follow`; analog. |
| `src/pages/4-tage-woche.astro` | 11 | Erwartungsgemäß — `noindex,follow`; analog. |
| `src/pages/admin/jobs/index.astro` | 46 | Erwartungsgemäß — Admin, `noindex,nofollow`. |
| `src/pages/admin/login.astro` | 31 | Erwartungsgemäß — Admin, `noindex,nofollow`. |
| `public/admin/index.html` | 6 | Erwartungsgemäß — Admin, `noindex,nofollow`. |

## 6. Build-Ergebnis

- **`npm run build`:** Erfolg
- **Build-Dauer:** ~5,2 s (real) — Server built in 3,68 s, Vercel-Bundling abgeschlossen
- **Anzahl generierter HTML-Dateien:** 26 (`find dist -name "*.html" | wc -l`)
- **Sitemap-Inhalt (Auszug, `dist/client/sitemap-0.xml`):**

```
<loc>https://xn--logopdiejobs-kcb.de/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/4-tage-woche-logopaedie/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/arbeiten-duisburg/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/ausbildung-nrw-2026/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/bewerbung-logopaedie-tipps/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/bilinguale-sprachtherapie/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/deutsch-tuerkische-logopaedie-duisburg/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/freie-praxis-oder-klinik-logopaedie/</loc>
<loc>https://xn--logopdiejobs-kcb.de/berufshandbuch/gehalt-logopaedie-nrw/</loc>
```

(Sitemap-Hinweis: Bei aktivem Vercel-Adapter liegt die Sitemap unter `dist/client/sitemap-0.xml` bzw. `.vercel/output/static/sitemap-0.xml`, nicht direkt unter `dist/`. Inhaltlich identisch und valide, 18 `<loc>`-Einträge.)

- **Canonical-Tag Stichprobe (`dist/client/berufshandbuch/ausbildung-nrw-2026/index.html`):**

```
<link rel="canonical" href="https://xn--logopdiejobs-kcb.de/berufshandbuch/ausbildung-nrw-2026/">
```

- **`/berufshandbuch/`-Verzeichnisse im Build (`ls -1 dist/client/berufshandbuch/`):**

```
4-tage-woche-logopaedie
arbeiten-duisburg
ausbildung-nrw-2026
bewerbung-logopaedie-tipps
bilinguale-sprachtherapie
deutsch-tuerkische-logopaedie-duisburg
freie-praxis-oder-klinik-logopaedie
gehalt-logopaedie-nrw
index.html
logopaedie-bewerbung-ohne-anschreiben
logopaedin-duisburg-gesucht
stottertherapie-spezialisierung
teilzeit-modelle
willkommen
```

Alle 13 erwarteten Slug-Verzeichnisse + `index.html` vorhanden. Vollständig.

## 7. Beobachtungen ohne Aktion

- **Redirect-Quellseiten existieren zusätzlich als echte Seiten:** `/4-tage-woche`, `/gehalt`, `/bilingual` sind sowohl in `vercel.json` als Redirect (auf `/berufshandbuch/...`) als auch als gebaute `.astro`-Seiten (`noindex,follow`, aus Sitemap ausgeschlossen) vorhanden. Vercel-Edge-Redirects greifen vor statischen Dateien, die Seiten sind also faktisch beschattet. Außerhalb des Auftrags-Scopes — nicht geändert.
- **Build nutzt den Vercel-Adapter** (`@astrojs/vercel`, `adapter: vercel()`) mit serverseitigen Endpunkten (`api/jobs/submit`, `cron/expire-jobs`, `admin/actions/*`). Output liegt daher unter `dist/client` + `dist/server` und `.vercel/output/`, nicht im flachen `dist/`-Layout, das die Aufgaben-Stichproben annahmen. Pfade in den Sanity-Checks entsprechend angepasst; inhaltlich alle Erwartungen erfüllt.
- **`image.domains`** in `astro.config.mjs` listet sowohl `"logopädiejobs.de"` als auch `"xn--logopdiejobs-kcb.de"` — unkritisch (nur Image-Optimierungs-Whitelist), nicht geändert.

## 8. Offene Fragen

- **Frage 1:** `astro.config.mjs` setzt `trailingSlash` **nicht explizit** (Default `'ignore'`). Der Build erzeugt zwar durchgehend Directory-URLs mit Trailing-Slash und die kanonische URL-Form ist live korrekt, aber ein explizites `trailingSlash: 'always'` würde die Absicht festschreiben und Edge-Case-Inkonsistenzen verhindern. — Empfehlung: In separatem, bewusst freigegebenem Commit auf `'always'` setzen (laut Auftrag nicht ohne Freigabe, da weitreichende Folgen).
- **Frage 2:** `build.format` ist ebenfalls **nicht explizit** gesetzt (Default `'directory'`, Output korrekt). — Empfehlung: optional `build: { format: 'directory' }` explizit ergänzen, gemeinsam mit Frage 1; aktuell kein funktionaler Handlungsbedarf.

## 9. Vorgeschlagene Post-Deploy-Verifikation

Nach `git push` und erfolgreichem Vercel-Build sollte folgende Verifikation durchgeführt werden:

```bash
# Alle 6+ Search-Console-404-URLs neu prüfen
for path in \
  "/ratgeber/bewerbung-logopaedie-tipps/" \
  "/ratgeber/ausbildung-nrw-2026/" \
  "/ratgeber/stottertherapie-spezialisierung/" \
  "/ratgeber/arbeiten-duisburg/" \
  "/ratgeber/bilinguale-sprachtherapie/" \
  "/ratgeber/willkommen/" \
  "/ratgeber/gehalt-logopaedie-nrw/"; do
  echo "→ $path"
  curl -sI "https://xn--logopdiejobs-kcb.de${path}" | grep -iE "HTTP|location"
  echo "---"
done
```

**Erwartetes Ergebnis:** jede Zeile zeigt `HTTP/2 308` und `location: /berufshandbuch/<slug>/` (mit Trailing-Slash).

## 10. Empfohlene Search-Console-Folge-Aktion

1. Search Console öffnen → Property `xn--logopdiejobs-kcb.de` oder `logopädiejobs.de`
2. Linkes Menü → **Seiten**
3. Bei folgenden Kategorien auf **„Fehlerbehebung überprüfen"** klicken:
   - „Nicht gefunden (404)" — primäre Zielgruppe des Fixes
   - „Seite mit Weiterleitung"
   - „Alternative Seite mit kanonischem Tag"
   - „Duplikat – Google hat eine andere Seite ..."
4. Erwartung: 7–14 Tage bis erste Indexierungs-Recovery, 4–6 Wochen bis volle Wirkung in Klick-/Impressionsdaten.

## 11. Git-Status

- **Branch:** main
- **Letzter Commit (Branch-Spitze `main`):** `fix(seo): /ratgeber/-Wildcard-Redirect mit Trailing-Slash-Support` — aktueller Hash via `git log -1` (zum Berichtszeitpunkt `957a156`, ggf. durch finalen Amend abweichend)
- **Push-Status:** Noch nicht gepusht (warte auf Bestätigung durch Nutzer)
- **Geänderte Dateien:** `vercel.json` (Fix), `.gitignore` (`*.bak` ergänzt), `seo-fix-report.md` (neu)

---

**Ende des Berichts.**
