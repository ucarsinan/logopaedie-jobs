# Suchmaschinenprüfung vor dem V8-Relaunch

**Stand 28. November 2026.** Alle 19 Adressen aus der zuvor öffentlich abgerufenen Sitemap sind auch im lokalen V8-Build unter ihrer bisherigen Adresse erreichbar und indexierbar. Veröffentlicht wurde ausschließlich die Korrektur der beruflichen Qualifikation in der Duisburger Stellenanzeige.

## Was sich für Suchende ändert

| Bereich | Befund und Auswirkung | Umsetzung und Nachweis |
| --- | --- | --- |
| Google Jobs · P1 · SUPPORTED | Google erkannte die Stelle, beanstandete aber das Feld für den Berufsabschluss. | Das Feld bezeichnet die Berufsqualifikation nun strukturiert als `professional certificate`. Der deutsche Qualifikationstext bleibt erhalten. Googles erneuter Abruf der Live-Anzeige ergab eine gültige Stelle ohne Warnung. [Vergleich vor der Änderung](https://search.google.com/test/rich-results/result?id=3aBY2Cd0_ZB9SZWUfcuxiA) · [Ergebnis nach der Änderung](https://search.google.com/test/rich-results/result?id=gHFzgqWE0mIoM0cOvbgUZQ) |
| Bisherige Adressen · P1 · SUPPORTED | Ein Relaunch kann gespeicherte Links zu Artikeln, Formularen und Werkzeugen unterbrechen. | Alle 19 Sitemap-Adressen sowie Impressum, Datenschutz und Bewerbungsbestätigung lieferten vor dem Relaunch HTTP 200. Ihr Gegenstück existiert im V8-Build. Acht frühere Sprungmarken führen in der lokalen Vorschau mit Kampagnenparameter zum richtigen Abschnitt der Praxisseite. [URL-Bestand](../seo/bestand-vor-v8.txt) |
| Historische Links · P2 · SUPPORTED | Drei Ratgeber-Kurzadressen hatten zwei Weiterleitungen. Alte XML-Adressen liefen ins Leere. Das Webarchiv enthält außerdem frühere HTML-Adressen der Rechtstexte. | Die drei Kurzadressen führen im V8-Regelwerk direkt zum Ziel. Die XML-Adressen führen zum Sitemap-Index, `/datenschutz.html` und `/impressum.html` zum jeweiligen Rechtstext. Für 26 entfallende Bildvarianten des bisherigen Produktionsbuilds ist jeweils eine permanente Weiterleitung zum selben Motiv geprüft. |
| Auffindbarkeit und Vorschau · P2 · SUPPORTED | Praxisgeschichten brauchten eindeutige, maschinenlesbare Angaben zu Artikel, Herausgeber und Vorschaubild. | Die V8-Prüfung gleicht Sitemap, Indexierbarkeit und Canonicals ab und kontrolliert interne Links, Sprungziele und Vorschaubilder. Alle 41 indexierbaren Seiten sind über Links ab der Startseite erreichbar. Strukturierte Artikeldaten und eindeutige Metadaten ergänzen das sichtbare Angebot für Leser und Suchdienste. |
| Google- und KI-Sichtbarkeit · P3 · INSUFFICIENT_EVIDENCE | Ein erfolgreicher Abruf belegt die technische Eignung. Wie oft Google die Stelle ausspielt oder ein KI-Dienst einen Beitrag zitiert, wurde damit nicht gemessen. | Dafür sind die Suchanfragen, Impressionen und Zielseiten nach Veröffentlichung aussagekräftig. Für Googles KI-Funktionen gelten dieselben Grundlagen wie für die übrige Suche. [Google zu KI-Funktionen](https://developers.google.com/search/docs/appearance/ai-features) |

## Grenzen der Prüfung

Der Vergleich verwendet die öffentliche Sitemap, interne Links, Projekthistorie und auffindbare Archiv-Adressen. Ein Export früherer externer Verweise aus der Search Console lag nicht vor. Die separate Schreibweise `logopaediejobs.de` mit „ae“ löste beim Abruf nicht auf. Die geprüfte öffentliche Domain ist `logopädiejobs.de`. Ihre HTTP- und www-Varianten leiten auf die HTTPS-Hauptadresse weiter.

## Übergabe

1. **Lokaler V8-Build.** Mit `./scripts/verify.sh`, `python3 scripts/check-search.py` und `npm test` lassen sich Build, Verlinkung und Weiterleitungsregeln vor der Freigabe erneut prüfen.
2. **Bei einer eigenen Freigabe für V8.** Direkt nach der Veröffentlichung die früheren Adressen und die Sitemap am öffentlichen Host erneut abrufen. Erst dann ist auch die Auslieferung der neuen Regeln auf der Live-Domain belegt.
3. **Nach Veröffentlichung.** In der Search Console den Bericht zur Indexierung und die Suchleistung der Stellen-URL beobachten. Auffällige frühere Zielseiten mit den bekannten Pfaden abgleichen. [Google zur Relaunch-Kontrolle](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

Die Stellenkorrektur wurde ausgehend vom Produktionsstand separat getestet, committed, gepusht und veröffentlicht. Die V8-Änderungen liegen lokal und ungestagt vor. [Freigegebener PR #7](https://github.com/ucarsinan/logopaedie-jobs/pull/7)
