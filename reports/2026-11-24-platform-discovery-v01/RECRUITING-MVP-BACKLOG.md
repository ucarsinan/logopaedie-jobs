# Recruiting-MVP-Backlog

Stand: 25.11.2026
Ziel: mehr qualifizierte Erstkontakte für die Praxis für Logopädie Şimşek durch konsistente Stelleninformationen und einfache Bewerbungswege

## Priorisierungsregel

- `P1`: verhindert Widersprüche, Vertrauensverlust, fehlerhafte Stellenstruktur oder nicht haltbare Versprechen;
- `P2`: verbessert Vergleichbarkeit, Bedienbarkeit oder Messbarkeit nach gesicherter P1-Basis;
- `P3`: Optimierung ohne unmittelbares Recruiting- oder Compliance-Risiko.

## P1 — zuerst umsetzen

| ID | Bereich | Aktion | Abnahmekriterium | Begründung | Freigabe |
| --- | --- | --- | --- | --- | --- |
| `MVP-01` | Betriebsangaben | Abgeschlossen: Tarifstatus, Behandlungslast, flexibler Überstundenausgleich, Fortbildungsrahmen, Einarbeitung und Antwortfenster sind bestätigt. | Jede Aussage hat einen eindeutigen freigegebenen Wert. | Verhindert erfundene oder operativ nicht haltbare Versprechen. | Erledigt; Veröffentlichung bleibt separat freigabepflichtig. |
| `MVP-02` | Datenmodell | Lokal abgeschlossen: Astro-Content-Schema und dateibasierter JobRecord für genau eine eigene Stelle. | Ungültige oder unvollständige Pflichtfelder brechen den Build; keine Datenbank. | Eine Quelle verhindert Drift zwischen sichtbarem Inhalt und Markup. | Erledigt; Commit und Veröffentlichung bleiben separat. |
| `MVP-03` | Vergütung | Lokal abgeschlossen: Stundenlohn ist Primärwert; Monatswert wird zentral berechnet und sichtbar auf `ca. 3.840–4.340 €` gerundet. | Seite, FAQ und `JobPosting` sind rechnerisch konsistent. | Behebt den sichtbaren Rundungswiderspruch. | Erledigt; Veröffentlichung bleibt separat. |
| `MVP-04` | Jobdetail | Lokal abgeschlossen: Stellenkopf und Arbeitsalltag werden aus der zentralen Quelle gerendert. | Gehalt, Stunden, Dokumentation, Behandlungslast, Überstunden, Hausbesuche, Einarbeitung, Fortbildung und Aktualität sind sichtbar. | Entspricht den stärksten Kandidatenbedürfnissen. | Text und UX lokal geprüft; Veröffentlichung bleibt separat. |
| `MVP-05` | Strukturierte Daten und Status | Lokal abgeschlossen: `JobPosting`, Robots, Sitemap, sichtbare CTA und serverseitige Bewerbungsannahme folgen derselben Status-/Ablaufregel. | Ein Build veröffentlicht nur eine aktive, nicht abgelaufene Stelle mit Indexierung, Sitemap, Markup und CTA. Der Endpunkt prüft `validThrough` zusätzlich bei jedem Request und schließt danach sofort mit `410 Gone`; statische Artefakte benötigen Statusänderung und neuen Build/Deploy. | Beseitigt getrennte Stellenkopien und schützt die Datenannahme; die redaktionelle Frische bleibt ein Betriebsprozess. | SEO-/Statusprüfung lokal abgeschlossen; Veröffentlichung und späterer Rebuild bleiben separat. |
| `MVP-06` | Antwortprozess | Lokal abgeschlossen: öffentliches Antwortfenster und interne Deadline-Logik verwenden einen Arbeitstag. | Nacht-, Wochenend- und Geschäftszeitszenarien erfüllen dieselbe dokumentierte Regel. | Ersetzt das nicht sicher tragbare 12-Stunden-/Morgen-Versprechen. | Operative Angabe bestätigt; Veröffentlichung bleibt separat. |
| `MVP-07` | Cross-Domain-SEO | `logopädiejobs.de` als einzige konkrete `JobPosting`-Quelle umsetzen; Praxis-Karriereseiten in DE/TR und `public/llms.txt` zu Arbeitgeberbrücken ohne eigene aktuelle Stellenkopie umbauen. | Genau eine aktive JobPosting-URL; Praxisbrücken verlinken tief, bleiben DE/TR konsistent und wiederholen in `llms.txt` keine aktuellen Konditionen. | Verhindert doppelte Stellenquellen und Repository-Drift. | Separate Freigabe für beide Repositories und SEO-Änderung nötig. |
| `MVP-08` | Regressionstests | Im Jobportal lokal abgeschlossen; Cross-Domain-Markup der Praxiswebsite bleibt Teil von `MVP-07`. | Datenmodell, Gehaltsformel, Parität, fünf Statuswerte, kalendarischer Ablauf, direkter POST und Antwortfenster sind getestet; zweites Repository folgt separat. | Macht die fachlichen Entscheidungen dauerhaft prüfbar. | Jobportal grün; Praxiswebsite benötigt eigenen Auftrag und eigene Checks. |

## P2 — nach stabiler P1-Basis

| ID | Bereich | Aktion | Abnahmekriterium | Begründung | Freigabe |
| --- | --- | --- | --- | --- | --- |
| `MVP-09` | Bewerbungswege | Formular, WhatsApp, Telefon und E-Mail gleichrangig aus einer Wegeliste ausgeben; Post separat entscheiden. | Jede sichtbare Route ist aktiv und in allen Komponenten, Seiten, FAQ-/Schema-Ausgaben, Ratgeber-CTAs und Datenschutztexten konsistent; deaktivierte Wege erscheinen nirgends. | Einfachheit ist gestützt, ein Einzelkanal nicht. | Text- und Datenschutzprüfung nötig. |
| `MVP-10` | Rückruf | Minimalen Rückrufwunsch nur als eigenständiges Paket spezifizieren. | Datenfluss, Löschfrist, Validierung, Spam-Schutz und Verantwortlichkeit sind vor Implementierung dokumentiert. | Rückruf kann Friktion reduzieren, verarbeitet aber personenbezogene Daten. | Separate Datenschutz- und Implementierungsfreigabe nötig. |
| `MVP-11` | Aktualitätsprozess | Serverseitige Ablaufgrenze lokal abgeschlossen; redaktioneller Prüf- und Rebuildprozess bleibt operativ offen. | Nach `validThrough` stoppt die Datenannahme automatisch. Markup, CTA, Sitemap und sichtbare Stellenkommunikation werden durch bewusste Statusentscheidung plus neuen Build/Deploy aktualisiert. | Veraltete Anzeigen sind ein wiederkehrendes Vertrauensproblem. | Verantwortliche Person und verbindlichen Termin spätestens zum 18.01.2027 festlegen. |
| `MVP-12` | Seitenrollen | Jobportal-Startseite als Übersicht und Jobdetail als lokale Stellenantwort schärfen. | Titel, H1, interne Links und Canonicals haben klar getrennte Suchintentionen. | Reduziert interne Kannibalisierung. | SEO-Textfreigabe nötig. |
| `MVP-13` | Organisationsschema | Doppeltes `sameAs` korrigieren und Komponente fachlich umbenennen. | Alle vorgesehenen Profile bleiben im gebauten JSON-LD erhalten. | Beseitigt stilles Überschreiben. | Keine externe Freigabe nach Code-Review. |

## P3 — erst nach PII-freiem Messkonzept

| ID | Bereich | Aktion | Abnahmekriterium | Begründung | Freigabe |
| --- | --- | --- | --- | --- | --- |
| `MVP-14` | Ereignisvertrag | Ereignisse für Optionsansicht, Wegauswahl, Formularstart, Annahme und technische Fehler spezifizieren. | Keine Rückrufwerte, Nachrichten, Dokumente oder personenbezogene URL-Werte; Consent-Verhalten dokumentiert. | Klicks allein reichen nicht, Tracking darf aber keine Bewerbungsinhalte erfassen. | Datenschutz- und Trackingfreigabe nötig. |
| `MVP-15` | Kanalvergleich | Qualifizierte Eingänge je Weg nur aggregiert auswerten. | Bericht enthält Anzahlen und Attributionsgrenzen, keine Bewerberdaten. | Dient der späteren Kanalentscheidung. | Freigabe vor produktivem Tracking nötig. |
| `MVP-16` | UX-Hypothese | Dauer nur für Rückruf/Kurzformular aggregiert messen. | Median/P75 dokumentiert; „60 Sekunden“ bleibt intern eine Hypothese. | Verhindert unbelegtes öffentliches Versprechen. | Trackingfreigabe nötig. |

## Bewusst nicht im MVP

- fremde Arbeitgeber oder öffentliche Stelleneinreichung;
- Supabase, PostgreSQL oder andere Bewerberdatenbank;
- Bewerberkonto, Authentifizierung, Lebenslaufupload oder Talentpool;
- Arbeitgeber-Dashboard, Self-Service, Zahlung oder Rechnungsmodul;
- KI-generierte Mitarbeitende, Testimonials oder scheinbar reale Praxisszenen;
- Google- oder Meta-Mediabudget vor konsistenter Stellenquelle und belastbarem Erfolgsereignis.

## Empfohlene Ausführungsreihenfolge

1. `MVP-01` bis `MVP-06` sowie der Jobportal-Anteil von `MVP-08`: lokal umgesetzt und geprüft.
2. `MVP-07`: Praxiswebsite als DE/TR-Arbeitgeberbrücke separat anpassen.
3. `MVP-09`, operativer Teil von `MVP-11`, `MVP-12`, `MVP-13`: Wege, Aktualitätsprozess und SEO-Rollen vervollständigen.
4. `MVP-14` bis `MVP-16`: Messung erst nach separater Datenschutzfreigabe.

Die lokale Umsetzung ist keine Live-Freigabe. Offene Rechts-/Betriebspunkte, Commit, Push und Deploy bleiben getrennte Entscheidungen.
