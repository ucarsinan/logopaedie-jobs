# Positionierungslücken

Stand: 24.11.2026. Grundlage sind die zwölf Angebote in `MARKTKARTE.md` und `WETTBEWERBSMATRIX.csv`. Eine fehlende öffentliche Dokumentation beweist nicht, dass ein Anbieter die Funktion nicht besitzt. Deshalb wird keine Lücke allein aus `NOT_FOUND` als `SUPPORTED` bewertet.

## Findings

### L-01 — Logopädie-spezifische, verpflichtende Vergleichbarkeit

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P1`
- **Problem:** TheraFair bietet detaillierte Therapie-Filter und ein Fairness-Siegel; Gehaltstransparenz ist dort jedoch ein Siegelkriterium und nicht öffentlich als Pflichtfeld jeder Anzeige belegt. Andere Stichprobenangebote empfehlen Gehalt oder zeigen unstrukturierte Anzeigen/PDFs.
- **Auswirkung:** Eine strikt logopädie-spezifische Vergleichsansicht mit verpflichtenden Feldern für Gehalt/Tarif, Wochenstunden, bezahlte Dokumentationszeit, Hausbesuche, Einarbeitung und Fortbildung könnte die Suchentscheidung vereinfachen. Eine allgemeine Behauptung „niemand bietet Transparenz“ wäre falsch.
- **Nächster Schritt:** In Task 5 einen manuellen Pilot mit vollständigen Pflichtfeldern testen und Nutzertests gegen TheraFair durchführen.
- **Begründung:** Teilbeleg durch öffentlich unterschiedliche Datenstrukturen; keine vollständige Prüfung jeder aktiven Anzeige.

### L-02 — Nachvollziehbare Arbeitgeberverifizierung

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P1`
- **Problem:** dbl prüft die Mitgliedsnummer; DocJob24 behauptet die Prüfung neuer Anzeigen und des ersten Arbeitgeberkontos. Umfang, Prüfkriterien und öffentlich sichtbarer Prüfstatus bleiben unklar. Ein Arbeitgeberprofil oder Fairness-Siegel ist nicht gleich Identitätsverifizierung.
- **Auswirkung:** Ein öffentlich erklärtes Prüfverfahren mit Prüfdatum und klarer Bedeutung des Status könnte Vertrauen schaffen, wäre aber kein konkurrenzloses Merkmal.
- **Nächster Schritt:** Vor einem Pilotstatus Mindestprüfung, Nachweisarten, Aktualisierungsfrist und Missbrauchsprozess rechtlich/operativ definieren; keine pauschale „verifiziert“-Aussage verwenden.
- **Begründung:** Konkurrenz bietet Teilprüfungen, aber keine in der Recherche vollständig nachvollziehbare einheitliche Verifikation.

### L-03 — Erstkontakt unter 60 Sekunden ohne Konto und Pflichtupload

- **Status:** `CONFLICTING`
- **Priorität:** `P1`
- **Problem:** KarriereMedizin behauptet ein Formular „in rund einer Minute“ ohne Anschreiben; CuraCareer „etwa eine Minute“ ohne Lebenslauf oder Anschreiben. TheraFair bietet WhatsApp-Direktkontakt, verlangt für Plattformbewerbungen aber ein Konto. Messdaten zur realen Abschlusszeit wurden nicht gefunden.
- **Auswirkung:** „Unter 60 Sekunden“ ist als bloße Marketingaussage nicht differenzierend. Differenzierung wäre nur mit gemessener Zeit, ohne Konto, ohne Pflichtupload und mit konkreter Stelle möglich.
- **Nächster Schritt:** In einem datenschutzgeprüften Prototyp Medianzeit und Abbruchquote messen und Formulierung erst nach Beleg verwenden.
- **Begründung:** Wettbewerber beanspruchen praktisch dasselbe Ziel; unabhängige Leistungsbelege fehlen.

### L-04 — Echte, stellenbezogene Arbeitsplatzvideos

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P2`
- **Problem:** TheraFair erlaubt bis zu drei Videos und stellenbezogene Medien; Therapeutenbörse verteilt Anzeigen in soziale Netzwerke. Nicht belegt ist, wie viele aktive Stellen echte Arbeitsplatzvideos enthalten oder ob Authentizität/Einwilligungen geprüft werden.
- **Auswirkung:** Das reine Vorhandensein eines Videofelds ist keine Lücke. Kuratierte Originalvideos mit Transkript, Rechteprüfung und konkreten Arbeitsbedingungen könnten qualitativ differenzieren.
- **Nächster Schritt:** In Task 7 aktive Videobeispiele stichprobenartig prüfen und für den Pilot einen redaktionellen Video-Standard statt einer Mengenbehauptung definieren.
- **Begründung:** Technische Konkurrenzfunktion vorhanden; Qualitäts- und Nutzungsgrad ungeklärt.

### L-05 — Berufsspezifische Inhalte direkt an der Stellenentscheidung

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P2`
- **Problem:** Verbände besitzen fachliche Nähe, CuraCareer veröffentlicht Gehaltsauswertungen und Spezialbörsen ordnen nach Therapieberuf. Nicht belegt ist eine durchgängige Verbindung von belastbaren Logopädie-Inhalten zu vergleichbaren Stellenmerkmalen und Kontakt.
- **Auswirkung:** Inhalte zu Gehalt, Dokumentationszeit, Anerkennung, Arbeitsmodellen und Fachschwerpunkten könnten direkt als Entscheidungshilfe neben Stellen dienen. Eine generische Content-Strategie wäre dagegen leicht austauschbar.
- **Nächster Schritt:** In Task 5/7 drei bestehende Suchintentionen mit jeweils einem konkreten Vergleichsfeld und einer Stelle verknüpfen; qualifizierte Kontakte statt Seitenaufrufe messen.
- **Begründung:** Teilangebote existieren; die integrierte Journey ist in den geprüften Primärquellen nicht ausreichend belegt.

## Empfohlene Positionierung für den Pilot

Nicht als Alleinstellung verwenden: „Therapie-Jobbörse“, „transparent“, „in einer Minute bewerben“ oder „mit Videos“. Belastbarer prüfbar ist die Kombination: **vollständig ausgefüllte logopädie-spezifische Pflichtfelder, dokumentierte Arbeitgeberprüfung, echter kontaktarmer Weg ohne Konto/Pflichtupload und redaktionell geprüfte Arbeitsplatzmedien**. Auch diese Kombination bleibt bis zu Nutzer- und Arbeitgebertests `PARTIALLY_SUPPORTED` und ändert H-C/H-D nicht.
