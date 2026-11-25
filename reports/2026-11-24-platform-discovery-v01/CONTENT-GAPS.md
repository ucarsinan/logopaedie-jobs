# Inhalts- und Domain-Ownership-Lücken

Stand: 25.11.2026

## Methode und Evidenzgrenze

Das read-only Audit `scripts/audit-platform-content.mjs` hat 64 statische Seiten- und Inhaltsquellen aus den beiden lokalen Repositories klassifiziert. Gelesen wurden ausschließlich `src/pages`, `src/content`, `src/components`, `public/llms.txt`, `public/robots.txt` und Astro-Konfigurationen. Env-Dateien, Git-Metadaten, `dist`, `node_modules`, Bewerbungs-Endpunkte und sonstige Bewerbungs-Payloads waren ausgeschlossen; das Audit meldete keine Lesefehler.

Die Klassifikation ist ein reproduzierbarer Hinweisgeber, keine redaktionelle oder rechtliche Freigabe. Routen und eindeutige Karriere-/Therapiesignale haben Vorrang; gemischte oder rechtliche Seiten bleiben `INSUFFICIENT_EVIDENCE`. Das Inventar enthält keine Nutzer-, Patienten- oder Bewerberdaten.

## Findings

### C-01 — `JobPosting` wird in beiden Domains ausgegeben

- **Status:** `CONFLICTING`
- **Priorität:** `P1`
- **Problem:** Das Audit findet `JobPosting` einmal auf `logopädiejobs.de` und jeweils einmal in den deutschen und türkischen Karriereseiten der Praxiswebsite. Damit existieren drei Ausgaben für dieselbe Single-Employer-Stelle über zwei Domains.
- **Auswirkung:** Suchmaschinen können konkurrierende Stellenquellen, uneinheitliche Aktualisierungen oder eine unklare kanonische Stellenadresse sehen. Abweichende Ablauf-, Gehalts- oder Kontaktangaben würden das Risiko verstärken.
- **Nächster Schritt:** In einem separat freizugebenden SEO-/Produktplan eine einzige `JobPosting`-Quelle auf `logopädiejobs.de` festlegen; Praxis-Karriereseiten anschließend als redaktionelle Brücke ohne eigenes Stellenmarkup prüfen.
- **Begründung:** Reproduzierbare Treffer in `src/pages/jobs/logopaedin-sprachtherapeut-duisburg.astro`, `src/pages/karriere.astro` und `src/pages/kariyer.astro`.

### C-02 — Domainrollen sind grundsätzlich erkennbar, aber nicht durchgängig getrennt

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P1`
- **Problem:** Die Praxiswebsite besitzt überwiegend Patienten-, Therapie-, Team- und Kontaktintention; das Jobportal überwiegend Beruf, Bewerbung, Gehalt und Stellen. Gleichzeitig liegen Karriereausgaben weiterhin auf der Praxisdomain und die realen Ratgeber-Routen `/berufshandbuch/bilinguale-sprachtherapie/`, `/berufshandbuch/deutsch-tuerkische-logopaedie-duisburg/`, `/berufshandbuch/stottertherapie-spezialisierung/` sowie `/kontakt/` auf dem Jobportal werden als Patient:innenintention eingestuft.
- **Auswirkung:** Die Hauptantwort pro Suchintention ist nicht überall eindeutig. Das kann interne Verlinkung, Canonicals und spätere Inhaltsplanung widersprüchlich machen.
- **Nächster Schritt:** Die sechs `CONFLICTING`-Zeilen in `CONTENT-OWNERSHIP.csv` redaktionell einzeln prüfen und pro Thema genau eine Owner-Domain dokumentieren; keine automatische Verschiebung oder Weiterleitung aus diesem Audit ableiten.
- **Begründung:** Das Inventar weist die beiden Hauptrollen klar aus, findet aber Career- und Patient-Intention in beiden Repositories.

### C-03 — Heutiges Angebot ist fest an einen Arbeitgeber gekoppelt

- **Status:** `SUPPORTED`
- **Priorität:** `P2`
- **Problem:** `public/llms.txt`, Stelleninhalt, Arbeitgeberbezug und Jobmarkup beschreiben `logopädiejobs.de` ausdrücklich als Karriereportal der Praxis für Logopädie Şimşek und nicht als offene Mehr-Arbeitgeber-Börse.
- **Auswirkung:** Das entspricht der aktuellen Produktgrenze, ist aber keine belastbare technische oder redaktionelle Grundlage für neutrale Fremdanzeigen. Ein späterer Pilot benötigt eine klar getrennte Arbeitgeber- und Veröffentlichungsstruktur.
- **Nächster Schritt:** Single-Employer-Kopplung bis zu den definierten Discovery-Gates beibehalten; ein neutrales Pilotmodell erst nach Arbeitgeberinterviews, Rechts-/Datenschutzprüfung und separater Produktfreigabe planen.
- **Begründung:** Die Kopplung ist in den öffentlich bestimmten Inhaltsquellen konsistent und entspricht den aktuellen Projektvorgaben.

### C-04 — Harte Stellenkopien erzeugen Synchronisationsrisiko

- **Status:** `SUPPORTED`
- **Priorität:** `P1`
- **Problem:** Die konkrete Stelle wird nicht nur verlinkt, sondern in mehreren Seiten als eigenes `JobPosting` ausgegeben. Dadurch sind Stellenfelder und strukturierte Daten über Repositorygrenzen hinweg mehrfach pflegebedürftig.
- **Auswirkung:** Änderungen an Vergütung, Arbeitszeit, Laufzeit oder Kontaktweg können auseinanderlaufen; abgelaufene Stellen könnten auf einer Domain aktiv bleiben.
- **Nächster Schritt:** Später eine einzige validierte Stellenquelle und daraus abgeleitete Darstellung definieren. Bis dahin jede Stellenänderung manuell gegen alle drei Ausgaben prüfen.
- **Begründung:** Drei getrennte `JobPosting`-Vorkommen sind direkt aus den erlaubten Quellen belegt; eine gemeinsame fachliche Quelle ist im Audit nicht erkennbar.

### C-05 — Karrierebrücken sind uneinheitlich tief verlinkt

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P2`
- **Problem:** Die Praxis-Karriereseiten verlinken bereits auf die konkrete Portalstelle, enthalten daneben aber auch einen Link nur auf die Portal-Homepage. `public/llms.txt` der Praxis verweist ebenfalls ausschließlich auf die Portal-Homepage.
- **Auswirkung:** Nutzer:innen und Suchsysteme erhalten je nach Einstieg unterschiedlich präzise Zielpfade; ein reiner Homepage-Link verliert Stellenkontext.
- **Nächster Schritt:** In einem späteren Inhaltsplan Brücken nach Intention standardisieren: konkrete Stelle bei Bewerbungsabsicht, Portalbereich bei allgemeiner Karriereabsicht.
- **Begründung:** Das Audit unterscheidet Homepage-only-Links reproduzierbar von tiefen Stellenlinks.

### C-06 — Fachliche Eventtaxonomie fehlt

- **Status:** `NOT_FOUND`
- **Priorität:** `P1`
- **Problem:** In den erlaubten Quellbereichen wurden Consent- und Analytics-Grundkonfigurationen gefunden, aber keine benannten fachlichen Ereignisse für Stellenansicht, Kontaktweg-Auswahl oder qualifizierten Kontakt.
- **Auswirkung:** Reichweite lässt sich nicht verlässlich bis zum qualifizierten Kontakt messen; Gate B und spätere Kontakt-Gates können dadurch nicht sauber aus dem Produkt belegt werden.
- **Nächster Schritt:** Vor Tracking-Änderungen einen PII-freien Ereignisvertrag mit Eventnamen, erlaubten Parametern, Consent-Verhalten und Auswertungsowner separat spezifizieren und datenschutzfachlich prüfen.
- **Begründung:** Die Suche in den freigegebenen statischen Quellen fand nur allgemeine `dataLayer`-/`gtag`-Konfiguration, keine fachliche Taxonomie. `NOT_FOUND` bedeutet nicht, dass externe Analytics-Konfigurationen ausgeschlossen sind.

## Empfehlung

Für Phase 0 keine Produktseiten ändern. Zuerst `JobPosting`-Ownership und die sechs konfliktbehafteten Zeilen redaktionell entscheiden, danach in einem eigenen freizugebenden Plan Canonicals, Markup, Karrierebrücken und Eventvertrag gemeinsam behandeln.
