# Corporate-Design-Angleichung · 13.09.2026

## Veröffentlichungsfreigabe

Sinan hat am 13.09.2026 mit „go“ die Websiteänderungen und Abschlussdokumentation zum Commit, Push und zur Veröffentlichung freigegeben. Der nachfolgende Prüfbericht beschreibt den Stand vor dem Release; Live-Nachweis wird im Strategie-Repository unter RELEASE-006 dokumentiert.

## Kurzfazit
Lokal umgesetzt; Veröffentlichung ausstehend. Freigabe: Sinan, „Ja, machen“ zur Angleichung von Markenschriften, Farben und Buttons.

## Umfang
Worker D: bestehende Website-Struktur. Fraunces 600 und Plus Jakarta Sans 400/500/600/700 lokal mit Latin/Latin-Extended und OFL-Lizenzen. Gemeinsame warme Neutralpalette, Petrol/Terrakotta, ruhige Buttons mit 8 px Radius, abgestimmte Schatten und Überschriften. Bestehende Utility-Namen sind Kompatibilitätsaliase für die Markenrollen; SVG-Logo unverändert. Artikel- und Rechtstextstyles ebenfalls farblich angeglichen. Keine neuen Fotos, Arbeitgeberversprechen, Formular-, Tracking-, Routing- oder Kontoeinstellungen.

## Prüfung
- verify.sh: Build mit 21 Seiten erfolgreich; kein @astrojs/check installiert, daher laut bestehendem Prüfskript kein Astro-Typcheck.
- Scriptlogik und Link-/Formularziele aller Astro-Dateien per Vergleich mit HEAD unverändert.
- Startseite und Stellenanzeige bei 1280 px visuell geprüft; Markenschrift geladen.
- Startseite/Stelle bei 390 px sowie Rechnerkopf bei 320 px in echten iframe-Viewports visuell geprüft. Kein echter Mobilgerätetest. Mobiles Menü geöffnet und lesbar.
- Restgrenze: keine vollständige visuelle Abnahme aller 21 Seiten und aller Interaktionszustände. Bestehende Fotos und Kanal-Logo bleiben bewusst erhalten. Diese Umsetzung allein vereinheitlicht nicht sämtliche Facebook-Altbeiträge oder Praxis-Headerflächen.

## Nächster Schritt
Lokale Vorschau unter http://127.0.0.1:4349/ ansehen; danach separaten Commit/Push und automatische Veröffentlichung freigeben. Keine neue Ads-Freigabe.

## Git
Nicht gestaged, nicht committed. Es wurde nichts gepusht.
