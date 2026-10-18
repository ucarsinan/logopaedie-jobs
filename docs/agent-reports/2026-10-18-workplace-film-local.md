# Lokaler Video-Einbau auf der Stellenseite

18.10.2026 · umgesetzt und lokal geprüft, nicht veröffentlicht.

## Umfang
Sinan hat die Vorschau R2 abgenommen und den Einbau ins Website-Projekt beauftragt, ausdrücklich ohne Veröffentlichung. Neue Komponente `src/components/WorkplaceFilm.astro`, Import/Aufruf neben den Kontaktaktionen auf der Stellenseite, acht Medienassets unter `public/videos/workplace-v01/`. Medien bytegleich aus R2 übernommen: W1-Querformat und A1-2/R1-Hochformat. Keine neue Generierung.

## Verhalten
Klick oder Tastatur öffnet einen nativen Dialog und startet die Wiedergabe mit Ton. Vor der ersten Aktion keine Videoquelle und kein Poster im DOM. Unter 640 px Hochformat, sonst Querformat; kein Wechsel mitten in der Wiedergabe. Beim Schließen über Button/Escape/Hintergrund oder Kontaktlink werden Wiedergabe/Quellen freigegeben und der Fokus zurückgesetzt. Explizite Fokusbindung an den Dialoggrenzen. Untertitelspur und Transkript vorhanden.

Die Vorschau-Sperren für Formulare/ausgehende Links sind nicht übernommen. Vorhandene Kontaktlogik, Formulare, Tracking, SEO, Navigation und Inhalte nicht geändert. Kein Formular versendet.

## Verifikation
- `npm test`: 143/143 Tests bestanden.
- `./scripts/verify.sh`: Build und Diff-/Whitespacechecks bestanden.
- Kein separater Astro-Typecheck: kein check-Skript oder @astrojs/check installiert.
- Browser: echter Astro-Dev-Stand Desktop 1280 px und frisch gebauter Website-Stand im 375-px-Viewport geprüft; Klick-Start, Quer-/Hochformat, Escape, Quellenabbau, Fokus-Rückgabe und Shift+Tab/Tab-Bindung bestanden.
- Nachweise im Strategieprojekt: `assets/brand/drafts/2026-10-18/web/r3-website-integration-v01/qa/`.
- Entwicklungsserver meldet bestehenden Hinweis: Vite 8.0.8, Astro erwartet Vite 7. Keine Dependencies geändert; Tests/Build bestehen. Reale Mobilgeräte/Safari und vollständiger Screenreader-Lauf nicht geprüft.

## Freigabegrenze und nächster Schritt
Lokale Abnahme des integrierten Website-Stands. Vor Veröffentlichung kommerzielle Rechte der wiederverwendeten Matilda-Aufnahme klären und eigenes Release-Gate erfüllen. Sinan hat die integrierte Fassung abgenommen und den lokalen Commit ausdrücklich freigegeben. Keine Veröffentlichung, Kontoaktion oder Push. Es wurde nichts gepusht.

## Lokale Ansichten
Website: http://127.0.0.1:4328/jobs/logopaedin-sprachtherapeut-duisburg/
Responsive-Ansicht des lokalen Builds: http://127.0.0.1:8776/
