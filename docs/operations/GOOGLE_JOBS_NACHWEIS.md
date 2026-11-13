# Google-Jobs-Nachweis: Prüfanleitung

Stand: 13.11.2026. Gehört zu DEC-457 (Repo `Logopädie`) und dem Plan „Qualifikationsfilter und Google-Jobs-Nachweis“.

**Zweck:** Belegen, ob die Stelle der Praxis für Logopädie Şimşek technisch gültig ausgezeichnet ist und ob sie bei Google als Stellenangebot erscheint. Das JobPosting ist live ausgeliefert (baseSalary 23–26 €/h, datePosted 2026-09-27, directApply true, Stand 13.11.2026). Ob Google die Stelle anzeigt, ist noch nicht belegt.

**Grenze:** Sinan führt die Prüfungen aus. Ein Agent trägt Ergebnisse erst nach Rückmeldung ein. Die Domain-Verifizierung in der Search Console ist eine DNS-Aktion und wird gesondert freigegeben. Google gibt keine Platzgarantie für Google Jobs.

**Stellen-URL:** `https://xn--logopdiejobs-kcb.de/jobs/logopaedin-sprachtherapeut-duisburg/`

## Prüfungen

1. **Rich-Results-Test**
   - Öffnen: `https://search.google.com/test/rich-results`
   - URL der Stelle eingeben und testen.
   - Erwartet: „Stellenausschreibung: 1 gültiges Element“. Warnungen notieren.
2. **Search Console, URL-Prüfung**
   - Prüfen, ob eine Property für die Domain vorhanden ist.
   - URL der Stelle in die URL-Prüfung eingeben.
   - Erwartet: „URL ist bei Google“ und Erweiterung „Stellenausschreibungen“ gültig.
   - Ohne Property: als offenen Punkt notieren. Die Domain-Verifizierung ist eine DNS-Aktion und braucht eine gesonderte Freigabe.
3. **Search Console, Sitemaps**
   - Prüfen, ob `sitemap-index.xml` eingereicht ist.
   - Datum des letzten Abrufs und Status notieren.
4. **Echte Suche**
   - Privates Fenster, Standort Duisburg.
   - Suchen: „Logopäde Stellen Duisburg“ und „Logopädin Job Duisburg Teilzeit“.
   - Erscheint die Stelle im Google-Jobs-Kasten? Position und Titel notieren.
5. **Gegenprobe Bundesagentur-Jobbörse** (nur falls dort geschaltet)
   - Erscheint deren Anzeige statt unserer? Notieren, welche Quelle Google bevorzugt.

## Ergebnisse

Nur eintragen, was geprüft wurde. Keine Screenshots mit personenbezogenen Daten ablegen.

| Prüfung | Datum | Ergebnis | Beleg (Screenshot-Pfad) | Offen |
|---|---|---|---|---|
| 1. Rich-Results-Test | | | | offen |
| 2. Search Console, URL-Prüfung | | | | offen |
| 3. Search Console, Sitemaps | | | | offen |
| 4. Echte Suche | | | | offen |
| 5. Gegenprobe Bundesagentur | | | | offen |

## Auswertung

- Test 1 gültig, aber Test 4 ohne Treffer: Das ist kein Fehler der Auszeichnung. Indexierung und Anzeige dauern und sind nicht garantiert.
- Test 1 mit Fehlern oder Pflichtwarnungen: Auszeichnung korrigieren (eigener Auftrag).
- Ohne Search-Console-Property: Nachweis bleibt auf Test 1 und 4 beschränkt.
