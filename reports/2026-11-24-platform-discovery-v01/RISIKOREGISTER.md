# Risikoregister

| ID | Risiko | Frühindikator | Gegenmaßnahme | Owner | Belegstatus | Entscheidung |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Personenbezogene Daten gelangen in Git oder allgemeine Reports. | Nicht aggregierte Interview-, Kontakt- oder Bewerbungsinhalte werden zur Ablage vorgeschlagen. | Keine personenbezogenen Daten in Repository-Artefakten; sensible Belege ausschließlich außerhalb von Git zugriffsgeschützt verwahren. | Produktverantwortung | `SUPPORTED` | `GO` |
| R-02 | Externe Kosten überschreiten vor Zahlungsbereitschaft 5.000 Euro. | Restbudget reicht nicht für den nächsten freizugebenden Schritt. | Monatlicher Kostenreview; keine neue externe Ausgabe ohne passende Freigabe; bei Überschreitung `STOP`. | Produktverantwortung | `INSUFFICIENT_EVIDENCE` | `ADAPT` |
| R-03 | Betreiberzeit überschreitet dauerhaft 4 bis 6 Stunden pro Woche. | Wiederholte Wochenwerte über 6 Stunden. | Umfang reduzieren und im Monatsreview `ADAPT` oder `STOP` entscheiden. | Produktverantwortung | `INSUFFICIENT_EVIDENCE` | `ADAPT` |
| R-04 | Gates werden aufgrund von Reichweite statt belastbarer Nachfrage geöffnet. | Klicks oder Impressionen werden als Ersatz für Gate-Schwellen verwendet. | Nur die Scorecard-Schwellen und freigegebenen Belegarten zählen. | Produktverantwortung | `INSUFFICIENT_EVIDENCE` | `ADAPT` |
| R-05 | Externe Anzeigen oder Bewerberverarbeitung starten ohne Rechts- und Datenschutzprüfung. | Pilotveröffentlichung oder zentraler Kontaktweg wird vor Abnahme geplant. | Vor dem jeweiligen Gate Rechts-, Datenschutz- und Sicherheitsprüfung dokumentieren; bis dahin `STOP`. | Produktverantwortung | `INSUFFICIENT_EVIDENCE` | `STOP` |
