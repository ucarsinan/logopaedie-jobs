# Plattform-Discovery v01

Stand: 24.11.2026

Owner: Produktverantwortung der Praxis für Logopädie Şimşek

## Zweck und Grenzen

Dieses Verzeichnis steuert die sechsmonatige Discovery und den Pilotbetrieb. Bis zum Nachweis der Zahlungsbereitschaft gelten harte Grenzen von maximal **5.000 Euro externe Kosten** und **4 bis 6 Stunden pro Woche** Betreiberzeit. Das Mediabudget der eigenen Personalsuche wird getrennt betrachtet.

Maschinenlesbarer Prüfvertrag:

```yaml
external_cost_cap_eur: 5000
weekly_time_min_hours: 4
weekly_time_max_hours: 6
```

Diese Artefakte enthalten ausschließlich aggregierte oder nicht personenbezogene Angaben. Verboten sind insbesondere Namen, E-Mail-Adressen, Telefonnummern, Kontaktdaten, Nachrichten, Lebensläufe und Transkripte. Interviewnotizen, schriftliche Zusagen und sonstige Belege mit Personenbezug liegen außerhalb von Git in einem freigegebenen, zugriffsgeschützten System. In Git werden nur aggregierte Anzahlen und Belegstatus dokumentiert.

## Gemeinsames Vokabular

Belegstatus:

- `SUPPORTED`: Die definierte Schwelle ist mit belastbaren Belegen erreicht.
- `PARTIALLY_SUPPORTED`: Es gibt belastbare Teilbelege, die Schwelle ist aber noch nicht vollständig erreicht.
- `INSUFFICIENT_EVIDENCE`: Die vorhandenen Belege reichen für eine Bewertung nicht aus.
- `CONFLICTING`: Belastbare Belege widersprechen einander.
- `NOT_FOUND`: Es wurde kein verwertbarer Beleg gefunden.

Entscheidungen:

- `GO`: Die Gate-Bedingungen sind vollständig erfüllt; der freigegebene nächste Schritt darf geplant werden.
- `ADAPT`: Die Hypothese oder Prüfmethode wird innerhalb der Produkt- und Budgetgrenzen angepasst.
- `STOP`: Die Aktivität wird beendet; die nächste Stufe wird nicht begonnen.

## Reviewrhythmus

Die Produktverantwortung prüft monatlich Hypothesen, Gates, Risiken, Zeit und externe Kosten und dokumentiert eine Entscheidung `GO`, `ADAPT` oder `STOP`. Eine Gate-Entscheidung ersetzt keine separat erforderliche Rechts-, Datenschutz-, Veröffentlichungs-, Kosten-, Installations-, Commit- oder Push-Freigabe.

## Artefaktindex

- `HYPOTHESENREGISTER.md`: Hypothesen, Prüfmethoden, Schwellen und Entscheidungen
- `GATE-SCORECARD.md`: verbindliche Gate-Schwellen und aktueller Belegstatus
- `BUDGET-UND-ZEITLOG.csv`: aggregierter Zeit- und Kostenverbrauch
- `RISIKOREGISTER.md`: Risiken, Gegenmaßnahmen und Eskalationsgrenzen
- `STELLENSTANDARD-V1.md`: evidenzbasierter redaktioneller Feld- und Validierungsstandard für die eigene Stelle
- `IST-SOLL-RECRUITING.md`: Abgleich der beiden Websites mit den belegten und vorläufigen Pflichtinformationen
- `RECRUITING-MVP-BACKLOG.md`: priorisierte Umsetzungspakete, Freigaben und bewusste Nicht-Ziele
