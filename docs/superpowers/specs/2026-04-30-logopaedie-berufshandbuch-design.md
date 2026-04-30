# Logopädie-Berufshandbuch — Design Spec

**Datum:** 2026-04-30  
**Projekt:** logopädiejobs.de  
**Status:** Approved for spec review  

---

## Ziel

Der bestehende Ratgeber-Bereich wird zu einem klar positionierten Berufshandbuch für Logopädinnen, Logopäden und Sprachtherapeutinnen. Die öffentliche kanonische URL lautet `/berufshandbuch/`; bestehende `/ratgeber/`-URLs bleiben als 301-Weiterleitungen erhalten. Die Website soll damit nicht nur eine Jobbörse sein, sondern eine fachlich nützliche Quelle für Karriere, Gehalt, Arbeitsmodelle, Spezialisierung und Praxisalltag.

Der Bereich richtet sich ausschließlich an Fachpersonen und beruflich Interessierte in der Logopädie. Es entsteht kein Patientenportal und keine Laien-Enzyklopädie.

---

## Grundrichtung

Gewählte Richtung: **Berufshandbuch**

Das Berufshandbuch verbindet drei Funktionen:

- Karriereorientierung: Bewerbung, Wechsel, Berufsstart, Quereinstieg, Stellenwahl.
- Berufliches Wissen: Gehalt, Arbeitszeitmodelle, Settings, Spezialisierungen.
- Fachliche Autorität: praxisnahe Einordnung von Störungsbildern und Therapieprofilen aus beruflicher Perspektive.

Diese Richtung passt besser zur bestehenden Jobbörse als ein allgemeines Patienten-Wissensportal. Sie stärkt Recruiting-Ziele, ohne den Ratgeber auf reine Stellenwerbung zu reduzieren.

---

## Informationsarchitektur

`/berufshandbuch/` ist die öffentliche, kanonische URL. Die Seite wird nicht mehr als einfache Artikelliste präsentiert, sondern als strukturierter Hub mit vier Themenwelten. Alte `/ratgeber/`-Pfade leiten auf die entsprechenden Berufshandbuch-URLs weiter.

### Themenwelten

1. **Karriere & Bewerbung**
   - Bewerbung als Logopädin
   - Bewerben ohne Anschreiben
   - Quereinstieg und Ausbildung
   - Praxiswechsel und Berufsstart

2. **Gehalt & Arbeitsmodelle**
   - Gehalt in NRW und Duisburg
   - Gehaltsrechner
   - 4-Tage-Woche
   - Teilzeitmodelle

3. **Fachwissen & Spezialisierung**
   - Stottertherapie
   - Bilinguale Sprachtherapie
   - Fachliche Schwerpunkte und Fortbildung
   - Diagnostik- und Therapieprofile aus Berufsperspektive

4. **Praxisalltag & Region**
   - Arbeiten in Duisburg
   - Freie Praxis oder Klinik
   - Team, Einarbeitung, Dokumentation
   - Regionale Arbeitsmarkteinordnung NRW/Ruhrgebiet

### Bewusste Grenzen

- Keine Patienten- oder Elternrubrik.
- Keine medizinische Enzyklopädie für Laien.
- Fachwissen wird immer beruflich eingeordnet: Was bedeutet das Thema für Arbeit, Spezialisierung, Bewerbung, Gehalt oder Praxisalltag?
- Keine sichtbare Doppelbenennung: Navigation, Breadcrumbs, Canonicals, interne Links und Sitemap zeigen auf `/berufshandbuch/`.

---

## Seitenaufbau

Die neue `/berufshandbuch/`-Startseite wird als Berufshandbuch-Hub aufgebaut.

### Hub-Elemente

- **Hero:** Klare Positionierung als "Berufshandbuch für Logopädinnen und Logopäden".
- **Geführte Einstiege:** Fragebasierte Einstiege nach Nutzerabsicht, zum Beispiel:
  - "Ich möchte mein Gehalt einschätzen"
  - "Ich suche ein besseres Arbeitsmodell"
  - "Ich will mich bewerben oder wechseln"
  - "Ich möchte mich spezialisieren"
- **Themenwelt-Karten:** Vier Karten für die oben definierten Themenwelten.
- **Tool-Bereich:** Gehaltsrechner, aktuelle Stelle, WhatsApp-Bewerbung.
- **Empfohlene Artikel:** Redaktionell priorisierte Artikel pro Themenwelt.
- **Alle Artikel:** Weiterhin vollständige Artikelliste, aber nach Themenwelt gruppiert oder visuell klarer gegliedert.

### Artikel-Seiten

Einzelne Artikel erscheinen öffentlich unter `/berufshandbuch/[slug]/` und behalten bestehende SEO-Bausteine:

- Article-Schema
- Breadcrumbs
- DefinitionBox
- FAQBlock mit FAQPage-Schema
- Related Articles
- Kontextueller CTA

Jeder Artikel soll stärker als Teil des Berufshandbuchs erkennbar werden. Dazu gehören Themenwelt, Nutzerabsicht und ein sinnvoller nächster Schritt.

---

## Technische Architektur

Die Umsetzung bleibt nahe an der bestehenden Astro-Struktur.

### Bestehende Struktur

- Content bleibt in `src/content/ratgeber/*.md`.
- Der Hub liegt in `src/pages/berufshandbuch/index.astro`.
- Die Artikelseiten liegen in `src/pages/berufshandbuch/[slug].astro`.
- SEO-Grundlagen wie Canonical, Open Graph, Breadcrumbs und Article-Schema bleiben erhalten.

### Neue Strukturfelder

`src/content.config.ts` wird um redaktionelle Felder erweitert:

- `topic`: Themenwelt des Artikels.
- `intent`: primäre Nutzerabsicht.
- `featured`: optionaler redaktioneller Hinweis für Hub-Empfehlungen.
- `priority`: optionale Sortierung innerhalb einer Themenwelt.

Die Werte werden als Enums oder klar validierte Felder umgesetzt, damit der Build bei unbekannten Themenwelten oder Absichten fehlschlägt.

### Neue Komponenten

Für die Hub-Seite werden kleine, klar abgegrenzte Komponenten vorgesehen:

- `TopicCard.astro`: Themenwelt mit Beschreibung, Artikelanzahl und wichtigsten Links.
- `IntentEntry.astro`: Fragebasierter Einstieg in passende Artikel oder Tools.
- `ToolCallout.astro`: Gehaltsrechner, Job oder Bewerbungskontakt.
- `ArticleCluster.astro`: Gruppierte Artikelansicht pro Themenwelt.

Die Komponenten sollen keine neue Datenquelle einführen. Sie erhalten vorbereitete Artikelgruppen aus `getCollection('ratgeber')`.

---

## Datenfluss

1. Markdown-Artikel definieren Frontmatter wie Titel, Beschreibung, Kategorie, Themenwelt, Intent und Related Articles.
2. Astro Content Collections validieren diese Daten beim Build.
3. `/berufshandbuch/index.astro` lädt alle nicht-draft Artikel.
4. Die Hub-Seite gruppiert Artikel nach Themenwelt und priorisiert `featured`/`priority`.
5. Einzelartikel nutzen weiterhin ihre eigenen Frontmatter-Daten für Article-Schema, FAQ, Definition und Related Articles.

Fallback-Regel: Wenn bestehende Artikel noch kein neues Strukturfeld haben, bekommen sie bei der Migration bewusst eine passende Themenwelt. Langfristig soll kein veröffentlichter Artikel ohne Themenwelt bleiben.

---

## Redaktionelle Regeln

- Jeder neue Artikel beantwortet eine konkrete berufliche Frage.
- Jeder Artikel wird einer Themenwelt zugeordnet.
- Jeder Artikel bekommt eine primäre Nutzerabsicht.
- Jeder Artikel verlinkt intern auf mindestens einen verwandten Artikel, ein Tool oder eine passende Job-/Bewerbungsseite.
- Fachartikel erklären nicht nur ein Störungsbild, sondern ordnen ein, was es für Spezialisierung, Praxisarbeit, Fortbildung oder Bewerbung bedeutet.
- Definition und FAQ bleiben bevorzugte Bausteine, weil sie Suchmaschinen und AI-Antwortsystemen kompakte Zitierstellen geben.

---

## SEO- und AI-SEO-Wirkung

Das Berufshandbuch stärkt die Seite auf drei Ebenen:

- **Topical Authority:** Die Website deckt Logopädie-Berufsthemen zusammenhängend ab, statt isolierte Artikel zu veröffentlichen.
- **Interne Verlinkung:** Themenwelten und Related Articles machen Cluster sichtbarer.
- **Answer Engine Optimization:** DefinitionBox, FAQ und klare Einstiegsfragen erhöhen die Chance, in AI-Antworten und Such-Snippets zitiert zu werden.

Die bestehende Jobbörse profitiert indirekt, weil mehr fachlich relevante Besucherinnen auf die Domain kommen und an passenden Stellen zu Jobs oder Bewerbung weitergeführt werden.

---

## Testing

Vor Abschluss der Umsetzung müssen diese Prüfungen erfolgreich sein:

- `npm run build` läuft ohne Content-Schema-Fehler.
- `/berufshandbuch/` rendert mit allen vier Themenwelten.
- Desktop- und Mobile-Ansicht der Hub-Seite sind visuell geprüft.
- Bestehende Artikel-URLs unter `/ratgeber/[slug]/` leiten per 301 auf `/berufshandbuch/[slug]/` weiter.
- Interne Links zeigen nicht auf alte URLs wie `/gehalt/`, `/4-tage-woche/` oder `/bilingual/`.
- Artikel ohne `draft: true` erscheinen im Hub.
- Schema.org-Ausgabe für Article, FAQ und CollectionPage bleibt gültig.

---

## Nicht im Scope

- Neue Patienten- oder Elterninhalte.
- Volltextsuche.
- Komplexes Tag-System.
- Neue CMS-Struktur.
- Neue öffentliche Doppelstruktur neben `/berufshandbuch/`; `/ratgeber/` bleibt ausschließlich Redirect.
- Backlink-Aufbau.
- Google Search Console Konfiguration.

---

## Umsetzungseinheit

Diese Spec ist als ein fokussierter Implementierungsschritt gedacht:

1. Content-Schema erweitern.
2. Bestehende Artikel mit Themenwelt, Intent und Priorität ergänzen.
3. Hub-Komponenten bauen.
4. `/berufshandbuch/index.astro` zum Berufshandbuch-Hub umbauen.
5. Navigation von "Ratgeber" zu "Berufshandbuch" umbenennen und `/ratgeber/` per Redirect erhalten.
6. Build und visuelle Prüfung durchführen.
