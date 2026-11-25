# Ist-Soll-Abgleich der Recruiting-Inhalte

Stand: 25.11.2026
Status: Discovery abgeschlossen; zentrale Stellenintegration lokal umgesetzt, nicht veröffentlicht

## Umfang

Geprüft wurden die lokalen Inhalte von `logopädiejobs.de` und `logopaedie-simsek.de` gegen den Stellenstandard v1. Bewerbungsinhalte, Env-Dateien und produktive Daten wurden nicht gelesen. Zeilenstände beziehen sich auf den Prüfzeitpunkt.

## Zusammenfassung

Die meisten arbeitsrelevanten Aussagen waren bereits vorhanden. Die lokale Umsetzung zentralisiert inzwischen Stellenstatus, Stundenlohn, gerundetes Monatsentgelt, Wochenstunden, Behandlungslast, Dokumentationszeit, Überstundenregel, freiwillige Hausbesuche, Einarbeitung, Fortbildungsunterstützung und Veröffentlichungsfristen auf `logopädiejobs.de`. Offen bleiben vor allem die DE/TR-Arbeitgeberbrücken der Praxiswebsite und die vollständige Zentralisierung aller Bewerbungswege.

| Status | Priorität | Prüfpunkt | Fundstelle | Auswirkung | Nächster Schritt |
| --- | --- | --- | --- | --- | --- |
| `CONFLICTING` | `P1` | Stellenquelle und Cross-Domain-Rolle | Jobdetail auf `logopädiejobs.de`; `src/pages/karriere.astro` und `src/pages/kariyer.astro` der Praxiswebsite | Drei separat gepflegte `JobPosting`-Ausgaben können auseinanderlaufen und Suchmaschinen eine unklare Primärquelle geben. | `logopädiejobs.de` als einzige Stellen- und `JobPosting`-Quelle festlegen; Praxis-Karriereseiten als Arbeitgeberbrücken ohne eigenes Stellenmarkup planen. |
| `SUPPORTED` | `P1` | Zentrale Datenhaltung | Lokaler JobRecord, Publication-Adapter, Jobdetail, Startseite und Schulseite | Sichtbare aktive Stellenwerte und Statusartefakte werden aus einer validierten Quelle abgeleitet. | Nach Commit- und Veröffentlichungsfreigabe ausrollen; Ratgeber bleiben bewusst redaktionelle Recheninhalte. |
| `SUPPORTED` | `P1` | Monatsvergütung | Lokaler JobRecord und abgeleitete Präsentation | 23–26 Euro pro Stunde bleiben Primärwert; sichtbar wird kandidatenfreundlich `ca. 3.840–4.340 €` bei 38,5 Wochenstunden ausgegeben. | Beibehalten und nicht als exakten Monatslohn ausgeben. |
| `SUPPORTED` | `P1` | Behandlungslast | Bestätigung Sinan, 25.11.2026 | Bei 38,5 Wochenstunden liegt der reale Vollzeitkorridor bei 42–45 Therapien pro Woche. Die theoretische 45-Minuten-Vollbelegung von rund 51 Therapien ist ausdrücklich kein Soll; die Differenz bleibt für Vor- und Nachbereitung sowie weitere Arbeitsaufgaben. | Als Wochenkorridor veröffentlichen, nicht als tägliche Mindestquote oder starre Auslastung. |
| `SUPPORTED` | `P1` | Antwortversprechen | Lokale UI, Dankeseite und `application-mail.mjs` | Öffentlich und intern gilt ein Arbeitstag; Wochenenden und Berliner Datumsgrenzen werden einheitlich behandelt. | Operativ einhalten und nach Veröffentlichung beobachten. |
| `SUPPORTED` | `P1` | Aktualität der Stelle | JobRecord, Publication-Adapter und Bewerbungsendpunkt | `datePosted`, `last_reviewed_at` und `validThrough` sind zentral. Der serverseitige Bewerbungsendpunkt schließt nach `validThrough` automatisch. Statisch gebaute Seiten, CTA, Sitemap und Markup wechseln erst nach Statusänderung und neuem Build/Deploy. | Spätestens am 18.01.2027 fachlich prüfen, den Record bewusst verlängern oder schließen und anschließend neu bauen/veröffentlichen. |
| `SUPPORTED` | `P2` | Tarifstatus | Bestätigung Sinan, 25.11.2026 | Für die Stelle gilt kein Tarifvertrag (`NO_TARIFF`). | In der zentralen Stellenquelle pflegen und bei der späteren Veröffentlichung eindeutig formulieren; daraus keine Tariforientierung ableiten. |
| `SUPPORTED` | `P3` | Wochenarbeitszeit | beide Domains | 38,5 Stunden Vollzeit, variable Teilzeit und Vier-Tage-Woche sind klar. | Beibehalten und aus der zentralen Quelle rendern. |
| `SUPPORTED` | `P2` | Dokumentationszeit | beide Domains | Dokumentation, Vor-/Nachbereitung, Berichte und Organisation sind als Arbeitszeit beschrieben. | Beibehalten; öffentlich ausdrücklich „bezahlte Arbeitszeit“ schreiben. |
| `SUPPORTED` | `P2` | Überstunden | Bestätigung Sinan, 25.11.2026 | Überstunden sind nicht vorgesehen. Falls sie ausnahmsweise entstehen, werden Ausgleichsweg und Zeitpunkt flexibel individuell vereinbart; möglich sind Freizeitausgleich und Auszahlung. | Keine starre Frist, automatische Auszahlung oder einseitige Wahlhoheit behaupten. |
| `SUPPORTED` | `P2` | Hausbesuche | beide Domains | Nicht verpflichtend, nur auf Wunsch. | In der zentralen Quelle festhalten und in sichtbarer Seite sowie Schema konsistent ausgeben. |
| `SUPPORTED` | `P2` | Einarbeitung | Bestätigung Sinan und Abgleich beider Websites, 25.11.2026 | Intensive strukturierte Einarbeitung, fachliche Begleitung, jederzeit eine Ansprechperson und schrittweiser Terminaufbau. | Keine feste Dauer oder Wochenzahl behaupten; der Terminplan wächst stufenweise. |
| `SUPPORTED` | `P2` | Fortbildung | Bestätigung Sinan und Abgleich beider Websites, 25.11.2026 | Kurs- und Teilnahmegebühren der ausgewählten Fortbildung werden übernommen; zusätzliche freie Tage und freie Auswahl bleiben bestehen. | Keine feste Zahl freier Tage sowie keine Übernahme von Reise- oder Übernachtungskosten behaupten. Ältere schwächere oder widersprüchliche Ratgeberkopien bei der Zentralisierung ersetzen. |
| `SUPPORTED` | `P2` | Bewerbungswege | Formular, WhatsApp, Telefon, E-Mail; teilweise Post | Mehrere einfache Wege, kein Pflichtanschreiben, Lebenslauf freiwillig. | Wegeliste zentralisieren; Rückruf als neue Hypothese nur nach Prozess- und Datenschutzklärung ergänzen. |
| `PARTIALLY_SUPPORTED` | `P2` | SEO-Rolle innerhalb des Jobportals | Startseite und Jobdetail | Beide sind selbstkanonisch/indexierbar und adressieren ähnliche lokale Jobintentionen. | Startseite als Karriereportal, Jobdetail als einzige konkrete Stellen-URL schärfen. |
| `PARTIALLY_SUPPORTED` | `P2` | Organisationsschema | `src/components/JobSchema.astro` | Doppeltes `sameAs` überschreibt einen Wert; Komponentenbezeichnung suggeriert fälschlich ein JobPosting. | Schlüssel zusammenführen und Komponente fachlich passend benennen. |

## Festgelegte Domainrollen für den MVP-Plan

- `logopädiejobs.de` besitzt die vollständige, aktuelle Stellenbeschreibung, die Bewerbungswege und das einzige `JobPosting`-Markup.
- `logopaedie-simsek.de/karriere/` und `/kariyer/` erklären Arbeitgeber, Team und Arbeitsumfeld und verlinken tief auf die aktive Stelle.
- Praxis-Karriereseiten dürfen indexierbar und selbstkanonisch bleiben, sind aber keine zweite strukturierte Stellenanzeige.
- Deutsch und Türkisch bleiben auf der Praxiswebsite inhaltlich gleichwertige Arbeitgeberbrücken.
- Änderungen an Canonicals, Sitemap und Markup sind lokal geprüft, aber weder committed noch veröffentlicht; die Praxiswebsite bleibt ein getrenntes Implementierungspaket.

## Noch durch die Praxis zu bestätigende Betriebsangaben

Bestätigt:

- Tarifstatus: kein Tarifvertrag (`NO_TARIFF`), bestätigt durch Sinan am 25.11.2026.
- Antwortfenster: persönliche Rückmeldung innerhalb eines Arbeitstags; intern nächster Montag-bis-Freitag-Arbeitstag um 18:00 Uhr, ohne Feiertagsautomatik.
- Behandlungslast: bei 38,5 Wochenstunden 42–45 Therapien pro Woche mit ausdrücklich verbleibender Arbeitszeit für Vor- und Nachbereitung sowie weitere Aufgaben, bestätigt durch Sinan am 25.11.2026.
- Überstunden: nicht vorgesehen; falls sie ausnahmsweise entstehen, werden Freizeitausgleich oder Auszahlung und der Zeitpunkt flexibel individuell vereinbart.
- Fortbildung: Kurs- und Teilnahmegebühren werden übernommen; zusätzliche freie Tage und freie Auswahl. Reise-/Übernachtungskosten und eine feste Tageszahl sind nicht zugesagt.
- Einarbeitung: intensiv und strukturiert, fachlich begleitet, jederzeit eine Ansprechperson und schrittweiser Terminaufbau; keine pauschale Dauer.

Noch offen: keine der sechs für `MVP-01` abgefragten Betriebsangaben.

Der Stellenrecord ist nach der geprüften lokalen Integration `ACTIVE`. Das bedeutet ausschließlich, dass der lokale Datensatz veröffentlichungsfähig ist; Commit, Push, Deploy und Live-Veröffentlichung bleiben jeweils separat freigabepflichtig.
