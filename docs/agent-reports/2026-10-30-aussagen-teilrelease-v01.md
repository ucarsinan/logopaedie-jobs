# Aussagenkorrekturen — Teilrelease v01, 30.10.2026

Sinan hat Prüfung, Commit, Push und Veröffentlichung der 29 fertigen Korrekturen ausdrücklich beauftragt. Ausgangsstand a8eeda847022f6cf009d9cbc3ed762d433efd00a; Ziel origin/main und bestehendes Vercel-Gitdeployment.

## Umfang

B01–B26 und B31–B33: 13 Ratgeber, Stundenlohnrechner statt unbelegter Marktprognose, Fach-/Ausbildungs-/Arbeitszeitaussagen, Bewerbungswege, Quellen, FAQ, sichtbare Redaktion, Datums-/Suchmetadaten und llms.txt. Exakte20 Website-Dateien plus Rechnertest und SHA256 stehen in der JSON-Datei gleichen Namens.

Datenschutz und Impressum sind ausdrücklich ausgeschlossen. B27–B30 bleiben offen (Herkunftsauswertung/Endgerätezugriff, Hosting/Analytics/Verträge, Umgang mit sensiblen Eingängen, individuelle Berufs-/Aufsichtsangaben). Die lokalen Entwürfe bleiben unangetastet und unveröffentlicht. Keine Änderung an Formular, Herkunftserfassung, Analytics, Hosting, DNS, Konten oder Budget; kein echter Formularversand. Bestehende Risiken werden nicht als behoben erklärt.

## Prüfung

Kleine isolierte Quellkopie mit den bisherigen Rechtstexten: /private/tmp/logopaediejobs-claims-release-20261030. Keine Installation, keine vollständige Dependencykopie; kontrollierte Verweise auf vorhandene Pakete, separate lokale Caches. Höchstens150MiB geplant, kein großer Lauf bei14GiB freiem Platz. Erster Buildzugriff auf gemeinsamen Vite-Cache scheiterte an Sandboxrechten; danach Caches getrennt, Originalkonfiguration und Releasequellen unverändert.

- Node22.23.3: ./scripts/verify.sh erfolgreich (Build/Whitespace); Typecheck mangels vorhandenem Checkskript/Paket übersprungen.
- node --test tests/*.test.mjs:150/150 bestanden.
- 21 Source-/Testhashes identisch mit Releasekopie; ausgeschlossene lokale Entwürfe unverändert, Rechtstexte im Build bytegleich HEAD.
- 13 Article-Schemas mit Organization-Autor/Datum30.10.2026; Rechtstexte noindex und nicht in Sitemap, llms-Ausgabe bytegleich Quelle.
- Desktop1280/Mobil375: Rechner visuell geprüft;23€/30h ->2990€/Monat,1200€ Sonderzahlung ->37080€/Jahr,600€ Zusatzbeitrag separat. Nullstunden liefert Fehler und leert Ergebnisse. Mobil kein Seitenüberlauf; Ausbildungstabelle327px mit643px internem Inhalt.
- Unabhängiger read-only Review release_review ohne handlungsrelevante Befunde oder Abhängigkeit von den ausgeschlossenen Rechtstexten.
- Zentraler Projektvalidator und52Brandtests bestanden. Globaler --require-ready-Check hat dieselben15 historischen fremden Assetbefunde; kein globaler Brand-PASS. Astro und semantische Inhalte sind nicht durch den statischen HTML/PNG-Adapter automatisch abgenommen.

Keine neue medizinische/rechtliche Abnahme, Betriebs-/Postfachprüfung oder Suchindexierungsbehauptung. Vorheriger vollständiger33-ID-Bericht bleibt lokale historische Evidenz; diese neue Datei dokumentiert den freigegebenen Teilumfang eigenständig.

## Git und Rückkehr

Nur die Manifestdateien, dieser Bericht, Projektstand und freigegebenen Quellen/Test werden gestaged. Nicht freigegebene Rechtstexte und weitere lokale Berichte bleiben außerhalb des Commits. Commit/Push und Liveergebnis werden im zentralen Releasebeleg nachgetragen. Rückkehr wäre ein eigener freizugebender Revert des Releasecommits; keine automatische Rücknahme.

Prüfkopie nach Abschluss zur Bereinigung bis01.11.2026 vorschlagen, nur nach exaktem Löschauftrag; nichts löschen. Historische Quellen bleiben über Gitbase und Releasecommit reproduzierbar. Verwendete Skills: verification-before-completion — exakter Build/Test/Hashnachweis; dispatching-parallel-agents — unabhängiger Quellreview.
