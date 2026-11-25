# Stellenstandard v1 für die Praxis für Logopädie Şimşek

Stand: 25.11.2026
Status: redaktioneller Sollstandard; noch nicht produktiv implementiert

## Zweck und Geltungsbereich

Dieser Standard übersetzt die Kandidatenrecherche in ein prüfbares Stellenformat für die eigene Personalsuche der Praxis für Logopädie Şimşek. Er gilt zunächst nur für `logopädiejobs.de`. Er führt keine fremden Arbeitgeber, Bewerberkonten, Lebenslaufspeicherung, Talentpools oder neue Datenbank ein.

Evidenzkennzeichnung:

- `BELEGT`: durch die Kandidatenrecherche als Richtung gestützt;
- `VORLÄUFIG`: sinnvoller Pilotstandard, dessen Wirkung noch nicht direkt validiert ist;
- `TESTHYPOTHESE`: konkrete Lösung ist nicht belegt und muss gemessen werden;
- `FACHLICH_ERFORDERLICH`: für eine wahrheitsgemäße, handlungsfähige Stellenanzeige oder gültige strukturierte Daten notwendig, ohne als einzelnes Kandidatenbedürfnis belegt zu sein;
- `GOVERNANCE`: aus Produkt-, Datenschutz-, Aktualitäts- oder SEO-Grenzen erforderlich.

## A. Identität, Status und Aktualität

| Schlüssel | Typ | Pflichtgrad | Format | Öffentliche Darstellung | Evidenz | Regel |
| --- | --- | --- | --- | --- | --- | --- |
| `schema_version` | String | Pflicht | exakt `1.0` | nein | `GOVERNANCE` | Nur unterstützte Version zulassen. |
| `job_id` | String | Pflicht | stabiler, nicht personenbezogener Schlüssel | nein | `GOVERNANCE` | Eindeutig und nach Veröffentlichung nicht wiederverwenden. |
| `slug` | String | Pflicht | Kleinbuchstaben, Ziffern, Bindestriche | URL | `GOVERNANCE` | Eindeutig; Titeländerung ändert die URL nicht automatisch. |
| `canonical_url` | URL | Pflicht | eine HTTPS-Stellen-URL auf `logopädiejobs.de` | Canonical und `JobPosting.url` | `GOVERNANCE` | Keine zweite kanonische `JobPosting`-Quelle auf der Praxisdomain. |
| `employer` | Literal | Pflicht | exakt `Praxis für Logopädie Şimşek` | prominent | `GOVERNANCE` | Keine Kurz- oder ASCII-Variante. |
| `publication_status` | Enum | Pflicht | `DRAFT`, `ACTIVE`, `PAUSED`, `FILLED`, `EXPIRED` | verständlicher Status | `VORLÄUFIG` | Nur `ACTIVE` ist indexierbar und bewerbbar. |
| `published_at` | Datum | bei Veröffentlichung | ISO `YYYY-MM-DD` | „Veröffentlicht am …“ | `VORLÄUFIG` | Nicht in der Zukunft. |
| `last_reviewed_at` | Datum | bei `ACTIVE` | ISO `YYYY-MM-DD` | „Zuletzt geprüft am …“ | `VORLÄUFIG` | Nicht vor `published_at`; feste operative Prüffrist erforderlich. |
| `expires_at` | Datum | bei `ACTIVE` | ISO `YYYY-MM-DD` | Frist oder nächster Prüftermin | `VORLÄUFIG` | Danach Statuswechsel oder dokumentierte Neuprüfung; daraus `validThrough` ableiten. |
| `editorial_owner` | Literal | Pflicht | interne Funktionsrolle | optional | `GOVERNANCE` | Genau eine verantwortliche Rolle. |

## B. Wirtschaftliche und vertragliche Passung

| Schlüssel | Typ | Pflichtgrad | Format | Öffentliche Darstellung | Evidenz | Regel |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | String | Pflicht | konkrete Berufsbezeichnung | H1 und `JobPosting.title` | `VORLÄUFIG` | Mit Aufgaben und Qualifikation konsistent. |
| `location` | Objekt | Pflicht | Ort, PLZ, tatsächlicher Arbeitsort | im Stellenkopf | `FACHLICH_ERFORDERLICH` | Mindestens ein realer Arbeitsort. |
| `employment_types` | Enum-Liste | Pflicht | `FULL_TIME`, `PART_TIME`; weitere nur bei echtem Angebot | im Stellenkopf | `BELEGT` | Mit Stundenrahmen konsistent. |
| `contract_type` | Enum | Pflicht | `PERMANENT` oder `FIXED_TERM` | im Stellenkopf | `FACHLICH_ERFORDERLICH` | Bei Befristung ist Enddatum Pflicht. |
| `weekly_hours` | Objekt | Pflicht | Vollzeitwert sowie Teilzeit-Minimum/-Maximum oder ausdrücklich verhandelbar | als Zahl oder Spanne | `BELEGT` | Positive Werte; Minimum nicht größer als Maximum. |
| `schedule` | Objekt | Pflicht | Arbeitstage, Vier-Tage-Option, regelmäßige Zeitlagen | konkret statt nur „flexibel“ | `VORLÄUFIG` | Alle regelmäßig erwarteten Zeitlagen nennen. |
| `salary` | Objekt | Pflicht | Bruttospanne, `EUR`, Einheit `HOUR`; Monatswert nur abgeleitet und als gerundet markiert | früh und prominent | `BELEGT` | Eine Rechenquelle; Minimum nicht größer als Maximum. |
| `salary_context` | String | Pflicht | Kriterien für Einordnung innerhalb der Spanne | direkt an der Spanne | `BELEGT` | Keine versteckten Bedingungen. |
| `tariff_status` | Enum plus Text | Pflicht | `TARIFF`, `HOUSE_TARIFF`, `NO_TARIFF`; bei Tarif genaue Grundlage | neben Vergütung | `BELEGT` | Darf erst nach Bestätigung durch die Praxis veröffentlicht werden. |
| `additional_compensation` | Liste | optional | z. B. Weihnachtsgeld mit Bedingungen | neben Vergütung | `VORLÄUFIG` | Nur überprüfbare Leistungen. |

## C. Fachlicher Arbeitsalltag

| Schlüssel | Typ | Pflichtgrad | Format | Öffentliche Darstellung | Evidenz | Regel |
| --- | --- | --- | --- | --- | --- | --- |
| `role_summary` | kurzer Text | Pflicht | konkrete Rolle und Ziel | Einleitung | `VORLÄUFIG` | Mit Aufgaben konsistent. |
| `responsibilities` | Liste | Pflicht | regelmäßige Aufgaben | vollständig sichtbar | `VORLÄUFIG` | Keine wesentlichen Aufgaben erst im Gespräch offenlegen. |
| `treatment_units` | Liste | Pflicht | Minutenwerte und variable Regeln | eigener Vergleichspunkt | `VORLÄUFIG` | Nur tatsächlich eingesetzte Einheiten. |
| `treatment_load` | Objekt oder Beispielwoche | Pflicht | Termine pro Tag/Woche oder belastbarer Korridor samt Pufferregel | eigener Vergleichspunkt | `VORLÄUFIG` | Vor Veröffentlichung betrieblich bestätigen; keine vage Formulierung allein. |
| `documentation_time` | Objekt | Pflicht | `paid`, organisatorische Einplanung, Vor-/Nachbereitung und Berichte | eigener Vergleichspunkt | `VORLÄUFIG` | Bezahlt/unbezahlt muss eindeutig sein. |
| `overtime_policy` | Enum plus Text | Pflicht | `NOT_EXPECTED`, `EXCEPTIONAL`, `REGULAR`; Ausgleich und Zeitraum | eigener Vergleichspunkt | `VORLÄUFIG` | Ausgleichsregel bei Ausnahmen zwingend. |
| `home_visits` | Objekt | Pflicht | `REQUIRED`, `OPTIONAL`, `NONE`; gegebenenfalls Wegezeit und Kosten | sichtbar | `VORLÄUFIG` | Bedingungen vollständig nennen. |
| `team_support` | Liste | Pflicht | Ansprechperson, Austausch, Fallbesprechung | eigener Abschnitt | `VORLÄUFIG` | Nur regelmäßig verfügbare Unterstützung. |
| `onboarding` | Objekt | Pflicht | Bestandteile, Phasen, schrittweiser Terminaufbau | eigener Abschnitt | `VORLÄUFIG` | „Intensiv“ oder „nach Bedarf“ allein reicht nicht. |
| `continuing_education` | Objekt | Pflicht | Zeit, Kostenrahmen, Freistellung, Bedingungen | konkret | `VORLÄUFIG` | Geld- und Zeitanteil getrennt darstellen. |
| `career_stage_tags` | Enum-Liste | optional | `ENTRY`, `RETURN`, `EXPERIENCED` | Kennzeichnung | `VORLÄUFIG` | Nur setzen, wenn Anforderungen und Unterstützung passen. |
| `benefits` | Liste | optional | überprüfbare Zusatzleistungen | nach Kernkonditionen | `VORLÄUFIG` | Ersetzt keine Kernangaben. |

## D. Qualifikation und Passung

| Schlüssel | Typ | Pflichtgrad | Format | Öffentliche Darstellung | Evidenz | Regel |
| --- | --- | --- | --- | --- | --- | --- |
| `required_qualifications` | Liste | Pflicht | Abschluss beziehungsweise gleichgestellte Qualifikation | vor dem Erstkontakt | `FACHLICH_ERFORDERLICH` | Muss- und Kann-Kriterien trennen. |
| `recognition_requirement` | Enum plus Text | Pflicht | `REQUIRED`, `IN_PROGRESS_ACCEPTED`, `NOT_APPLICABLE` | klar sichtbar | `FACHLICH_ERFORDERLICH` | Mit den tatsächlichen Voraussetzungen konsistent. |
| `experience_requirement` | Enum plus Text | Pflicht | `NONE`, `PREFERRED`, `REQUIRED` | klar sichtbar | `VORLÄUFIG` | Keine Berufseinstiegskennzeichnung bei zwingender Erfahrung. |
| `language_requirements` | Liste | optional | nur rollenbezogene Sprache und Niveau | sichtbar | `FACHLICH_ERFORDERLICH` | Keine nicht erforderlichen Anforderungen. |
| `specializations` | Objekt | optional | `required` und `learnable` getrennt | sichtbar | `VORLÄUFIG` | Entwickelbare Schwerpunkte nicht als Muss darstellen. |

## E. Bewerbungsprozess

| Schlüssel | Typ | Pflichtgrad | Format | Öffentliche Darstellung | Evidenz | Regel |
| --- | --- | --- | --- | --- | --- | --- |
| `application_routes` | Enum-Liste | Pflicht | Teilmenge aus `SHORT_FORM`, `WHATSAPP`, `PHONE`, `CALLBACK`, `EMAIL`, `POST` | gemeinsame Auswahl | `TESTHYPOTHESE` | Kein Weg als generell bevorzugt behaupten; nur aktive Wege zeigen. |
| `first_step_policy` | Objekt | Pflicht | kein Konto, kein Pflichtanschreiben, Lebenslauf beim Erstkontakt freiwillig | ausdrücklich | `TESTHYPOTHESE` | Keine versteckte Uploadpflicht. |
| `process_steps` | geordnete Liste | Pflicht | Erstkontakt, Rückmeldung, Gespräch, optionale Hospitation, spätere Nachweise | vollständig sichtbar | `VORLÄUFIG` | Tatsächlichen Ablauf abbilden. |
| `acknowledgement` | Objekt | Pflicht | technische Bestätigung oder manueller Ablauf | beim digitalen Weg | `VORLÄUFIG` | Nur garantieren, was technisch und operativ funktioniert. |
| `response_window` | Objekt | Pflicht | realistische Werktage oder Geschäftszeiten | „Wir antworten …“ | `VORLÄUFIG` | Muss mit interner Fristlogik übereinstimmen; keine unrealistische Garantie. |
| `privacy_notice_url` | URL | bei digitalen Wegen | einschlägige Datenschutzerklärung | unmittelbar am Weg | `GOVERNANCE` | HTTPS und zweckbezogene Information. |

Das sichtbare Stellenprofil, FAQ und `JobPosting`-JSON-LD werden künftig aus derselben validierten Quelle erzeugt. Das Markup ist keine separat gepflegte Stellenkopie.

## Veröffentlichungsregeln je Status

| Statuswert | Robots | Sitemap | Stellenmarkup | Bewerbungsaktion | Sichtbare Aussage |
| --- | --- | --- | --- | --- | --- |
| `DRAFT` | `noindex, follow` | ausgeschlossen | nein | nein | keine aktive Stelle; Vorschau nur im kontrollierten Entwicklungsablauf |
| `ACTIVE` | `index, follow` | enthalten | ja | ja | aktiver und zuletzt geprüfter Stand |
| `PAUSED` | `noindex, follow` | ausgeschlossen | nein | nein | Bewerbung derzeit pausiert |
| `FILLED` | `noindex, follow` | ausgeschlossen | nein | nein | Stelle besetzt |
| `EXPIRED` | `noindex, follow` | ausgeschlossen | nein | nein | Anzeige abgelaufen |

Robots, Sitemap, `JobPosting` und Bewerbungsaktion müssen dieselbe Statusentscheidung verwenden. Ein reines Entfernen des Markups reicht bei nicht aktiven Stellen nicht aus.

## Messrahmen für die Bewerbungswege

Vor Tracking-Änderungen ist ein separat freizugebender, datenschutzgeprüfter Eventvertrag erforderlich. Erlaubt sind ausschließlich nicht personenbezogene Angaben wie `job_id`, Weg, anonymes Ereignis, aggregierter Zeitraum, Consent-Zustand und technische Fehlerklasse. Verboten sind Rückrufwerte, Nachrichtentexte, E-Mail-Adressen, URL-Parameter mit Personenbezug, Dokumente und Fingerprints.

Weg A ist WhatsApp, Weg B der Rückruf, Weg C das Telefon und Weg D das Kurzformular.

| Messgröße | Weg A | Weg B | Weg C | Weg D |
| --- | --- | --- | --- | --- |
| Auswahl | Linkauswahl | Routenauswahl | Linkauswahl | Routenauswahl |
| Webabschluss | nicht zuverlässig messbar | serverseitig angenommene Anfrage | nicht zuverlässig messbar | serverseitig angenommene Anfrage |
| Abbruch | nach App-Wechsel nicht messbar | Start ohne Annahme | nach Klick nicht messbar | Start ohne Annahme |
| Dauer | nicht verfügbar | aggregiert von Start bis Annahme | nicht verfügbar | aggregiert von Start bis Annahme |
| Qualität | manuell aggregierter qualifizierter Eingang mit Attributionsgrenze | manuell aggregierter qualifizierter Eingang | manuell aggregierter qualifizierter Eingang mit Attributionsgrenze | manuell aggregierter qualifizierter Eingang |

Die 60-Sekunden-Grenze ist eine Messhypothese, kein öffentliches Leistungsversprechen. Kanalentscheidungen werden nach qualifizierten Eingängen, technischer Zuverlässigkeit und Einhaltung des Antwortfensters getroffen, nicht nach Klicks allein.

## Nicht-Ziele

- keine offene Jobbörse und keine Stellen fremder Arbeitgeber;
- kein Bewerberkonto, Login, Profil, Talentpool oder dauerhaftes Matching;
- keine Lebenslauf- oder Dokumentenspeicherung und kein Pflichtupload;
- keine zentrale Kandidatendatenbank;
- keine Behauptung einer allgemeinen WhatsApp-Präferenz;
- kein garantiertes „unter 60 Sekunden“;
- keine personenbezogenen Inhalte in Analytics oder Reports;
- keine zweite `JobPosting`-Quelle auf `logopaedie-simsek.de`.

## Findings

### SS-01 — Vergleichbare Kernkonditionen

- **Status:** `SUPPORTED`
- **Priorität:** `P1`
- **Problem:** Vergütung, Vertragsrahmen und Stundenmodell sind zentrale Auswahlkriterien.
- **Auswirkung:** Fehlende oder rechnerisch abweichende Angaben schwächen Vertrauen und Passung.
- **Nächster Schritt:** Vergütungsmodell, Tarifstatus, Wochenstunden und Vertragsart als Veröffentlichungspflicht umsetzen.
- **Begründung:** Kandidaten-Evidenzmatrix und Ist-Audit stützen die Richtung; eine zentrale Quelle verhindert Drift.

### SS-02 — Fachlicher Arbeitsalltag

- **Status:** `PARTIALLY_SUPPORTED`
- **Priorität:** `P1`
- **Problem:** Taktung, Fallbelastung, Fortbildungsrahmen und Ausgleichsregeln sind noch nicht vollständig konkret.
- **Auswirkung:** Der reale Alltag bleibt trotz guter Grundinformationen nur teilweise vergleichbar.
- **Nächster Schritt:** Fehlende Betriebswerte bestätigen und als strukturierte Felder pflegen.
- **Begründung:** Berufsnahe Evidenz stützt die Felder, nicht ihre relative Gewichtung.

### SS-03 — Einfacher Erstkontakt

- **Status:** `CONFLICTING`
- **Priorität:** `P1`
- **Problem:** Friktion ist belegt, ein bevorzugter Einzelweg oder eine feste Dauer nicht.
- **Auswirkung:** Eine vorschnelle Kanalpriorisierung kann geeignete Personen ausschließen.
- **Nächster Schritt:** Gleichwertige Wege anbieten und später datensparsam nach qualifizierten Eingängen vergleichen.
- **Begründung:** Die Recherche stützt Einfachheit, nicht WhatsApp-Vorrang oder exakt 60 Sekunden.

### SS-04 — Sensible Kandidatenfunktionen

- **Status:** `INSUFFICIENT_EVIDENCE`
- **Priorität:** `P1`
- **Problem:** Bedarf und Datenschutzakzeptanz für dauerhafte Kandidatendaten sind nicht belegt.
- **Auswirkung:** Konto, Dokumentenspeicher oder Talentpool erzeugen unnötiges Risiko.
- **Nächster Schritt:** Gate E geschlossen lassen.
- **Begründung:** Fehlende Datenschutznennungen in öffentlichen Beiträgen sind kein Freigabebeleg.
