# Recruiting-MVP Stellenstandard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine einzige validierte Stellenquelle für die Praxis für Logopädie Şimşek erzeugt konsistente sichtbare Inhalte, Bewerbungsinformationen und `JobPosting`-Daten über klar getrennte Domainrollen.

**Architecture:** Astro Content Collections bleiben die dateibasierte Quelle; eine kleine reine Domänenbibliothek berechnet abgeleitete Vergütungswerte und erzeugt das JobPosting-Objekt. `logopädiejobs.de` besitzt die konkrete Stelle, während die Praxiswebsite nur DE/TR-Arbeitgeberbrücken ohne eigenes JobPosting ausgibt. Bewerbungswege bleiben direkt beziehungsweise im bestehenden Kurzformular; es entstehen keine Konten oder neue Datenbanken.

**Tech Stack:** Astro 6, TypeScript, Astro Content Collections, Zod, Node Test Runner, Tailwind CSS 4, Vercel

**Spec:** `reports/2026-11-24-platform-discovery-v01/STELLENSTANDARD-V1.md`

## Global Constraints

- Aktuell ausschließlich Stellen der Praxis für Logopädie Şimşek; keine fremden Arbeitgeber.
- Markenname immer exakt `Praxis für Logopädie Şimşek`.
- Keine Datenbank, Authentifizierung, Lebenslaufspeicherung, Uploads oder Talentpool.
- Keine Bewerbungsinhalte oder personenbezogenen Werte in Tests, Analytics oder Reports.
- `logopädiejobs.de` ist die einzige konkrete `JobPosting`-Quelle.
- Praxis-Karriereseiten bleiben DE/TR-Arbeitgeberbrücken und erhalten kein `JobPosting`.
- Canonicals, Sitemap, Indexierbarkeit und Redirects müssen explizit geprüft werden.
- Produktive Veröffentlichung, Tracking, Deploy, Commit und Push benötigen ihre jeweilige ausdrückliche Freigabe.
- Offene Betriebsangaben werden nicht geraten.

## Review Focus

- Rundung: Stundenlohn bleibt Primärwert; abgeleitete Monatswerte müssen dieselbe Formel und Kennzeichnung nutzen.
- Statuswechsel: `PAUSED`, `FILLED` oder `EXPIRED` dürfen weder aktives JobPosting noch aktive Bewerbungsaussage erzeugen.
- Fristen: Nacht-, Wochenend- und Geschäftszeitanfragen müssen dem veröffentlichten Antwortfenster entsprechen.
- Sprachparität: Deutsche und türkische Praxisbrücke dürfen sich bei Rolle, Status und Ziel-URL nicht widersprechen.
- Datenschutz: Bewerbungswege und Tests dürfen keine echten oder persistierten Bewerberdaten einführen.

---

### Task 1: Offene Betriebsentscheidungen protokollieren

**Files:**
- Modify: `reports/2026-11-24-platform-discovery-v01/IST-SOLL-RECRUITING.md`
- Modify: `reports/2026-11-24-platform-discovery-v01/RECRUITING-MVP-BACKLOG.md`

**Interfaces:**
- Consumes: bestätigte Angaben der Praxis zu Tarif, Terminlast, Überstunden, Fortbildung, Einarbeitung und Antwortfenster.
- Produces: freigegebene Werte für das Content-Schema; keine Annahmen.

- [ ] **Step 1: Jede offene Angabe als bestätigt, bewusst allgemein oder nicht veröffentlichbar markieren**

Die Entscheidung muss Quelle, Datum und Freigabestatus enthalten, aber keine Bewerberdaten.

- [ ] **Step 2: Widersprüche zur heutigen Website als P1 festhalten**

Insbesondere Monatsgehalt und 12-Stunden-/Morgen-Aussage prüfen.

- [ ] **Step 3: Dokumentationsprüfung ausführen**

Run: `git diff --check`
Expected: PASS.

### Task 2: Validiertes Single-Employer-Stellenmodell einführen

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/jobs/logopaedin-sprachtherapeut-duisburg.json`
- Create: `src/lib/job-model.mjs`
- Create: `src/lib/job-publication-artifacts.mjs`
- Create: `tests/job-model.test.mjs`
- Create: `tests/job-publication-artifacts.test.mjs`

**Interfaces:**
- Consumes: freigegebene Werte aus Task 1.
- Produces: ein per JSDoc beschriebenes `JobRecord`, `monthlySalaryRange(job)`, `toJobPosting(job)` sowie den render- und sitemapnahen Adapter `publicationArtifacts(job)` für folgende Tasks.

- [ ] **Step 1: Failing Tests für Pflichtfelder, Status und Monatsformel schreiben**

Tests decken fehlenden Tarifstatus, fehlendes Prüf-/Ablaufdatum bei `ACTIVE`, ungültige Gehaltsspannen und die Formel `hourly × weeklyHours × 52 / 12` ab. `publicationArtifacts(job)` wird mit vollständigen synthetischen Datensätzen für `DRAFT`, `ACTIVE`, `PAUSED`, `FILLED` und `EXPIRED` geprüft. Je Status werden die tatsächlich von Astro-Seite und Sitemap konsumierten Rückgaben `robots`, `includeInSitemap`, `jobPosting` und `showApplication` verifiziert.

- [ ] **Step 2: Tests ausführen und erwartetes Scheitern prüfen**

Run: `node --test tests/job-model.test.mjs tests/job-publication-artifacts.test.mjs`
Expected: FAIL, weil Modell und Helfer fehlen.

- [ ] **Step 3: Content-Schema und reine Helfer implementieren**

`monthlySalaryRange(job)` gibt `{ min, max }` zurück; `toJobPosting(job)` gibt das JSON-LD-Objekt zurück. Beide Funktionen leben in `job-model.mjs`, erhalten ein per JSDoc typisiertes `JobRecord` und dürfen weder Netzwerk noch Dateisystem verwenden. `publicationArtifacts(job)` liefert exakt `{ robots, includeInSitemap, jobPosting, showApplication }`: Bei `ACTIVE` enthält `jobPosting` das fertige Objekt, bei allen anderen Statuswerten `null`. Dieser Adapter ist die einzige Statusentscheidung und die einzige Quelle des Stellenmarkups für Seite und Sitemap.

- [ ] **Step 4: Synthetische Tests ausführen**

Run: `node --test tests/job-model.test.mjs tests/job-publication-artifacts.test.mjs`
Expected: PASS.

### Task 3: Jobdetail, FAQ und JSON-LD aus einer Quelle rendern

**Files:**
- Modify: `src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/schulen.astro`
- Modify: `src/pages/gehaltsrechner.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/Benefits.astro`
- Modify: `src/components/Anforderungen.astro`
- Modify: `src/components/WorkplaceFilm.astro`
- Modify: `src/components/TeamProof.astro`
- Modify: `src/components/QuickApply.astro`
- Modify: `src/components/FaqSection.astro`
- Modify: `src/components/FaqSchema.astro`
- Modify: `src/pages/berufshandbuch/index.astro`
- Modify: practice-specific claims in every matching file under `src/content/ratgeber/`; current inventory includes `4-tage-woche-logopaedie.md`, `arbeiten-duisburg.md`, `ausbildung-nrw-2026.md`, `bewerbung-logopaedie-tipps.md`, `bilinguale-sprachtherapie.md`, `freie-praxis-oder-klinik-logopaedie.md`, `gehalt-logopaedie-nrw.md`, `logopaedie-bewerbung-ohne-anschreiben.md`, `logopaedin-duisburg-gesucht.md`, `stottertherapie-spezialisierung.md`, `teilzeit-modelle.md`, and `willkommen.md`
- Create: `tests/job-page-source.test.mjs`
- Create: `tests/job-status-integration.test.mjs`

**Interfaces:**
- Consumes: `JobRecord`, `monthlySalaryRange(job)`, `toJobPosting(job)` aus Task 2.
- Produces: sichtbare Stelle und strukturiertes Markup mit identischen Kernwerten.

- [ ] **Step 1: Failing Paritätstests schreiben**

Tests prüfen Gehalt, Wochenstunden, Dokumentationszeit, Behandlungslast, Überstunden, Hausbesuche, Einarbeitung, Fortbildung, Prüfdatum, Ablauf und Canonical gegen die Quelle. Sie weisen außerdem nach, dass aktuelle arbeitgeberspezifische Konditionen außerhalb der Jobquelle nicht erneut als unabhängig gepflegte Zahlenkopie vorkommen; redaktionelle allgemeine Gehaltsdaten bleiben davon getrennt. Das Consumer-Inventar wird durch repository-weite Suchmuster erzeugt und als explizite Positivliste im Test festgehalten, sodass neue Kopien den Test brechen.

- [ ] **Step 2: Tests ausführen und erwartetes Scheitern prüfen**

Run: `node --test tests/job-page-source.test.mjs`
Expected: FAIL, weil Werte noch hart codiert sind.

- [ ] **Step 3: Sichtbaren Inhalt und JobPosting auf die Content-Quelle umstellen**

Nur `ACTIVE` erzeugt `index, follow`, Sitemap-Eintrag, aktives Markup und Bewerbungs-CTA. Alle anderen Statuswerte erzeugen `noindex, follow`, keinen Sitemap-Eintrag, kein Stellenmarkup und keinen Bewerbungs-CTA. `astro.config.mjs` liest den Status aus derselben JSON-Datei, die die Content Collection validiert, und konsumiert `includeInSitemap` aus `publicationArtifacts(job)`. Die Jobseite reicht `robots` an das Layout weiter, serialisiert ausschließlich das zurückgegebene `jobPosting` und rendert den CTA ausschließlich bei `showApplication`. Es gibt in diesen Consumern keine zweite Statusabfrage. Abgeleitete Monatswerte erhalten einen Rundungshinweis. Wiederverwendbare Komponenten lesen die Jobquelle; Ratgeber verlinken für aktuelle arbeitgeberspezifische Konditionen auf die Stelle, statt diese als zweite Quelle zu pflegen.

- [ ] **Step 4: Paritäts- und Buildprüfung ausführen**

Run: `node --test tests/job-page-source.test.mjs tests/job-status-integration.test.mjs tests/job-publication-artifacts.test.mjs && npm run build`
Expected: PASS. `job-status-integration.test.mjs` verwendet fünf synthetische Job-Fixtures und prüft je Status die vollständigen rendernahen Artefakte: Robots-Wert, Sitemap-Entscheidung, serialisierbares `JobPosting` oder `null` und CTA-Boolean. Zusätzlich weist der Test statisch nach, dass Seite und `astro.config.mjs` genau diese vier Rückgaben konsumieren und keine eigene Statusverzweigung enthalten. Der reale Build bestätigt den aktuellen `ACTIVE`-Stand mit genau einem JobPosting und einem Sitemap-Eintrag; die produktive JSON-Datei wird im Test nicht umgeschrieben.

### Task 4: Antwortversprechen operativ angleichen

**Files:**
- Modify: `src/components/ApplicationContact.astro`
- Modify: `src/pages/bewerbung/danke.astro`
- Modify: `src/lib/application-mail.mjs`
- Modify: `tests/application-mail.test.mjs`
- Modify: `tests/application-content.test.mjs`

**Interfaces:**
- Consumes: bestätigtes Antwortfenster aus Task 1.
- Produces: eine UI- und Mailregel für Geschäftszeiten, Nacht und Wochenende.

- [ ] **Step 1: Failing Tests für Grenzzeiten schreiben**

Mindestens Werktag tagsüber, nach 20 Uhr und Wochenende mit derselben veröffentlichten Regel prüfen.

- [ ] **Step 2: Tests ausführen und Widerspruch nachweisen**

Run: `node --test tests/application-mail.test.mjs tests/application-content.test.mjs`
Expected: FAIL gegen die heutige Logik beziehungsweise die heutige 12-Stunden-Kopie.

- [ ] **Step 3: Deadline-Helfer und sämtliche sichtbaren Aussagen angleichen**

Keine Garantie veröffentlichen, die der Helfer nicht für jede geprüfte Zeit erfüllt.

- [ ] **Step 4: Formular- und Mailtests ausführen**

Run: `npm test`
Expected: PASS.

### Task 5: Bewerbungswege aus einer kontrollierten Konfiguration ausgeben

**Files:**
- Modify: `src/lib/recruiting-whatsapp.mjs`
- Modify: `src/components/RecruitingWhatsAppLink.astro`
- Modify: `src/components/ContactAlternatives.astro`
- Modify: `src/components/ApplicationContact.astro`
- Modify: `src/components/QuickApply.astro`
- Modify: `src/components/StickyContactBar.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/FaqSection.astro`
- Modify: `src/components/FaqSchema.astro`
- Modify: `src/components/JobSchema.astro`
- Modify: `src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro`
- Modify: `src/pages/schulen.astro`
- Modify: `src/pages/berufshandbuch/[slug].astro`
- Modify: `src/content/ratgeber/bewerbung-logopaedie-tipps.md`
- Modify: `src/pages/datenschutz.astro`
- Create: `tests/application-routes.test.mjs`

**Interfaces:**
- Consumes: `application_routes` des JobRecord.
- Produces: konsistente aktive Wege ohne Tracking personenbezogener Werte.

- [ ] **Step 1: Failing Tests für Wegeliste und Datenschutzverweis schreiben**

Jeder aktive Weg muss sichtbar sein; deaktivierte Wege dürfen in keinem gebauten Recruiting-Einstieg, FAQ, Ratgeber-CTA oder Schema erscheinen. Der Test führt zusätzlich eine repository-weite Suche nach direkten Recruiting-Zielen außerhalb der kontrollierten Konfiguration aus.

- [ ] **Step 2: Tests ausführen und erwartetes Scheitern prüfen**

Run: `node --test tests/application-routes.test.mjs`
Expected: FAIL, weil Wege noch mehrfach hart codiert sind.

- [ ] **Step 3: Wegekonfiguration implementieren und Komponenten darauf umstellen**

Kein Rückruf-Formular in diesem Task; das bleibt ein separates Datenschutzpaket.

- [ ] **Step 4: Bewerbungs- und Buildtests ausführen**

Run: `npm test && npm run build`
Expected: PASS.

### Task 6: SEO-Rollen innerhalb von logopädiejobs.de schärfen

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro`
- Modify: `src/components/JobSchema.astro`
- Modify: imports of the renamed organization schema component
- Create: `tests/recruiting-seo-roles.test.mjs`

**Interfaces:**
- Consumes: einzige Stellen-URL aus Task 2.
- Produces: Startseite als Karriereübersicht, Detailseite als Stellenantwort und korrektes Organisationsschema.

- [ ] **Step 1: Failing Tests für Seitentitel, Canonical, Stellenmarkup und `sameAs` schreiben**

Die Startseite darf kein konkurrierendes JobPosting erzeugen; alle vorgesehenen `sameAs`-URLs bleiben erhalten.

- [ ] **Step 2: Tests ausführen und erwartetes Scheitern prüfen**

Run: `node --test tests/recruiting-seo-roles.test.mjs`
Expected: FAIL gegen heutige Rollen beziehungsweise doppelten `sameAs`-Schlüssel.

- [ ] **Step 3: Seitenrollen und Organisationsschema minimal korrigieren**

Keine Redirect-, Domain- oder Sitemap-Änderung ohne separaten Nachweis.

- [ ] **Step 4: SEO-Tests und Build ausführen**

Run: `node --test tests/recruiting-seo-roles.test.mjs && npm run build`
Expected: PASS.

### Task 7: Praxiswebsite als DE/TR-Arbeitgeberbrücke umstellen

**Files:**
- Modify in `/Users/sinan/Development/logopaedie-simsek-3`: `src/pages/karriere.astro`
- Modify in `/Users/sinan/Development/logopaedie-simsek-3`: `src/pages/kariyer.astro`
- Modify in `/Users/sinan/Development/logopaedie-simsek-3`: `public/llms.txt`
- Modify or create corresponding tests in that repository

**Interfaces:**
- Consumes: aktive kanonische Stellen-URL aus Task 2.
- Produces: indexierbare DE/TR-Arbeitgeberseiten ohne eigenes `JobPosting` und mit tiefer Stellenverlinkung.

- [ ] **Step 1: Schwester-Repository-Anweisungen und vorhandene Änderungen erneut prüfen**

Run: `git -C /Users/sinan/Development/logopaedie-simsek-3 status --short`
Expected: vorhandene Nutzeränderungen sind identifiziert und bleiben erhalten.

- [ ] **Step 2: Failing Tests für genau null JobPosting-Ausgaben auf der Praxiswebsite schreiben**

Tests prüfen DE/TR-Parität, selbstkanonische Arbeitgeberseiten und dieselbe tiefe Stellen-URL. `public/llms.txt` darf die Praxis-Karriereseiten nicht mehr als offizielle Stellenanzeigen bezeichnen und keine aktuelle Vergütung, Arbeitszeit, Benefits oder Bewerbungsprozess-Kopie pflegen; es beschreibt die Arbeitgeberbrücke und verweist auf die aktive kanonische Stellen-URL.

- [ ] **Step 3: Tests ausführen und erwartetes Scheitern prüfen**

Run from sibling repository: `npm test`
Expected: FAIL, weil beide Seiten heute eigenes JobPosting ausgeben.

- [ ] **Step 4: JobPosting entfernen und Arbeitgeberbrücken konsistent umstellen**

Keine Therapie-, Team- oder Patientenseiten ändern.

- [ ] **Step 5: Schwester-Repository vollständig prüfen**

Run: `./scripts/verify.sh`
Expected: PASS.

### Task 8: Gesamtprüfung und Veröffentlichungsfreigabepunkt

**Files:**
- Review: all files from Tasks 1–7
- Modify: `reports/2026-11-24-platform-discovery-v01/RECRUITING-MVP-BACKLOG.md`

**Interfaces:**
- Consumes: beide geprüften Repositories.
- Produces: veröffentlichungsfähigen, aber noch nicht veröffentlichten Stand.

- [ ] **Step 1: Beide Diffs auf Inhalt, Datenschutz, SEO und Nutzeränderungen prüfen**

Run: `git diff --check` in beiden Repositories.
Expected: PASS.

- [ ] **Step 2: Beide vollständigen Prüfungen ausführen**

Run: `./scripts/verify.sh` in beiden Repositories.
Expected: PASS.

- [ ] **Step 3: Unabhängigen Review für Stellenparität und Cross-Domain-SEO durchführen**

Review muss sichtbare Werte, JSON-LD, Status/Ablauf, DE/TR-Brücke und Antwortfenster abdecken.

- [ ] **Step 4: Veröffentlichung separat freigeben lassen**

Kein Deploy, Commit oder Push ist durch diesen Plan automatisch freigegeben.
