# LogopädieJobs Platform Discovery Phase 0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In höchstens sechs Monaten mit maximal 5.000 Euro externen Kosten belastbar entscheiden, ob LogopädieJobs als neutraler, kuratierter Stellenmarktplatz für Logopädie in Deutschland in einen bepreisten Concierge-Pilot gehen soll.

**Architecture:** Phase 0 ist ein evidenzbasierter Discovery-Prozess, kein Plattformbau. Sekundärrecherche, öffentliche Erfahrungsberichte, Arbeitgebervalidierung, Markt- und Inhaltsinventar, Rechts-/Betriebsbriefings und Gate-Scorecards werden als prüfbare Artefakte geführt; personenbezogene Interview- oder Bewerberdaten bleiben außerhalb des Repositorys. Kandidaten werden in Phase 0 nicht kontaktiert. Nur ein read-only Audit-Skript wird technisch ergänzt, um die beiden Websites reproduzierbar nach Domainrolle, Suchintention und Karriereverlinkung zu inventarisieren.

**Tech Stack:** Markdown, CSV, Node.js Test Runner, bestehende Astro-6-Repositories, Google Search Console sowie manuelle Web- und Quellenrecherche.

**Spec:** `docs/superpowers/specs/2026-11-24-logopaediejobs-plattform-design.md`

## Global Constraints

- Markt in Phase 0: Deutschland, Logopädie und fachlich gleichgestellte Sprachtherapie-Berufe.
- Nutzenversprechen: „Aktuelle und transparent vergleichbare Logopädie-Stellen mit Gehalt, konkreten Arbeitsbedingungen und einem einfachen direkten Erstkontakt.“ Die frühere 60-Sekunden-Zahl bleibt eine zu messende Produkthypothese.
- Maximal 5.000 Euro externe Kosten und vier bis sechs Stunden Betreiberzeit pro Woche; monatliche Stop-or-Continue-Entscheidung.
- Keine öffentliche Fremdanzeige, Kontaktaufnahme im Namen der Plattform, Zahlung, Datenbank, Konto- oder Bewerberpersistenz ohne das im jeweiligen Schritt genannte Gate und ausdrückliche Freigabe.
- Keine echten Namen, E-Mail-Adressen, Telefonnummern, Gesprächstranskripte, Bewerbungsinhalte oder Arbeitgeber-Geheimnisse in Git; nur anonymisierte Häufigkeiten und Findings.
- Praxisname immer exakt `Praxis für Logopädie Şimşek`.
- Patientenintention gehört primär zu `logopaedie-simsek.de`; Berufs-, Karriere- und Stellenintention zu `logopädiejobs.de`.
- Keine Commits oder Pushes ohne ausdrückliche Freigabe; Commit-Schritte dieses Plans sind deshalb durch einen eigenen Freigabepunkt ersetzt.
- Externe Rechts-, Datenschutz- und Steuerprüfung wird als Gate behandelt und nicht durch interne Recherche ersetzt.

## Review Focus

- Personenbezogene Interview- oder Bewerberdaten dürfen weder in Artefakten noch in Logs erscheinen; Task 1 und Task 4 prüfen dies ausdrücklich.
- Freundliche Zustimmung darf nicht als Zahlungsbereitschaft oder Pilotzusage gewertet werden; Task 5 trennt Aussage, schriftliche Pilotzusage und tatsächliche Zahlung.
- Widersprüchliche Stellen-, Schema- oder Domainrollen zwischen beiden Repositories müssen im Inventar sichtbar werden; Task 3 testet Doppelungen und Ownership-Lücken.
- Betreiberaufwand über sechs Stunden pro Woche muss zu Scope-Reduktion statt stiller Mehrarbeit führen; Task 1 und Task 7 verankern die Stop-Regel.
- Gate C darf nur bei zehn abgeschlossenen Arbeitgeberinterviews und drei verbindlichen Pilotzusagen auf `GO` stehen; Task 7 prüft die exakte Schwelle.

---

### Task 1: Discovery-Kontrollsystem und Datenschutzgrenze

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/README.md`
- Create: `reports/2026-11-24-platform-discovery-v01/HYPOTHESENREGISTER.md`
- Create: `reports/2026-11-24-platform-discovery-v01/GATE-SCORECARD.md`
- Create: `reports/2026-11-24-platform-discovery-v01/BUDGET-UND-ZEITLOG.csv`
- Create: `reports/2026-11-24-platform-discovery-v01/RISIKOREGISTER.md`
- Create: `tests/platform-discovery-governance.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: Gate-Schwellen, Budget- und Datenschutzgrenzen aus der freigegebenen Spec.
- Produces: einheitliche Statuswerte `SUPPORTED | PARTIALLY_SUPPORTED | INSUFFICIENT_EVIDENCE | CONFLICTING | NOT_FOUND` und Entscheidungen `GO | ADAPT | STOP`, die alle späteren Tasks verwenden.

- [ ] **Step 1: Write the failing governance tests**

In `tests/platform-discovery-governance.test.mjs` Tests mit diesen Namen und Assertions anlegen:

- `discovery artifacts contain every approved gate threshold`: verlangt Gate B `5`, Gate C `10` Interviews und `3` Pilotzusagen, Gate D `3` bezahlte Anzeigen, Gate E `30` Kontakte, Gate F `15` Arbeitgeber und `5` Wiederbuchungen.
- `budget log declares hard external cost and weekly time caps`: verlangt `5000` Euro sowie `4` bis `6` Stunden.
- `repository artifacts reject personal-data columns`: schlägt bei Spaltennamen `name`, `email`, `telefon`, `kontakt`, `nachricht`, `lebenslauf`, `transkript` fehl; zulässig sind nur aggregierte Anzahl, Segment, Status, Datum, Stunden und Kosten.

- [ ] **Step 2: Run the governance test and verify failure**

Run: `node --test tests/platform-discovery-governance.test.mjs`
Expected: FAIL, weil die Discovery-Artefakte noch fehlen.

- [ ] **Step 3: Create the discovery README and registers**

`README.md` definiert Zweck, Owner, Datenverbot, Statusvokabular, monatlichen Reviewrhythmus und Artefaktindex. `HYPOTHESENREGISTER.md` enthält je Hypothese ID, Zielgruppe, Behauptung, Belegstatus, Prüfmethode, Schwelle, Owner und Entscheidung. `GATE-SCORECARD.md` übernimmt alle exakten Schwellen. Das CSV verwendet ausschließlich:

`date,workstream,hours,external_cost_eur,approved_budget_reference,notes_without_personal_data`

- [ ] **Step 4: Add the discovery test to `npm test` coverage without replacing existing tests**

Die bestehende `node --test tests/*.test.mjs`-Konfiguration bleibt erhalten; keine neue Dependency ergänzen.

- [ ] **Step 5: Run the governance test and full local checks**

Run: `npm test && ./scripts/verify.sh`
Expected: alle Node-Tests und Verify-Schritte PASS.

### Task 2: Markt- und Wettbewerberkarte

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/MARKTKARTE.md`
- Create: `reports/2026-11-24-platform-discovery-v01/WETTBEWERBSMATRIX.csv`
- Create: `reports/2026-11-24-platform-discovery-v01/POSITIONIERUNGSLUECKEN.md`
- Create: `reports/2026-11-24-platform-discovery-v01/sources/market-sources.md`

**Interfaces:**
- Consumes: Hypothesen-IDs und Statusvokabular aus Task 1.
- Produces: belegte Wettbewerbsmerkmale, Preisspannen und mindestens drei Positionierungslücken für Task 5 und Task 7.

- [ ] **Step 1: Define the competitor sample before collecting results**

Mindestens zwölf Angebote aus vier Gruppen in `MARKTKARTE.md` festschreiben: Berufsverbände, kostenlose Spezialbörsen, bezahlte Therapiebörsen sowie Generalisten/öffentliche Anbieter. Mindestens dbl, VDLS, Therapeutenbörse, DocJob24, TheraFair, TherapeutenOnline, KarriereMedizin, CuraCareer, BA, Indeed und StepStone aufnehmen.

- [ ] **Step 2: Create the comparison schema**

CSV-Header exakt:

`provider,provider_group,target_professions,visible_job_count,geography,price_eur,term_days,employer_verification,salary_requirement,filters,application_routes,account_required,upload_required,job_alerts,employer_profile,google_job_schema,video_or_social_offer,expiry_handling,value_proposition,source_url,retrieved_on,evidence_status`

- [ ] **Step 3: Research every row from current, directly reachable sources**

Beobachtete Funktion, Anbieterbehauptung und eigene Schlussfolgerung getrennt formulieren. Jede Preis- oder Funktionsangabe benötigt URL und Abrufdatum; unbekannte Werte als `NOT_FOUND`, nicht als `nein`, erfassen.

- [ ] **Step 4: Derive positioning gaps**

Mindestens drei Lücken mit Belegstatus prüfen: transparente Vergleichbarkeit, verifizierte Arbeitgeber, Erstkontakt unter 60 Sekunden, echte Arbeitsplatzvideos und berufsspezifische Inhalte. Keine Lücke ohne Wettbewerbsbeleg als bestätigt markieren.

- [ ] **Step 5: Review the matrix with an independent research agent**

Der Reviewer prüft fünf zufällige Zeilen gegen die Quellen, alle Preisangaben und die Trennung von Fakt/Versprechen/Inference. Erwartet: keine unbelegte `SUPPORTED`-Aussage.

### Task 3: Reproduzierbares Inhalts- und Domain-Ownership-Inventar

**Files:**
- Create: `scripts/audit-platform-content.mjs`
- Create: `tests/platform-content-audit.test.mjs`
- Create: `reports/2026-11-24-platform-discovery-v01/CONTENT-OWNERSHIP.csv`
- Create: `reports/2026-11-24-platform-discovery-v01/CONTENT-GAPS.md`
- Read: `/Users/sinan/Development/logopaedie-simsek-3/src/`

**Interfaces:**
- Consumes: beide lokalen Repositorypfade als CLI-Argumente.
- Produces: `auditRepositories({ jobsRoot, practiceRoot }) -> AuditResult` mit `pages`, `jobPostingOccurrences`, `crossDomainLinks`, `duplicateIntentCandidates` und `errors` sowie eine anonymisierte CSV ohne Nutzer- oder Bewerberdaten.

- [ ] **Step 1: Write failing audit tests using synthetic fixtures**

Tests anlegen für:

- `finds duplicate JobPosting output across repositories`;
- `classifies patient and career ownership separately`;
- `reports a career bridge that targets only the portal homepage`;
- `does not read env files, git metadata, dist, node_modules or application payloads`;
- `emits stable CSV columns url,repository,audience,intent,owner_domain,canonical,cross_domain_cta,jobposting_count,status`.

- [ ] **Step 2: Run the audit tests and verify failure**

Run: `node --test tests/platform-content-audit.test.mjs`
Expected: FAIL because `audit-platform-content.mjs` is missing.

- [ ] **Step 3: Implement the read-only audit module**

Exports:

```js
export function auditRepositories({ jobsRoot, practiceRoot })
export function toOwnershipCsv(auditResult)
```

Nur `src/pages`, `src/content`, `src/components`, `public/llms.txt`, `public/robots.txt` und Astro-Konfigurationen lesen. Keine Netzwerkzugriffe, keine Dateien außerhalb der übergebenen Roots und keine Schreiboperation im Modul.

- [ ] **Step 4: Run tests and generate the real inventory**

Run: `node --test tests/platform-content-audit.test.mjs`
Expected: PASS.

Run: `node scripts/audit-platform-content.mjs /Users/sinan/Development/logopaedie-jobs /Users/sinan/Development/logopaedie-simsek-3`
Expected: CSV-Ausgabe auf stdout; mit expliziter Dateibearbeitung als `CONTENT-OWNERSHIP.csv` speichern, nicht per Shell-Redirection.

- [ ] **Step 5: Classify every conflict without changing product pages**

`CONTENT-GAPS.md` muss mindestens die mehrfachen `JobPosting`-Ausgaben, die heutige Single-Employer-Kopplung, Domainrollen, harte Stellenkopien und fehlende Eventtaxonomie bewerten. Produktänderungen gehören in einen späteren, separat freizugebenden Plan.

- [ ] **Step 6: Run full checks**

Run: `npm test && ./scripts/verify.sh`
Expected: PASS.

### Task 4: Kandidatenbedürfnisse durch Deep Research untersuchen

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-RESEARCH-FRAGEN.md`
- Create: `reports/2026-11-24-platform-discovery-v01/QUELLENREGISTER-KANDIDATEN.csv`
- Create: `reports/2026-11-24-platform-discovery-v01/ERFAHRUNGSBERICHTE-CODIERUNG.csv`
- Create: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-EVIDENZMATRIX.md`
- Create: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-JOBS-TO-BE-DONE.md`
- Create: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-BIAS-UND-GRENZEN.md`
- Create: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-ENTSCHEIDUNGSMEMO.md`
- Modify: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-SCREENING.md`
- Modify: `reports/2026-11-24-platform-discovery-v01/KANDIDATEN-FINDINGS.md`
- Modify: `reports/2026-11-24-platform-discovery-v01/JOBS-TO-BE-DONE.md`

**Interfaces:**
- Consumes: Nutzenversprechen und Kontaktwege aus der Spec sowie Wettbewerbsbefunde aus Task 2.
- Produces: belegte Kandidatenprobleme, vorläufige Jobs-to-be-done, Kontaktweghypothesen, Gegenbelege und eine sichtbare Übertragbarkeitsgrenze für Task 7.

- [ ] **Step 1: Fix the research questions and evidence hierarchy**

Vor der Suche die Fragen zu Stellensuche, Auswahl-/Ausschlusskriterien, Bewerbungshürden, Kontaktwegen, Karrierephasen und Vertrauenssignalen festschreiben. Evidenzränge reichen von eigenen aggregierten Verhaltensdaten und methodisch nachvollziehbaren Studien bis zu öffentlichen Erfahrungsberichten, Wettbewerberfunktionen und ausdrücklich gekennzeichneten eigenen Inferenzen.

- [ ] **Step 2: Build the source sample**

Mindestens acht methodisch nachvollziehbare Studien oder Primärquellen, davon mindestens drei öffentliche oder wissenschaftliche Quellen, sowie mindestens fünf voneinander unabhängige öffentliche Erfahrungsquellen prüfen. Deutsche Bewerbungs- und Gesundheitsfachkräftesituation priorisieren; allgemeine Studien nur mit begründeter Übertragbarkeit verwenden.

- [ ] **Step 3: Code public experience reports without personal data**

Eine strukturierte Stichprobe öffentlicher Erfahrungsberichte aus mindestens fünf unabhängigen Quellen nach `INFORMATION_NEED`, `TRUST_SIGNAL`, `DEALBREAKER`, `APPLICATION_FRICTION`, `CONTACT_PREFERENCE`, `PRIVACY_CONCERN`, `JOB_COMPARISON`, `CAREER_STAGE`, `EMPLOYER_RESPONSE` und `UNRESOLVED` codieren. Keine Klarnamen, Profilnamen, privaten Gruppen oder Kontaktaufnahme; kurze Zitate nur im urheberrechtlich zulässigen Umfang, bevorzugt paraphrasieren.

- [ ] **Step 4: Triangulate studies, public reports and owned aggregate data**

Jeder Befund erhält Quellentyp, Evidenzrang, Markt, Zeitraum, Segment, Häufigkeit innerhalb der ausgewerteten Stichprobe, Gegenbelege, Übertragbarkeit auf Logopädie und Vertrauensgrad. Review-Häufigkeiten sind keine repräsentativen Marktanteile. Eigene Search-Console- oder Kanaldaten nur aggregiert und ohne Bewerbungsinhalte verwenden.

- [ ] **Step 5: Derive provisional jobs and product implications**

Fakt, Produktinferenz und offene Hypothese in getrennten Feldern führen. Ein Kandidatenbedürfnis darf das Produktdesign nur verändern, wenn eigene aggregierte Verhaltensdaten es bestätigen, eine starke Studie plus unabhängige mittlere Evidenz vorliegt oder mindestens drei unabhängige Erfahrungsquellen dasselbe Problem ohne starken Gegenbeleg zeigen. Kandidatenkonto, Lebenslaufspeicherung und Talentpool bleiben trotz Sekundärrecherche gesperrt.

- [ ] **Step 6: Record the deliberate interview deferral and run quality checks**

Die vorbereiteten Interviewartefakte auf `DEFERRED_BY_OWNER` setzen und als nicht durchgeführte Methode kennzeichnen. Bias-Grenzen wie Selbstselektion, Plattform-, Berufsübertragungs-, Anbieter-, Such- und Interpretationsbias dokumentieren. Danach Quellen-, PII- und Konsistenzprüfung sowie `npm test && ./scripts/verify.sh` ausführen.

### Task 5: Arbeitgeberforschung, Neutralität und Preistest

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/INTERVIEWLEITFADEN-ARBEITGEBER.md`
- Create: `reports/2026-11-24-platform-discovery-v01/ARBEITGEBER-FINDINGS.md`
- Create: `reports/2026-11-24-platform-discovery-v01/PREISTEST.md`
- Create: `reports/2026-11-24-platform-discovery-v01/PILOTZUSAGEN-REGISTER.csv`

**Interfaces:**
- Consumes: Positionierungslücken aus Task 2 und Betreiberhypothesen aus Task 6.
- Produces: zehn abgeschlossene Interviews, getrennte Preis- und Pilotbelege und Gate-C-Zähler für Task 7.

- [ ] **Step 1: Lock the employer sample**

Zehn vollständige Interviews: fünf inhabergeführte Praxen unterschiedlicher Größe, zwei größere Therapiezentren/MVZ, zwei Kliniken/Reha-Einrichtungen und eine Schule/Einrichtung mit regelmäßigem Nachwuchsbedarf; mindestens fünf mit aktuell offener Logopädie-Stelle.

- [ ] **Step 2: Create three non-bookable offer cards**

- Basis: verifizierte Anzeige, 30 Tage;
- Plus: längere Laufzeit, Arbeitgeberprofil und Auswertung;
- Recruiting: redaktionelle Erstellung plus Video-/Social-Material.

Als Interviewmaterial klar mit „Konzepttest – nicht buchbar“ kennzeichnen. Zuerst Preisspannen, nach Synthese drei konkrete Pilotpreise testen.

- [ ] **Step 3: Write the interview guide**

Reale Kanäle, Kosten, Einstellungen, Kosten der Vakanz, Kontaktqualität, Gehaltstransparenz, Verifizierung, Reporting, Neutralitätsbedenken, Anzeigenaufwand und Zahlungsbereitschaft abfragen.

- [ ] **Step 4: Obtain outreach approval and conduct interviews**

Einladung und externe Kontaktaufnahme sind repräsentative Kommunikation und benötigen vor Versand ausdrückliche Freigabe. Rohdaten und Kontaktdaten außerhalb von Git halten.

- [ ] **Step 5: Record evidence levels separately**

CSV-Header exakt:

`segment,interview_completed,pilot_interest_verbal,pilot_commitment_written,payment_completed,price_band,primary_objection,status`

Nur `payment_completed=true` zählt für Gate D. Nur dokumentierte, außerhalb von Git aufbewahrte schriftliche Zusage zählt für Gate C.

- [ ] **Step 6: Independent synthesis review**

Ein frischer Reviewer prüft alle zehn anonymisierten Ergebniszeilen gegen die Findings, insbesondere Neutralitätsbedenken und die Trennung von Höflichkeitsaussage, Pilotzusage und Zahlung.

### Task 6: Rechts-, Datenschutz-, Vertrauens- und Betriebsbriefing

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/governance/OPERATOR-SCENARIOS.md`
- Create: `reports/2026-11-24-platform-discovery-v01/governance/RESPONSIBILITY-MATRIX.md`
- Create: `reports/2026-11-24-platform-discovery-v01/privacy/DATA-FLOW-MAPS.md`
- Create: `reports/2026-11-24-platform-discovery-v01/privacy/DATA-CLASSIFICATION-RETENTION.md`
- Create: `reports/2026-11-24-platform-discovery-v01/policy/JOB-AD-POLICY.md`
- Create: `reports/2026-11-24-platform-discovery-v01/policy/JOB-AD-REVIEW-CHECKLIST.md`
- Create: `reports/2026-11-24-platform-discovery-v01/trust/EMPLOYER-VERIFICATION-SOP.md`
- Create: `reports/2026-11-24-platform-discovery-v01/operations/MODERATION-AND-COMPLAINT-RUNBOOK.md`
- Create: `reports/2026-11-24-platform-discovery-v01/operations/CAPACITY-MODEL.md`
- Create: `reports/2026-11-24-platform-discovery-v01/commerce/LEGAL-REVIEW-BRIEF.md`

**Interfaces:**
- Consumes: Kontaktwege, Geschäftsmodell und Gates aus der Spec.
- Produces: prüffähige interne Hypothesen und ein externes Rechts-/Datenschutz-/Steuerbriefing; keine behauptete Rechtsfreigabe.

- [ ] **Step 1: Map three operator states**

Praxis als Herausgeberin, bezahlte Fremdanzeigen unter bestehendem Betreiber und mögliche eigenständige Betreibergesellschaft jeweils nach Inhalt, Vertrag, Datenschutz, Abrechnung, Beschwerde und Löschung vergleichen. Wechselprüfung vor Gate D festlegen.

- [ ] **Step 2: Map every application-route data flow**

WhatsApp-Direktlink, Telefon, E-Mail, externe Arbeitgeberseite, späterer 60-Sekunden-Kontakt und späteres Konto getrennt darstellen. Stufe 1 speichert keine Bewerbungsinhalte; Analytics erhält keine Nachricht, Kontaktangabe oder Dokumentreferenz.

- [ ] **Step 3: Draft the job-ad and verification policies with synthetic cases**

Zustände exakt: `unverified | pending | verified | restricted | suspended`. Synthetische Anzeigen für `zulässig | prüfpflichtig | abzulehnen` erstellen. Zwei unabhängige Reviewer müssen bei den Testfällen zum selben Status gelangen oder die Regel wird präzisiert.

- [ ] **Step 4: Tabletop moderation and incident cases**

Fake-Praxis, diskriminierende Anzeige, gestohlenes Teamfoto, falsche Gehaltsangabe und Datenleck als getrennte Abläufe testen. Datenschutzverletzung erhält einen eigenen Eskalationspfad.

- [ ] **Step 5: Build the capacity model**

Verifizierung, Redaktion, Veröffentlichung, Aktualitätsprüfung, Support, Beschwerde und Reporting einzeln in Minuten schätzen. Pilotumfang muss mit 30 Prozent Reserve in vier bis sechs Wochenstunden passen; sonst `ADAPT` durch Scope-Reduktion.

- [ ] **Step 6: Prepare external review briefs**

Rechtsprüfung vor Gate C: Anzeigenrichtlinie, Arbeitgeberverifizierung, Rechte, Beschwerde und Haftungsgrenzen. Vor Gate D zusätzlich Betreiberform, AGB, DDG/UWG, Kennzeichnung, Rechnung und Steuer. Vor Gate E Datenschutzrollen, Rechtsgrundlagen, Löschung, Betroffenenrechte, AVV/Transfers, DSFA-Entscheidung und Security-Abnahme.

- [ ] **Step 7: Request separate approval before commissioning paid advice**

Vor Beauftragung Anbieter, Leistungsumfang, Preis, Datenzugriff und Budgetwirkung nennen. Ohne Freigabe bleibt das Briefing intern und das zugehörige Gate geschlossen.

### Task 7: Gate-C-Synthese und Concierge-Pilotentscheidung

**Files:**
- Create: `reports/2026-11-24-platform-discovery-v01/CONCIERGE-PILOT-PROTOKOLL.md`
- Create: `reports/2026-11-24-platform-discovery-v01/ANZEIGEN-CHECKLISTE.md`
- Create: `reports/2026-11-24-platform-discovery-v01/PILOT-METRIKEN.md`
- Create: `reports/2026-11-24-platform-discovery-v01/STOP-REGELN.md`
- Create: `reports/2026-11-24-platform-discovery-v01/UNIT-ECONOMICS-V01.md`
- Create: `reports/2026-11-24-platform-discovery-v01/DISCOVERY-ENTSCHEIDUNG.md`
- Create: `tests/platform-gate-scorecard.test.mjs`

**Interfaces:**
- Consumes: anonymisierte Candidate-/Employer-Findings, Marktkarte, Rechts-/Betriebsgates, Budgetlog und Content-Inventar.
- Produces: reproduzierbare `GO | ADAPT | STOP`-Entscheidung sowie bei `GO` den Scope eines separaten Concierge-Pilotplans.

- [ ] **Step 1: Write the failing Gate-C tests**

Tests:

- `gate C blocks below ten completed employer interviews`;
- `gate C blocks below three written pilot commitments`;
- `gate C blocks when legal review or operator capacity is unresolved`;
- `gate C blocks when external costs exceed 5000 euros`;
- `gate C returns GO only when every required condition is met`.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/platform-gate-scorecard.test.mjs`
Expected: FAIL because the scorecard evaluator is not yet implemented.

- [ ] **Step 3: Implement the minimal scorecard evaluator inside the test-owned discovery module**

Create `scripts/evaluate-platform-gates.mjs` exporting:

```js
export function evaluateGateC({ employerInterviews, writtenPilotCommitments, legalReviewReady, weeklyCapacityReady, externalCostEur })
```

Return `{ decision, blockers }`, with `decision` limited to `GO | ADAPT | STOP`; no filesystem or network access in the function.

- [ ] **Step 4: Run Gate-C tests**

Run: `node --test tests/platform-gate-scorecard.test.mjs`
Expected: PASS.

- [ ] **Step 5: Calculate pilot unit economics**

Pro Anzeige Akquisitions-, Verifizierungs-, Redaktions-, Support- und Reportingzeit, variable Kosten, erzielbaren Preis und Deckungsbeitrag berechnen. Betreiberzeit und Rechts-/Toolkosten einbeziehen; Seitenaufrufe nicht als Erlösbeleg verwenden.

- [ ] **Step 6: Write the discovery decision**

Jede Hypothese erhält Status, Priorität, Problem, Auswirkung, nächsten Schritt und Begründung. `GO` darf nur einen separat freizugebenden Pilotplan auslösen, keine automatische Veröffentlichung.

- [ ] **Step 7: Run all repository checks**

Run: `npm test && ./scripts/verify.sh && git diff --check`
Expected: PASS.

### Task 8: Abschlussreview und Git-Freigabepunkt

**Files:**
- Review: all files under `reports/2026-11-24-platform-discovery-v01/`
- Review: `scripts/audit-platform-content.mjs`
- Review: `scripts/evaluate-platform-gates.mjs`
- Review: `tests/platform-*.test.mjs`

**Interfaces:**
- Consumes: Ergebnisse aller Tasks.
- Produces: prüfbarer Abschlussbericht und getrennte Empfehlung für `STOP`, `ADAPT`, Concierge-Pilot oder weiteren technischen Spike.

- [ ] **Step 1: Run independent evidence review**

Ein frischer Reviewer prüft Quellenstichprobe, Interviewquoten, Datenschutzscan, Gate-Rechnung, Budgetgrenze und Widersprüche zwischen Spec und Artefakten.

- [ ] **Step 2: Run independent architecture review**

Ein zweiter Reviewer prüft ausschließlich, ob irgendein Research-Ergebnis bereits eine technische Entscheidung vortäuscht, die erst nach Discovery fallen darf, und ob spätere Module für Inhalte, Arbeitgeber, Bewerbungen und Commerce getrennt bleiben können.

- [ ] **Step 3: Produce the final handoff**

Bericht mit Kurzfazit, einfacher Bedeutung, Findings im vorgeschriebenen Format, Fahrplan, Freigaben, ausgeführten/nicht ausgeführten Checks sowie Git-Status erstellen.

- [ ] **Step 4: Request explicit commit approval**

Vor Staging exakte Dateiliste und Commit-Vorschlag zeigen. Ohne ausdrückliche Freigabe nichts stagen, committen oder pushen.

## Self-Review Result

- Spec coverage: Phase-0-Research, Zielgruppen, Markt, Domainrollen, Kontaktwege, Betreiber-/Datenschutzgates, Betriebskapazität, Unit Economics und Gate C sind abgedeckt. Produktbau ab Concierge-Pilot bleibt bewusst einem Folgedesign/-plan vorbehalten.
- Step scan: Jeder Schritt erzeugt ein prüfbares Artefakt oder einen eindeutigen Testzustand; externe Kommunikation und bezahlte Prüfung besitzen eigene Freigabepunkte.
- Type consistency: `AuditResult`, Ownership-CSV, Evidenzstatus und `evaluateGateC()` werden einmal definiert und später unverändert konsumiert.
- Review Focus: personenbezogene Daten, falsche Zahlungsbelege, Domain-/Schema-Doppelungen, Betreiberzeit und Gate-C-Schwellen besitzen konkrete Tests oder Reviews.
- Proportion: Der Plan ist auf Discovery begrenzt und vermeidet die verfrühte Transkription einer Marktplatzimplementierung.
