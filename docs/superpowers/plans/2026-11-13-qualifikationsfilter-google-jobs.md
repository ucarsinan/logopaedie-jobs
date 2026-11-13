# Qualifikationsfilter und Google-Jobs-Nachweis – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Kurzformular fragt den Berufsabschluss ab, damit unpassende Anfragen schon in der Mail erkennbar und zählbar sind; zusätzlich ein belegter Nachweis, ob die JobPosting-Seite tatsächlich in Google Jobs erscheint.

**Architecture:** Neues Formularfeld `abschluss` (Radio, drei feste Werte) im bestehenden Schritt 2 des Formulars. Der Server (`parseApplicationForm`) validiert es gegen eine feste Liste, übergibt es als `qualification` an `buildApplicationMail`, die es in Betreff und Text schreibt. Kein neuer Speicher, keine Ablehnung von Bewerbungen – nur Kennzeichnung. Der Google-Jobs-Nachweis ist eine manuelle Prüfanleitung mit Ergebnistabelle (Sinan führt sie in seinem Google-Konto aus).

**Tech Stack:** Astro 6, Vanilla-JS-Client im Component-`<script>`, Node `node:test`, nodemailer.

**Spec:** Analyse im Chat vom 13.11.2026 (Blacklyne-Abgleich), Kanalrecherche `../Logopädie/docs/research/RECRUITING_KANAELE_V1.md`, Ergebnis „0 passende Bewerbungen bis 12.11.“ in `../Logopädie/docs/ai/CURRENT_HANDOFF.md`. Die Analyse wird in Task 4 als `docs/research/RECRUITING_AGENTUR_BLACKLYNE_V1.md` im Repo `Logopädie` abgelegt und ist ab dann die Spec-Quelle.

> **Nachtrag 13.11.2026 (Entscheidung Sinan):** Das Feld ist nach Umsetzung auf **optional** umgestellt (Label „Dein Abschluss (optional)“, Hinweistext statt Fehlermeldung, keine Client-Pflicht). Zweite Option jetzt „Ich bin noch in Ausbildung, im Studium oder im Anerkennungsverfahren“, Betreff-Zusatz `in Ausbildung/Anerkennung`. Unbekannte Werte werden ignoriert statt abgelehnt. Die Tabelle unten ist der ursprüngliche Planstand.

## Global Constraints

- Markenname immer vollständig `Praxis für Logopädie Şimşek`.
- Anforderung laut veröffentlichter Stelle (unverändert lassen): „staatlich anerkannte und zugelassene Ausbildung oder ein Studium in Logopädie beziehungsweise Sprachtherapie sowie sehr gute Deutschkenntnisse. Berufserfahrung ist nicht erforderlich“.
- Keine Bewerbung wird wegen des Abschlusses abgewiesen; das Feld kennzeichnet nur.
- Keine echten Bewerberdaten in Tests, Logs oder Doku; Testdaten nur `example.test` / `0203 000000`.
- Keine neue Datenkategorie außer der Abschlussangabe; Datenschutzerklärung im selben Commit anpassen.
- Kein Deploy, kein Push, keine Vercel-/DNS-/Search-Console-Aktion durch den Agenten ohne gesonderte Freigabe.
- Commits nur nach Freigabe (AGENTS.md); vorher `./scripts/verify.sh`.
- Basis: `wip/pre-migration-2026-11-11` @ `8cb0a9a` (enthält das vereinfachte Formular, noch nicht auf `origin`). Neuer Branch `feat/qualifikationsfilter` von dort.

### Feste Werte (Spec)

| Wert `abschluss` | Label im Formular | Betreff-Zusatz in der Mail |
|---|---|---|
| `anerkannt` | Ich habe einen Abschluss in Logopädie oder Sprachtherapie | `Abschluss passt` |
| `ausbildung` | Ich bin noch in Ausbildung oder im Studium | `in Ausbildung` |
| `anderer` | Ich habe einen anderen Berufsabschluss | `anderer Abschluss` |
| *(fehlt)* | – | `Abschluss nicht angegeben` |

Legend des Fieldsets: `Dein Abschluss`. Fehlertext Client: `Bitte wähle deinen Abschluss aus.`
Mailzeile: `Abschluss: <Label>` bzw. `Abschluss: nicht angegeben`.

## Review Focus

1. **Veraltete/gecachte Seite ohne `abschluss`-Feld** sendet mit Anliegen `kennenlernen` → Server nimmt an, Mail sagt „nicht angegeben“ (keine verlorene Bewerbung). Test in Task 1.
2. **Anliegen `frage` mit manuell mitgesendetem `abschluss`** → Wert wird ignoriert, Mail ohne Abschlusszeile. Test in Task 1.
3. **Doppeltes `abschluss`-Feld** → `invalid_form` mit Feld `abschluss` (bestehende Duplikat-Logik). Test in Task 1.
4. **JavaScript aus** → beide Fieldsets sichtbar, kein natives `required` am Radio (sonst müsste auch „Frage“ einen Abschluss wählen); Server akzeptiert fehlenden Wert. Test in Task 2 (Markup-Assertion: kein `required` an `name="abschluss"`).
5. **Screenreader/Tastatur** → Fieldset mit `<legend>`, Fehlertext über `aria-live`, Fokus springt aufs erste Radio. Test in Task 2 (Markup-Assertion auf `fieldset`/`legend`/`aria-live`).

---

### Task 0: Abhängigkeiten herstellen (Freigabe nötig: Installation)

**Files:** keine Änderung (nur `node_modules/`, ignoriert)

- [ ] **Step 1:** Speicher prüfen: `df -h ~` – mindestens 25 GiB frei.
- [ ] **Step 2:** `npm ci` im Repo (aus `package-lock.json`, keine neuen Pakete).
- [ ] **Step 3:** `npm test` → Expected: `# fail 0` (heute 3 Fehler nur wegen fehlender `nodemailer`/`esbuild`). Bleiben Fehler, stoppen und melden.
- [ ] **Step 4:** `git checkout -b feat/qualifikationsfilter`

### Task 1: Server – Feld parsen und in die Mail schreiben

**Files:**
- Modify: `src/lib/application-form.mjs` (ALLOWED_FIELDS, neue Konstante, `ApplicationData`, `parseApplicationForm`)
- Modify: `src/lib/application-mail.mjs` (`buildApplicationMail`)
- Modify: `src/lib/application-endpoint.mjs` (`PUBLIC_INVALID_FIELDS` + `'abschluss'`)
- Test: `tests/application-form.test.mjs`, `tests/application-mail.test.mjs`, `tests/application-endpoint.test.mjs`

**Interfaces:**
- Produces: `export const QUALIFICATIONS = Object.freeze({ anerkannt: {label, subject}, ausbildung: {...}, anderer: {...} })` in `application-form.mjs` mit den Werten der Spec-Tabelle.
- Produces: `ApplicationData.qualification?: 'anerkannt' | 'ausbildung' | 'anderer'` – nur gesetzt, wenn gültig gesendet und Anliegen ≠ `frage`.
- Produces: Betreff `Neue Bewerbung: ${job} – ${subject}`; bei Anliegen `frage` (also `message` aus Frage, kein `qualification`) bleibt der Betreff `Neue Bewerbung: ${job}` ohne Zusatz. Unterscheidung über neues Feld `ApplicationData.intent?: string` (normalisierter Wert von `anliegen`, nur wenn in `CONTACT_INTENTS`).

- [ ] **Step 1: Failing tests in `tests/application-form.test.mjs`**

```js
test('passes a known qualification for application intents', () => {
  const r = parseApplicationForm(form({ anliegen: 'stelle', abschluss: 'anerkannt' }));
  assert.equal(r.ok, true);
  assert.equal(r.data.qualification, 'anerkannt');
  assert.equal(r.data.intent, 'stelle');
});
test('accepts a missing qualification from cached pages', () => {
  const r = parseApplicationForm(form({ anliegen: 'kennenlernen' }));
  assert.equal(r.ok, true);
  assert.equal('qualification' in r.data, false);
});
test('ignores a qualification sent with the question intent', () => {
  const r = parseApplicationForm(form({ anliegen: 'frage', abschluss: 'anderer' }));
  assert.equal(r.ok, true);
  assert.equal('qualification' in r.data, false);
});
test('rejects unknown and duplicate qualification values', () => {
  assert.deepEqual(invalidFields({ anliegen: 'stelle', abschluss: 'arzt' }), ['abschluss']);
  const body = form({ anliegen: 'stelle', abschluss: 'anerkannt' });
  body.append('abschluss', 'anderer');
  assert.deepEqual(parseApplicationForm(body).fields, ['abschluss']);
});
test('exports the three fixed qualification values', () => {
  assert.deepEqual(Object.keys(QUALIFICATIONS), ['anerkannt', 'ausbildung', 'anderer']);
});
```

Bestehenden Test `parses a valid email contact…` so belassen (ohne `anliegen` → kein `intent`, kein `qualification`).

- [ ] **Step 2: Failing tests in `tests/application-mail.test.mjs`**

```js
test('mail subject and text carry the qualification', () => {
  const mail = buildApplicationMail({ ...DATA, intent: 'stelle', qualification: 'ausbildung' }, CONFIG);
  assert.match(mail.subject, /– in Ausbildung$/);
  assert.match(mail.text, /^Abschluss: Ich bin noch in Ausbildung oder im Studium$/m);
});
test('application intents without qualification are marked as not given', () => {
  const mail = buildApplicationMail({ ...DATA, intent: 'kennenlernen' }, CONFIG);
  assert.match(mail.subject, /– Abschluss nicht angegeben$/);
  assert.match(mail.text, /^Abschluss: nicht angegeben$/m);
});
test('question intent keeps the plain subject without qualification line', () => {
  const mail = buildApplicationMail({ ...DATA, intent: 'frage' }, CONFIG);
  assert.doesNotMatch(mail.subject, /–/);
  assert.doesNotMatch(mail.text, /^Abschluss:/m);
});
```

Legacy-Fall ohne `intent` (bestehender Test `sends one text-only mail…`): Betreff unverändert erwarten.

- [ ] **Step 3:** Endpoint-Test: ungültiges `abschluss` mit `Accept: application/json` → 422 und `fields` enthält `'abschluss'`.
- [ ] **Step 4:** `npm test` → die neuen Tests FAIL, alle alten PASS.
- [ ] **Step 5: Implementieren.** `'abschluss'` in `ALLOWED_FIELDS`; in `parseApplicationForm`: `intent` nur setzen, wenn in `CONTACT_INTENTS`; `abschluss` normalisieren, bei nicht-leerem unbekanntem Wert `fields.push('abschluss')`, bei gültigem Wert und `intent !== 'frage'` `data.qualification` setzen. In `buildApplicationMail`: Zusatz und Zeile nur, wenn `data.intent` gesetzt und ≠ `frage`; Zeile `Abschluss: …` direkt nach `Kontakt:`.
- [ ] **Step 6:** `npm test` → `# fail 0`.
- [ ] **Step 7: Commit (nach Freigabe)**

```bash
git add src/lib/application-form.mjs src/lib/application-mail.mjs src/lib/application-endpoint.mjs tests/application-form.test.mjs tests/application-mail.test.mjs tests/application-endpoint.test.mjs
git commit -m "feat(application): accept qualification field and tag it in the mail"
```

### Task 2: Client – Fieldset im Schritt 2, Validierung, Datenschutztext

**Files:**
- Modify: `src/components/ApplicationContact.astro` (Fieldset vor „Name“ in `#kontakt-daten`; Script)
- Modify: `src/pages/datenschutz.astro:54-56`
- Test: `tests/application-content.test.mjs`

**Interfaces:**
- Consumes: `QUALIFICATIONS` aus Task 1 (Labels im Markup über `Object.entries(QUALIFICATIONS)` wie bei `CONTACT_INTENTS`).

- [ ] **Step 1: Failing tests in `tests/application-content.test.mjs`** (Quelltext-Assertions wie bestehende Tests)

```js
test('step two asks for the qualification in an accessible fieldset', async () => {
  const src = await readFile('src/components/ApplicationContact.astro', 'utf8');
  assert.match(src, /<fieldset id="kontakt-abschluss"[\s\S]*?<legend[^>]*>Dein Abschluss<\/legend>/);
  assert.match(src, /Object\.entries\(QUALIFICATIONS\)/);
  assert.doesNotMatch(src, /name="abschluss"[^>]*required/);
  assert.match(src, /Bitte wähle deinen Abschluss aus\./);
});
test('privacy policy names the qualification answer', async () => {
  const src = await readFile('src/pages/datenschutz.astro', 'utf8');
  assert.match(src, /Angabe zu Ihrem Berufsabschluss/);
});
```

- [ ] **Step 2:** `npm test` → beide FAIL.
- [ ] **Step 3: Markup.** Fieldset `#kontakt-abschluss` mit Legend `Dein Abschluss`, drei Radio-Labels im Stil der Anliegen-Labels, Fehler-`<p id="abschluss-error" aria-live="polite" hidden>`. Ohne natives `required`.
- [ ] **Step 4: Script.** In `showStep(2)`: Fieldset `hidden`/`disabled`, wenn gewähltes Anliegen `frage`. Beim Submit: ist das Fieldset aktiv und kein Radio gewählt → Fehlertext zeigen, `showStatus('Bitte korrigiere die markierten Angaben.')`, Fokus aufs erste Radio, abbrechen. `'abschluss'` in `knownFields`.
- [ ] **Step 5: Datenschutz.** Satz in Abschnitt 3 wird: „… verarbeiten wir Ihren Namen, Ihre Rückkontaktmöglichkeit, die Angabe zu Ihrem Berufsabschluss und Ihre freiwillige Nachricht …“.
- [ ] **Step 6:** `npm test` → `# fail 0`.
- [ ] **Step 7: Sichtprüfung.** `npm run dev`, Formular bei 390 px und Desktop im Browser: (a) Anliegen „Praxis kennenlernen“ → Abschluss sichtbar, Absenden ohne Wahl zeigt Fehler; (b) „Frage stellen“ → kein Abschlussfeld; (c) Tastatur: Tab/Pfeiltasten durch die Radios. Absenden nur bis zur Validierung, **keinen echten Versand** (SMTP lokal nicht konfiguriert → erwartet „Versand momentan nicht möglich“). Screenshots als Nachweis im Bericht.
- [ ] **Step 8:** `./scripts/verify.sh` → `== verify complete ==`.
- [ ] **Step 9: Commit (nach Freigabe)**

```bash
git add src/components/ApplicationContact.astro src/pages/datenschutz.astro tests/application-content.test.mjs
git commit -m "feat(application): ask for qualification in step two of the short form"
```

### Task 3: Google-Jobs-Nachweis als Prüfanleitung

**Files:**
- Create: `docs/operations/GOOGLE_JOBS_NACHWEIS.md`

Kein Code, kein Test. Inhalt (Sinan führt aus, Agent dokumentiert Ergebnis nur nach Rückmeldung):

- [ ] **Step 1:** Anleitung schreiben mit genau diesen Prüfungen und einer Ergebnistabelle (Datum, Ergebnis, Beleg-Screenshot-Pfad, offen):
  1. Rich-Results-Test: `https://search.google.com/test/rich-results` → URL `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/` → erwartet „Stellenausschreibung: 1 gültiges Element“, Warnungen notieren.
  2. Search Console: Property vorhanden? → URL-Prüfung derselben URL → „URL ist bei Google“ + Erweiterung „Stellenausschreibungen“ gültig. Falls keine Property: als offenen Punkt notieren (Domain-Verifizierung = DNS-Aktion, gesondert freigeben).
  3. Search Console → Sitemaps: `sitemap-index.xml` eingereicht, letzter Abruf.
  4. Echte Suche (privates Fenster, Standort Duisburg): „Logopäde Stellen Duisburg“, „Logopädin Job Duisburg Teilzeit“ → erscheint die Stelle im Google-Jobs-Kasten? Position und Titel notieren.
  5. Bundesagentur-Jobbörse als Gegenprobe (falls dort geschaltet): erscheint deren Anzeige statt unserer?
- [ ] **Step 2:** Wenn verfügbar: Rich-Results-Test selbst im eingebauten Browser öffnen (öffentlich, kein Login) und Ergebnis eintragen; Search-Console-Schritte bleiben bei Sinan.
- [ ] **Step 3: Commit (nach Freigabe)** `docs(operations): add Google Jobs verification checklist`

### Task 4: Doku und Zählung (Dokumentationspflicht)

**Files:**
- Modify: `PROJECT_REALITY.md` (logopaedie-jobs): neuer Abschnitt 13.11.2026 – Feld, Werte, Datenschutz, offene Abnahme/Deploy.
- Create: `../Logopädie/docs/research/RECRUITING_AGENTUR_BLACKLYNE_V1.md` (Frontmatter wie `RECRUITING_KANAELE_V1.md`: `status: draft`, `authority: derived`, neue SRC-/DEC-ID frisch aus den Registern ermitteln).
- Modify: `../Logopädie/reports/2026-11-12-recruiting-abgleich-v01/ZAEHLUNG.md`: Zählspalten je Betreff-Zusatz (`Abschluss passt` / `in Ausbildung` / `anderer Abschluss` / `nicht angegeben`), nur Anzahlen.
- Modify: `../Logopädie/PROJECT_REALITY.md`, `../Logopädie/docs/ai/CURRENT_HANDOFF.md`, Decision-Register unter `../Logopädie/docs/governance/` (Entscheidung Sinan 13.11.2026: Qualifikationsfilter, keine Ablehnung, Folgewirkung Zählung).

- [ ] **Step 1:** Dateien schreiben.
- [ ] **Step 2:** `python3 scripts/validate_project.py` im Repo `Logopädie` → PASS.
- [ ] **Step 3: Commits (nach Freigabe), je Repo getrennt**
  - logopaedie-jobs: `docs: record qualification filter in project reality` (kann in den Commit von Task 2)
  - Logopädie: `docs(recruiting): analyse agency approach and add qualification counts`

### Danach (nicht Teil dieses Plans, je gesondert freigeben)

- Push + PR für `feat/qualifikationsfilter` (Basis ist der ungepushte Commit `8cb0a9a` – mit pushen oder zuerst einzeln klären).
- Preview-Deploy, Testanfrage mit Testdaten an das echte Postfach, dann Production.
- Monatliches KI-Sichtbarkeitsprotokoll (10 feste Testfragen, ChatGPT/Perplexity) als eigener kleiner Plan.
