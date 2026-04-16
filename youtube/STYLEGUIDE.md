# YouTube Styleguide — Praxis für Logopädie Şimşek

Dieses Dokument definiert den visuellen Stil für alle YouTube-Videos.
Alle Folien werden in **Apple Keynote** erstellt und als Video exportiert.

---

## Farben

| Verwendung | Farbe | Hex | RGB |
|---|---|---|---|
| Primär (Buttons, Akzente, Icons) | Grün | #7FB719 | 129, 183, 40 |
| Sekundär (Headlines, Hintergründe) | Blau | #1F85C2 | 36, 135, 193 |
| Text (dunkel) | Slate | #1E293B | 30, 41, 59 |
| Hintergrund (hell) | Fast-Weiß | #F8FAFC | 248, 250, 252 |
| Hintergrund (dunkel) | Slate | #1E293B | 30, 41, 59 |
| Weiß | Reinweiß | #FFFFFF | 255, 255, 255 |

### Farbregeln

- **Helle Folien:** #F8FAFC Hintergrund, #1E293B Text
- **Dunkle Folien:** #1E293B Hintergrund, #FFFFFF Text (nur für Intro, Outro, Zwischentitel)
- **Akzente:** Grün für positive Elemente (Häkchen, Hervorhebungen), Blau für Überschriften und Trennlinien
- **Nie:** Grün auf Blau, Blau auf Grün, mehr als 3 Farben pro Folie

---

## Typografie

In Keynote verfügbar, keine Installation nötig:

| Element | Schrift | Größe | Gewicht |
|---|---|---|---|
| Hauptüberschrift | **Avenir Next** | 72–96 pt | Bold |
| Unterüberschrift | Avenir Next | 36–48 pt | Medium |
| Fließtext / Erklärung | Avenir Next | 28–32 pt | Regular |
| Kleine Hinweise | Avenir Next | 20–24 pt | Regular, Farbe #64748B |
| Sprecherkennung (F/L) | Avenir Next | 24 pt | Demi Bold |

### Warum Avenir Next?

Auf jedem Mac vorinstalliert, modern, gut lesbar auf Screens, hat genug Gewichtsstufen.
Eine Schriftfamilie für alles — kein Mischen nötig.

---

## Folienformat

- **Seitenverhältnis:** 16:9 (Standard in Keynote: "Breit")
- **Auflösung:** 1920 × 1080 px
- **Ränder:** Mindestens 80 px von jeder Kante
- **Textausrichtung:** Linksbündig (Ausnahme: zentrierte Titel auf dunklen Folien)

---

## Folientypen

### 1. Intro-Folie (dunkel)
- Hintergrund: #1E293B
- Logo oben links (klein, ca. 120 px breit)
- Videotitel: 72 pt, Weiß, zentriert
- Untertitel: 32 pt, #7FB719 (Grün), zentriert
- Dezenter Farbverlauf-Streifen am unteren Rand (Grün → Blau, 8 px hoch)

### 2. Zwischentitel-Folie (blau)
- Hintergrund: #1F85C2
- Überschrift: 72 pt, Weiß, zentriert
- Für Themenwechsel innerhalb des Videos

### 3. Inhalts-Folie (hell)
- Hintergrund: #F8FAFC
- Grüner Akzent-Balken links (8 px breit, volle Höhe)
- Überschrift oben: 48 pt, #1F85C2
- Text: 28–32 pt, #1E293B
- Schrittweises Einblenden per Keynote-Animation ("Einblenden", 0.5s)

### 4. Aufzählungs-Folie (hell)
- Wie Inhalts-Folie, aber mit Aufzählungspunkten
- Grüne Kreise (●) als Aufzählungszeichen, nicht schwarze
- Jeder Punkt blendet einzeln ein (0.3s Verzögerung)

### 5. Zwei-Spalten-Folie (hell)
- Links/Rechts-Aufteilung 50/50
- Trennlinie: 2 px, #1F85C2, vertikal
- Überschrift je Spalte: 36 pt, #1F85C2
- Inhalt: 28 pt, #1E293B

### 6. Outro-Folie (dunkel)
- Hintergrund: #1E293B
- Logo zentriert, größer (240 px)
- "Praxis für Logopädie Şimşek" darunter: 36 pt, Weiß
- Nächstes Video Hinweis: 24 pt, #7FB719
- Farbverlauf-Streifen am unteren Rand (wie Intro)

---

## Animationen in Keynote

Weniger ist mehr. Nur diese Effekte verwenden:

| Aktion | Effekt | Dauer |
|---|---|---|
| Text erscheint | "Einblenden" | 0.5 Sek |
| Aufzählungspunkt erscheint | "Einblenden" | 0.3 Sek |
| Folienwechsel | "Überblenden" | 0.8 Sek |
| Folienwechsel (Themenwechsel) | "Schieben" | 0.6 Sek |

**Nie verwenden:** Drehen, Hüpfen, Confetti, 3D-Effekte, Magic Move (zu unvorhersehbar).

---

## Sprecherkennung im Video

Wenn Dialog läuft, dezente visuelle Markierung wer spricht:

- Unten links: Sprechername in kleinem Balken
- **F** (Fragender): Grüner Balken (#7FB719), weißer Text
- **L** (Logopädin): Blauer Balken (#1F85C2), weißer Text
- Balken: 280 × 44 px, abgerundete Ecken (8 px), 80% Deckkraft
- Blendet ein/aus mit Sprecherwechsel

---

## Thumbnail-Stil

Alle Thumbnails folgen dem gleichen Aufbau:

- Hintergrund: #1F85C2 (Blau) oder #1E293B (Dunkel)
- Große, fette Überschrift: 2–4 Wörter, Weiß, Avenir Next Bold
- Ein visuelles Element (Icon, Illustration, oder farbiger Shape)
- Logo unten rechts, klein
- Kein Foto, kein Gesicht — passt zum Video-Stil

---

## Workflow pro Video

1. **Skript schreiben** (siehe Skript-Dateien in diesem Ordner)
2. **Audio generieren** — ElevenLabs, zwei Stimmen, als MP3 exportieren
3. **Keynote-Folien bauen** — anhand Skript und Folienvorlagen
4. **Keynote → Video exportieren** — Ablage → Exportieren → Film (1080p)
5. **iMovie** — Audio + Video zusammenführen, Timing anpassen
6. **Export** — 1080p MP4
7. **Upload** — YouTube mit Titel, Beschreibung und Tags aus Skript

---

## Dateistruktur

```
youtube/
├── STYLEGUIDE.md          ← dieses Dokument
├── 01-was-ist-logopaedie-skript.md
├── 02-... (nächste Videos)
└── assets/
    └── (hier ggf. exportierte Thumbnails ablegen)
```

---

## Video-Ideen (Backlog)

1. ✅ Was ist Logopädie? (Skript fertig)
2. Mein Kind spricht nicht richtig — ab wann zum Logopäden?
3. Was passiert in der ersten Logopädie-Sitzung?
4. Stottern bei Kindern — was Eltern wissen sollten
5. Logopädie nach Schlaganfall — was ist möglich?
6. Lispeln: Wann ist es süß, wann ist es ein Problem?
7. Bilinguale Kinder: Sprachentwicklung auf zwei Sprachen
8. Was kostet Logopädie? Zahlt die Krankenkasse?
9. Logopädie vs. Sprachtherapie — gibt es einen Unterschied?
10. Stimmprobleme bei Lehrern und Erziehern
