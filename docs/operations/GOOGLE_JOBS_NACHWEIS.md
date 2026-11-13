# Google-Jobs-Nachweis: Prüfanleitung

Stand: 13.11.2026. Gehört zu DEC-457 (Repo `Logopädie`) und dem Plan „Qualifikationsfilter und Google-Jobs-Nachweis“.

**Zweck:** Belegen, ob die Stelle der Praxis für Logopädie Şimşek technisch gültig ausgezeichnet ist und ob sie bei Google als Stellenangebot erscheint. Das JobPosting ist live ausgeliefert (baseSalary 23–26 €/h, datePosted 2026-09-27, directApply true, Stand 13.11.2026). Ob Google die Stelle anzeigt, ist noch nicht belegt.

**Grenze:** Öffentliche Prüfungen (1, 4, 5) darf ein Agent im Browser selbst ausführen. Die Prüfungen in der Search Console (2, 3) macht Sinan in seinem Google-Konto, ein Agent trägt sie erst nach Rückmeldung ein. Die Domain-Verifizierung in der Search Console ist eine DNS-Aktion und wird gesondert freigegeben. Google gibt keine Platzgarantie für Google Jobs.

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
| 1. Rich-Results-Test | 13.11.2026 | Gültig. Google hat die Seite gecrawlt (13.11.2026, 16:58:50). „Stellenausschreibungen: 1 gültiges Element“ und „Navigationspfade: 1 gültiges Element“. Einziger nicht kritischer Hinweis: Feld `validThrough` fehlt (optional). Bei einer unbefristet offenen Stelle bewusst offen gelassen, kein erfundenes Ablaufdatum. | kein Screenshot abgelegt (Agent, eingebauter Browser) | – |
| 2. Search Console, URL-Prüfung | | | | offen, braucht Sinans Google-Konto |
| 3. Search Console, Sitemaps | | | | offen, braucht Sinans Google-Konto |
| 4. Echte Suche | 13.11.2026 | Suche „Logopäde Stellen Duisburg“ (Standort Duisburg laut IP, Cookies abgelehnt, nicht angemeldet). **Unsere Stelle steht nicht im Google-Jobs-Kasten.** Dort erscheinen drei andere Arbeitgeber, zwei davon „über Bundesagentur Für Arbeit“. Im Maps-Kasten steht die Praxis für Logopädie Şimşek auf Platz 1 (4,5 Sterne, 17 Bewertungen). In den Webergebnissen erscheint `logopaedie-simsek.de/karriere`, nicht logopädiejobs.de. Markensuche „Praxis für Logopädie Şimşek Stellenangebot“: Die KI-Übersicht von Google fasst die Stelle korrekt zusammen (Ort, Stunden, 23–26 €/h, Weihnachtsgeld) und nennt logopädiejobs.de als Quelle. Auch dort kein Google-Jobs-Kasten. | kein Screenshot abgelegt | Treffer schwanken je Nutzer und Tag; einmalige Stichprobe |
| 5. Gegenprobe Bundesagentur | 13.11.2026 | Unsere Stelle ist dort nicht geschaltet (Stand Kanalrecherche 12.11.). Beobachtung: Google zeigt im Jobkasten bevorzugt Anzeigen „über Bundesagentur Für Arbeit“. | – | Anzeige bei der BA schalten (kostenlos, Emel/Sinan) |

## Auswertung

- Test 1 gültig, aber Test 4 ohne Treffer: Das ist kein Fehler der Auszeichnung. Indexierung und Anzeige dauern und sind nicht garantiert.
- Test 1 mit Fehlern oder Pflichtwarnungen: Auszeichnung korrigieren (eigener Auftrag).
- Ohne Search-Console-Property: Nachweis bleibt auf Test 1 und 4 beschränkt.

### Befund 13.11.2026 (Bewertung, nicht belegt)

- Die Auszeichnung ist in Ordnung. Dass die Stelle nicht im Jobkasten steht, liegt also nicht am Code. Mögliche Gründe sind die Indexierung (in Search Console prüfen) und das Alter der Anzeige (`datePosted` 2026-09-27, über sechs Wochen).
- Der schnellste bekannte Weg in den Google-Jobs-Kasten führt über die Jobbörse der Bundesagentur. Deren Anzeigen erscheinen dort sichtbar. Die BA-Anzeige ist kostenlos und steht in der Kanalrecherche ohnehin an erster Stelle.
- Die KI-Übersicht von Google gibt unsere Stelle bei einer Markensuche korrekt wieder. Für KI-Antworten ist die Seite also schon gut lesbar.
