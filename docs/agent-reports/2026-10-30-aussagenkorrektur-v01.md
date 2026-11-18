# Aussagenkorrektur v01 — integrierter lokaler Prüfstand

Stand: 30.10.2026. Owner: Hauptagent, mit spezialisierten Implementierungs- und unabhängigen Reviewagenten. **Teilweise erledigt: 29 von 33 Befunden textlich korrigiert; B27–B30 teilweise korrigiert und wegen fehlender Betriebs-/Rechtsnachweise offen.** Keine Veröffentlichung, kein Commit, kein Push. Dies ist keine fachliche oder rechtliche Abnahme.

## Ziel, Grenzen und Ausgangsstand

B01–B33 nachvollziehbar im bestehenden Website-Projekt korrigieren, Originalquellen angeben und offene Arbeitgeber-/Betriebsnachweise getrennt dokumentieren. Keine neuen Arbeitgeberleistungen, Anbieterrollen, Speicherfristen, individuellen Berufsberechtigungen oder Rechtsgrundlagen erfinden. Quellbasis zu Beginn: `a8eeda847022f6cf009d9cbc3ed762d433efd00a`, damals sauberer Arbeitsbaum. Historische Inhalte bleiben in Git erhalten; Änderungen sind lokal und ungestaged.

Ausgangsaudit: `/Users/sinanucar/.codex/visualizations/2026/10/30/01a18c66-946d-7142-af5c-6bd3a4e15659/website-aussagenpruefung-v01.md`. Dessen ursprüngliche Seitenabdeckung umfasst die ganze damals geprüfte Website; diese Korrekturprüfung umfasst die betroffenen Inhalte und gemeinsame Ausgaben, keine erneute vollständige Produktionsabnahme.

## Delegation und Integration

- `fix_gehalt`: Gehaltsdaten, Rechner, Gehaltsartikel, sechs gezielte Regressionstests.
- `fix_fachtexte`: zehn Fach-/Berufsartikel einschließlich Definitionen, Beschreibungen und FAQ.
- `fix_recht_arbeitszeit`: Arbeitszeitartikel, Datenschutz, Impressum und gesonderte fehlende Nachweise.
- Hauptagent: gemeinsame Artikel-/Indexmetadaten, Quellenanspruch, llms.txt, Arbeitgeberliste, Integration und Prüfung.
- `review_korrekturen` und `abschluss_abgleich`: unabhängige read-only Reviews. Gefundene Restformulierungen in llms.txt, übermäßig sicherer Nutzen der Familiensprache und unbelegte Dreifachspezialisierung wurden anschließend korrigiert. Dateihoheit der Implementierungspakete war getrennt.

## Abgleich aller 33 Befunde

`R/` steht für `src/content/ratgeber/`. „Korrigiert“ bezeichnet den lokalen Text-/Codestand, keinen Betriebsnachweis. Die Ausgangsbefunde sind durch das Audit gestützt (`SUPPORTED`); die unten offene Nachweise bleiben `INSUFFICIENT_EVIDENCE`.

| ID | Priorität | Lokaler Stand | Datei/Bereich und überprüfbare Änderung |
|---|---|---|---|
| B01 | P1 | Korrigiert | R/ausbildung-nrw-2026.md: NRW-Schulgeldförderung statt pauschalem Schulgeld; Zusatzkosten getrennt, MAGS-Originalquelle. |
| B02 | P1 | Korrigiert | Ausbildungsartikel: gesetzlicher Mindestzugang nach §4 LogopG, schulisches Auswahlverfahren getrennt. |
| B03 | P1 | Korrigiert | Ausbildungs-/Bewerbungsartikel: Erlaubnis zur Berufsbezeichnung, fachliche Beschäftigungsvoraussetzungen und eigene GKV-Praxiszulassung getrennt; LogopG/GKV-Vertrag/§124 SGB V. |
| B04 | P1 | Korrigiert | R/bilinguale-sprachtherapie.md: unzutreffend zugeordnetes ScreeLing aus Kinderinstrumenten/FAQ entfernt. |
| B05 | P1 | Korrigiert | Bilingualitätsartikel: nicht verifizierte türkische Testprodukte entfernt; Eignung und Manualprüfung statt Validierungszusage. |
| B06 | P1 | Korrigiert | Bilingualitätsartikel: Deutschtest allein bestätigt/widerlegt Sprachentwicklungsstörung nicht; Sprachbiografie und differenzierte Befundung. |
| B07 | P1 | Korrigiert | Gehaltsartikel/Rechnerseite: vergleichbare BA-Mediane Datenjahr2025 NRW3571/Bund3576; kein allgemeiner NRW-Vorsprung. |
| B08 | P1 | Korrigiert | src/pages/gehaltsrechner.astro: Berufsaggregat81733 statt81724; direkte BA-Berufsansicht8763. |
| B09 | P1 | Korrigiert | src/lib/gehalt-daten.ts und Rechnerkomponente: unbelegte Prognosefaktoren und ±8%-Spanne entfernt. Explizite Vertragsumrechnung mit Eingabeprüfung. |
| B10 | P1 | Korrigiert | Rechner: keine TVöD-Simulation mittels Faktor; deutlich keine Tarifberechnung. |
| B11 | P2 | Korrigiert | Gehaltsartikel/Rechnerseite: Median, Kerngruppe, Datenjahr, fehlende individuelle Wochenstunden und einbezogene Sonderentgelte erklärt. |
| B12 | P2 | Korrigiert | Gehalts-/Duisburg-/Bilingualitäts-/Stotterartikel: unbelegte lokale Rankings, fixe Zuschläge und Gehaltsbänder entfernt. |
| B13 | P2 | Korrigiert | Gehaltsartikel/Rechnerseite: Zahlen mit direkter BA-Ansicht, Methodik und Quellenstand verbunden. |
| B14 | P2 | Korrigiert | Rechner: tatsächlicher zusätzlicher Arbeitgeberbeitrag separat; keine pauschale Bruttoäquivalenz, Sonderzahlung nur einmal addiert. |
| B15 | P2 | Korrigiert | R/teilzeit-modelle.md: unbelegte Mehrheits-/Umfragebehauptung entfernt, Wochenaufteilungen als Beispiele. |
| B16 | P2 | Korrigiert | Ausbildungsartikel: konkreter Bachelor Hochschule Bochum mit sieben Semestern; ungeprüfte Angebote entfernt. |
| B17 | P2 | Korrigiert | Ausbildungs-/Duisburg-Stellenartikel: kein pauschaler anerkannter Master-Quereinstieg; konkreten Zugang und Berufswirkung prüfen. |
| B18 | P1 | Korrigiert | Stotterartikel: KIDS als Stottermodifikation, untersuchte Altersgruppe; RESTART/Lidcombe getrennt. |
| B19 | P2 | Korrigiert | Stotterartikel: nicht belegte Lehrgangsbezeichnung, Anerkennung, Dauer und Preise entfernt. |
| B20 | P1 | Korrigiert | Teilzeitartikel: SP1/SP3 jeweils1–3-mal wöchentlich laut G-BA; individuelle Verordnung/Planung statt Ableitung aus Vertragsstunden. |
| B21 | P2 | Korrigiert | Beide Mehrsprachigkeitsartikel: keine sichere Überlegenheit, Arbeitsmarktprämie oder Erfolgsgarantie; verbleibendes „enorm“ entfernt und llms-Beschreibung angepasst. |
| B22 | P2 | Korrigiert | Duisburgartikel: unbelegte Bevölkerungs-/Nachfrage-/Kosten-/Pendelgarantien entfernt; Mietspiegelbezug abgegrenzt. |
| B23 | P3 | Korrigiert | Bewerbungsartikel: Empfehlungen von Praxisanforderungen getrennt; Gehaltsinitiative und sachliche Nachfragen nicht pauschal ausschließen. |
| B24 | P2 | Korrigiert | Vier-Tage-/Teilzeitartikel: Nettoarbeitszeit, Durchschnittsausgleich, Pausen und grundsätzlich elf Stunden Ruhezeit samt ArbZG-Quellen. |
| B25 | P2 | Korrigiert | Vier-Tage-Artikel: unbelegte Gesundheits-/Leistungs-/Therapiequalitätswirkungen entfernt; Stundenumfang und Entgelt getrennt. |
| B26 | P2 | Korrigiert | Teilzeitartikel: Drucksatz entfernt, individuelle Vereinbarung und §11 TzBfG differenziert. |
| B27 | P1 | Teilweise/offen | Datenschutz: personenbezogene Herkunftszuordnung und sessionStorage erklärt. Rechtsgrundlage, Freiwilligkeit, Endgerätezugriff und Frist nicht belegt. |
| B28 | P1 | Teilweise/offen | Datenschutz: Serverfunktion und Grenzen der 24h-Sitzung beschrieben. Konkrete Hosting-/Analyticsrollen, Verträge, Fristen und Drittlandgarantien fehlen. |
| B29 | P2 | Teilweise/offen | Datenschutz: absoluter Gesundheitsdatenausschluss entfernt; unaufgeforderte Eingänge möglich. Umgang, Zugriff und Löschprozess nicht bestätigt. |
| B30 | P2 | Teilweise/offen | Impressum: DDG/MStV aktualisiert, Betreiberin benannt. Aufsicht, Berufsbezeichnung, Verleihungsstaat und Berufsregeln nicht individuell bestätigt. |
| B31 | P2 | Korrigiert | Berufshandbuchindex und Artikelrahmen: Herausgeberin/Redaktion transparent, Quellen beim Beitrag; keine behauptete gesonderte Fachabnahme. |
| B32 | P2 | Korrigiert | Alle13 Artikel: Definition/FAQ/Beschreibung mitgeändert, updatedDate2026-10-30; Organization-Autor und konsistenter Stand; llms-Titel/-Beschreibung abgeglichen. |
| B33 | P3 | Korrigiert | public/llms.txt: kanonische Stellenseite mit tatsächlichem Canonical/JobPosting abgeglichen, /jobs/ als Weiterleitung beschrieben. |

## Maßgebliche Originalquellen

Die konkreten Links stehen aussagennah im jeweiligen Artikel. Behördenquellen belegen allgemeine Aussagen, keine tatsächliche Einhaltung von Arbeitgeberzusagen.

- [MAGS NRW: Schulgeldfreiheit fortgeführt](https://www.mags.nrw/land-fuehrt-schulgeldfreiheit-den-gesundheitsfachberufen-fort): Landesmitteilung vom31.07.2026, Fortsetzung2027–2031. Im Browser direkt geprüft; fehlende Web-Cache-Ausgabe nicht als fehlende Quelle gewertet.
- [§4 LogopG](https://www.gesetze-im-internet.de/logopg/__4.html), [§1 LogopG](https://www.gesetze-im-internet.de/logopg/__1.html), [§1 LogAPrO](https://www.gesetze-im-internet.de/logapro/__1.html), [§124 SGB V](https://www.gesetze-im-internet.de/sgb_5/__124.html), [GKV-Vertrag Sprachtherapie](https://www.gkv-spitzenverband.de/krankenversicherung/ambulante_leistungen/heilmittel/125_ssss/125_sssst.jsp).
- [Hochschule Bochum: Logopädie](https://gesundheitscampus.hochschule-bochum.de/studium/unser-studienangebot/logopaedie/uebersicht-logopaedie): konkrete Studiendauer/Berufswirkung.
- [BA-Entgeltatlas](https://web.arbeitsagentur.de/entgeltatlas/beruf/8763) und [BA-Methodik](https://www.arbeitsagentur.de/hilfe-entgeltatlas): Datenjahr2025, NRW/Bund und Grenzen; BA-Werte direkt im Browser geprüft.
- [Universität Konstanz: Mehrsprachigkeit und Sprachentwicklungsstörungen](https://www.mehrsprachigkeit.uni-konstanz.de/ressourcen/mehrsprachigkeit-und-sprachentwicklungsstoerungen/): fachliche Einordnung, keine Erfolgsgarantie.
- [G-BA PMS KIDS](https://innovationsfonds.g-ba.de/projekte/pms-kids.162) und [RESTART-Originalstudie](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0133758): Methoden/Populationen unterscheiden. Letzteres ist begutachtete Originalforschung, keine Behördenentscheidung.
- [G-BA Heilmittelkatalog](https://www.g-ba.de/downloads/17-98-3064/HeilM-RL_2024-05-16_Heilmittelkatalog.pdf): SP1/SP3 und individuelle Auswahl; keine starre Frequenz aus Beschäftigtenstunden.
- [ArbZG§3](https://www.gesetze-im-internet.de/arbzg/__3.html), [§4](https://www.gesetze-im-internet.de/arbzg/__4.html), [§5](https://www.gesetze-im-internet.de/arbzg/__5.html), [TzBfG§11](https://www.gesetze-im-internet.de/tzbfg/__11.html), [DDG§5](https://www.gesetze-im-internet.de/ddg/__5.html), [DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de), [BDSG§26](https://www.gesetze-im-internet.de/bdsg_2018/__26.html).

## Offene Nachweise und konkreter Fahrplan

1. **B27–B30:** Betreiberin/technisch Zuständige liefern ausschließlich Prozess-/Vertrags- und Berufsangaben, keine Bewerbungsakten oder Zugangsdaten. Präzise fehlende Einzelangaben und Owner stehen in [Rechts-/Betriebsnachweise](2026-10-30-recht-offene-betriebsnachweise-v01.md). Danach Rechtstexte an bestätigter Realität abschließen und prüfen. Rechtliche Einordnung braucht zuständige Fachberatung. Keine fehlenden Grundlagen vermuten. Eine Änderung von Tracking/Consent wird nicht still als Textkorrektur umgesetzt.
2. **Arbeitgeberangebote:** Bestehende freigegebene Angebote bleiben im genehmigten Umfang erhalten; individuelle Bedingungen und tatsächliche Umsetzung sind in [Arbeitgeberzusagen](2026-10-30-offene-arbeitgeberzusagen-v01.md) separat offen. Die ergänzende Prüfung von DEC-045/DEC-110/SRC-425 bestätigt Sechsmonatsregel und alleinigen regulären WhatsApp-Zugriff als Betriebsentscheidungen. Ihre Umsetzung bleibt unbewiesen; historische Postfach-/Vercel-Vertragsbefunde SRC-434 und die zurückgestellte Remediation DEC-118 sind im Rechtsnachweisbericht präzisiert. Kein neuer Kontocheck.
3. **Freigabe:** Datenschutz/Impressum sind nicht veröffentlichungsreif. Kommentare und Berichte sind eine dokumentierte Sperre, kein technischer Deploymentblock. Empfohlen: lokal halten, Nachweise ergänzen, dann konkrete fachliche/rechtliche Abnahme und separate Veröffentlichungsentscheidung. Es besteht weiterhin keinerlei Deploy-/Commit-/Pushfreigabe.

## Verifikation und Grenzen

Runtime: vorhandenes Node22.23.3 unter `/Users/sinanucar/.nvm/versions/node/v22.23.3/bin`. Das systemweite Node18.12.1 scheitert an bereits bestehender RegExp-v-Syntax; nicht als Produktregression gewertet und keine globale Runtime geändert.

- `env PATH=/Users/sinanucar/.nvm/versions/node/v22.23.3/bin:/usr/local/bin:/usr/bin:/bin ./scripts/verify.sh`: Build und Whitespaceprüfung bestanden. Typecheck wird vom vorhandenen Skript übersprungen, da kein check-Skript/@astrojs/check vorhanden ist. Keine Installation nachgeholt.
- `/Users/sinanucar/.nvm/versions/node/v22.23.3/bin/node --test --test-reporter=dot tests/*.test.mjs`:150 Tests bestanden, einschließlich sechs Rechnerprüfungen. Kein Zugriff auf produktive Bewerbungen.
- Rechner im lokalen Browser:23€/38,5h ergibt3837,17€/Monat;23€/30h ergibt2990€/Monat und35880€/Jahr;1200€ Sonderzahlung ergibt37080€,600€ Arbeitgeberbeitrag bleibt separat. Nullstunden leert Ausgabe mit Fehler. Desktop1280 und Mobil375px ohne Seitenüberlauf.
- Ausbildungstabelle ursprünglich594px Dokumentbreite bei375px: korrigiert durch beschrifteten fokussierbaren Scrollbereich mit nativer Tabelle. Nach Build Dokument375px, Bereich327px, Tabelleninhalt643px; Pfeiltaste verschiebt40px innerhalb des Bereichs. Teilzeittabelle ebenfalls375px Dokumentbreite, Bereich327px/544px Inhalt. Desktop-Ausbildung1280px ohne Seitenüberlauf. Mobile Screenshotdarstellung geprüft; temporäre Viewportvorgabe zurückgesetzt.
- Gebautes HTML:13 Article-JSON-LD mit Organization-Autor, dateModified und passendem Canonical;19 Sitemapziele vorhanden, Datenschutz/Impressum noindex und nicht in Sitemap; FAQ-Antworten vorhanden. Unbelegte alte Rechnerkennzahlen entfernt. llms-Ausgabe nach letzter Korrektur erneut auf Gleichheit mit der Quelle geprüft:PASS. Die33-Zeilen-Matrix enthält exakt33 IDs und vier offen markierte Einträge.
- Keine fachliche oder rechtliche Abnahme, kein Nachweis tatsächlicher Betriebsprozesse, kein produktiver Formularversand, keine echten Geräte-/Postfachprüfungen. Neue Texte sind nicht öffentlich erreichbar; deren Suchtreffer/Indexierung können vor Veröffentlichung nicht nachgewiesen werden. Keine Ranking-/KI-Nennungsgarantie.

## Ressourcen und Kontinuität

Keine eigenständige Sourcekopie, kein Worktree, keine Installation, keine Browserdownloads. Bestehende Projektbestände dist/.vercel/output jeweils etwa13MiB, .astro200KiB; freier Platz zuletzt rund15GiB. Deshalb keine großen Läufe. Kleine In-place-Builds nutzen26 bestehende Bildcacheeinträge; benötigte Laufzeit ist vorhanden. Keine Löschung veranlasst. Keine neuen großen temporären Bestände zur Bereinigung angelegt; bestehende Buildausgaben bleiben zur Prüfung erhalten.

Lokaler Prüfserver: `python3 -m http.server 4407 --bind 127.0.0.1 --directory /Users/sinanucar/Development/logopaedie-jobs/dist/client`, eigene Sitzung69435; ausschließlich Loopback, keine API. Prüfung beendet; eigene Sitzung69435 mit Strg-C kontrolliert beendet (exit0). Der lokale HTTP-Server lieferte Vercels Analytics-Skript erwartungsgemäß nicht aus (404); daraus folgt kein Nachweis produktiver Analyticsfunktion. Wiederherstellung der Quellen über Git-Ausgangsstand plus aktuellen lokalen Diff; kein Commit zur Sicherung behauptet. Nächster notwendiger Schritt: bestätigte Nachweise für B27–B30 erhalten und umsetzen.

## Git und Skills

Nichts gestaged, committed, gepusht oder veröffentlicht. Es wurde nichts gepusht. Keine fremden Änderungen zurückgesetzt. Lokale Dateiänderungen bleiben reviewbar; Git-Freigabe bleibt separat.

Verwendete Skills: zielgerichtet-arbeiten — Ziel/Abschlusskriterien/Kontinuität; dispatching-parallel-agents — begrenzte Dateipakete; copy-editing — Aussagen, Metadaten und FAQ konsistent überarbeiten; test-driven-development — Rechnerregressionen durch Implementierungsagent; verification-before-completion — aktuelle Build-, Test- und Browsernachweise. playwright wurde gelesen, jedoch nicht eingesetzt; Browserprüfung erfolgte über vorhandene CUA-Schnittstelle.


## Ergänzung: STRATO-Machbarkeit ohne zusätzliche laufende Kosten — 30.10.2026

**Prüfauftrag:** Sinan bestätigt weiterhin STRATO Hosting Basic mit Webspace und beauftragt ausschließlich die Prüfung von Website und Bewerbungsformular. Keine Umstellung, Veröffentlichung, Konfiguration, Tarifänderung, Installation oder Mailversand. Ergebnis: **technisch grundsätzlich machbar nach lokaler Portierung; Zusatzkostenfreiheit für den konkreten Altvertrag noch nicht abschließend belegt.** Ein Node-Server/VPS oder ein externer kostenpflichtiger Formulardienst ist für den erkannten Funktionsumfang nicht technisch notwendig. Das ist eine Architekturfolgerung aus Code und Anbieterfähigkeiten, kein getesteter STRATO-Betrieb.

### Befund und notwendige Anpassungen

| Bereich | Evidenzstatus / Priorität | Ergebnis und notwendiger Schritt |
|---|---|---|
| Statische Website | SUPPORTED / P2 | Seiten,13 Ratgeber, CSS, lokale Schriften, Bild-/Videodateien und Browser-Gehaltsrechner sind nach passendem statischem Export auf Webspace übertragbar. Vorhandenes dist/client etwa13MiB; kein Beleg über freien Platz im Kundenpaket. Astro wird lokal gebaut, nicht auf STRATO dauerhaft ausgeführt. |
| Node-Backend | SUPPORTED / P1 | STRATO klassisches Webhosting unterstützt laut eigener Node.js-Seite keinen Node-Betrieb. Aktuell sind src/pages/bewerbung/senden/index.ts und src/pages/jobs/index.astro nicht vorgerendert. Unveränderter Vercel-Upload wäre daher unvollständig. |
| Formular | SUPPORTED / P1 | PHP-Ersatz für /bewerbung/senden/ erforderlich, beide Formularoberflächen anbinden. Keine Datenbank/Fileuploads nötig. Erhalten: serverseitige Validierung,8KiB-Requestgrenze, unbekannte/doppelte Felder ablehnen, Honeypot, Origin-Regel,1500-Zeichen-Nachricht, JSON-Fehler und No-JS-303-Weiterleitungen. Mailfehler dürfen keinen falschen Erfolg melden. Missbrauchsschutz/Ratelimit für den Zielbetrieb zusätzlich konkret prüfen. |
| Mailversand | PARTIALLY_SUPPORTED / P1 | STRATO dokumentiert Versand aus PHP über authentifiziertes smtp.strato.de. Nodemailer in src/lib/application-mail.mjs muss durch gleichwertigen geschützten PHP-SMTP-Versand ersetzt werden; vorhandenes Postfach und feste Absender-/Empfängerregeln nutzen, kein zusätzlicher Maildienst erforderlich. Tatsächliche SMTP-Berechtigung, Limits und Zustellung nicht getestet. Keine Zugangsdaten gelesen. |
| Weiterleitungen/SEO | SUPPORTED / P2 | vercel.json und dynamischen /jobs/-Redirect in Webserverregeln mit Query-Erhalt übertragen; Canonicals, Slashregeln, alte URLs,404, Sitemap und Noindex erhalten. STRATO dokumentiert mod_rewrite für aktuelle Hostingpakete. |
| Analytics | SUPPORTED / P2 | src/layouts/Layout.astro lädt /_vercel/insights/script.js; funktioniert auf STRATO nicht automatisch. Entfernung oder Ersatz separat entscheiden. Kein zusätzlicher Trackingdienst ist nötig, damit Website und Formular funktionieren. Herkunftserfassung bleibt gesondert offen. |
| Rechtstexte | INSUFFICIENT_EVIDENCE / P1 | Hosting-/Log-/Transferangaben nach tatsächlichem Zielbetrieb abschließen. Bereits dokumentierter STRATO-AVV ersetzt weder Zweck-/Rechtsgrundlagenprüfung noch technische Lösch-/Zugriffsnachweise. B27–B30 bleiben offen. |
| Konkrete Zusatzkosten | INSUFFICIENT_EVIDENCE / P1 | Sinan bestätigt vorhandenes Hosting Basic mit Webspace. Altvertrag, Domainzuordnung und verfügbares SSL-Kontingent sind nicht authentifiziert eingesehen. Aktuelles öffentliches Basic-Angebot ist kein Vertragsnachweis für das bestehende Paket. |

### Kostenbewertung

**Ohne neue laufende Kosten möglich, wenn** genügend vorhandener Webspace, geeignete aktivierte PHP-Version, vorhandenes SMTP-Postfach und passende Domain-/SSL-Zuordnung im bestehenden Vertrag verfügbar sind. Die bestehende Paketgebühr und Domainverlängerungen laufen weiter; „ohne zusätzliche Kosten“ bedeutet nicht kostenloses Hosting insgesamt. Keine gekaufte PHP-Bibliothek, Datenbank oder Pro-Tarif ist technisch zwingend. Entwicklungs-/Wartungsaufwand bleibt; keine Lizenz-/API-Abos oder kostenpflichtige Upgrades wurden beschlossen.

Mögliche Zusatzkosten sind insbesondere ein fehlendes passendes SSL-Zertifikat, Domain-/Vertragswechsel oder kostenpflichtiger Support für veraltetes PHP. Diese dürfen nicht als null vorausgesetzt werden. Keine Bestellung/Beauftragung. Öffentliche STRATO-Angebote nennen inkludierte SSL-Zertifikate; Anzahl, Zuordnung und freie Verfügbarkeit im konkreten Altvertrag sind noch offen. Domains bei anderem Registrar wären zusätzlich auf Aufschaltbarkeit zu prüfen, ohne einen kostenfreien Transfer zu unterstellen.

### Offizielle Quellen, geprüft30.10.2026

- [STRATO: Node.js auf klassischem Webhosting nicht möglich](https://www.strato.de/server/node-js-hosting/).
- [Astro: Deployment und statische Ausgabe](https://docs.astro.build/en/guides/deploy/).
- [STRATO: Versand aus PHP/CGI über eigenen SMTP mit Authentifizierung](https://www.strato.de/faq/mail/e-mail-versand-aus-cgi-und-php-skripten/).
- [STRATO: Serveradressen und verschlüsselte SMTP-Ports](https://www.strato.de/faq/mail/e-mailserver-adressen-ports-ssl-tls/).
- [STRATO: mod_rewrite](https://www.strato.de/faq/hosting/kann-ich-in-meinem-paket-die-rewrite-engine-modrewrite-fuer-meine-php-skripte-verwenden/).
- [STRATO: kostenloses SSL-Zertifikat](https://www.strato.de/faq/domains/wie-kann-ich-mein-kostenfreies-strato-ssl-zertifikat-verwenden/); tatsächliches Vertragskontingent und Domainabdeckung nicht daraus abgeleitet.
- [STRATO: aktuelles Webhostingangebot](https://www.strato.de/hosting/): PHP/Webspace/SSL-Leistungsübersicht, kein Beleg für den Altvertrag.
- [STRATO: kostenloser AVV](https://www.strato.de/faq/vertrag/fragen-zur-auftragsverarbeitungsvertrag-avv-und-der-neuen-eu-datenschutzgrundverordnung-dsgvo/); Abschluss laut vorhandener Projektquelle SRC-347/SRC-348 historisch dokumentiert, kein neuer Vertragsabschluss.

### Prüfgrenzen und nächster Schritt

Subagent strato_code_machbarkeit hat den Quellbaum unabhängig read-only abgeglichen; Hauptagent hat Route, SMTP-Konfiguration, Adapter, Redirects, Analytics-Einbindung und Anbieterquellen geprüft. Keine Tests/Builds erneut gestartet: dieser Auftrag verändert keinen Runtimecode und erstellt noch keinen STRATO-Export. Vorhandene150 Tests belegen den früheren Node-Stand, keine PHP-Portierung oder STRATO-Zustellung.

STRATO-Kundenbereich wurde geöffnet und zeigt ausschließlich die Anmeldeseite. Deshalb keine aktuelle Kontoprüfung behauptet. Konkrete nächste Prüfung nach Nutzeranmeldung: Paketleistung und freier Platz, Domainzugehörigkeit für logopädiejobs.de inklusive benötigter www-Abdeckung, SSL-Zuordnung/-Kontingent, aktuelle PHP-Version und SMTP-Verfügbarkeit ohne echte Bewerbungsdaten. Nur lesen, nichts bestellen/zuweisen/ändern. Danach kann die Zusatzkostenfrage endgültig eingegrenzt werden. Anschließende Portierung wäre ein eigener lokaler Implementierungsschritt; Upload, Tests mit Mailversand, Domain/DNS-Umschaltung und Veröffentlichung bleiben gesondert freigabepflichtig.

Zusätzliche Nutzerangaben aus dem Gespräch: Vercel bleibt derzeit Hobby; gewünscht sind nur Gesamtsummen nach Bewerbungskanal, Aufbewahrung allenfalls soweit rechtlich zulässig. Keine konkrete Frist, Einwilligungslösung oder neue Trackingfreigabe beschlossen. Diese Angaben schließen B27/B28 nicht automatisch.

Verwendete Skills für diese Teilprüfung: zielgerichtet-arbeiten — prüfbare Machbarkeitsaussage und Grenzen; dispatching-parallel-agents — unabhängige Quellprüfung neben Anbieterrecherche. Keine Änderung an Website, Formular oder Hosting. Es wurde nichts gepusht.


### Authentifizierte STRATO-Stichprobe nach Nutzeranmeldung — 30.10.2026

Nutzer meldet Anmeldung im internen Browser. Im Kundenbereich wurde ausschließlich lesend bestätigt: **STRATO Hosting Basic,100GB Webspace,0B als verwendet angezeigt**,25 Datenbanken (keine verwendet), zehn SFTP-Zugänge (keine verwendet),500 Subdomains (keine verwendet), drei von drei Inklusivdomains belegt. Keine Notwendigkeit für Datenbank/SFTP-Neubestellung aus diesen Zahlen abgeleitet. Übersicht nennt drei von drei E-Mail-Einheiten als verwendet; vorhandene SMTP-Nutzung ist damit nicht ausgeschlossen, aber noch nicht end-to-end geprüft.

Die anschließend geöffnete Domainverwaltung zeigt27 Einträge, darunter mehrere deaktivierte/gekündigte, aber keine logopädiejobs.de beziehungsweise xn--logopdiejobs-kcb.de. Das belegt nur deren Fehlen in dieser geöffneten Paketliste, nicht bei anderen Paketen oder Registraren. Keine fremden Projekt-/Privatdomains, Kunden-/Auftragsnummern oder Sitzungslinks werden hier archiviert. SSL-Zertifikatskontingent und PHP-Version waren noch nicht ausgelesen. Anschließend zeigte der Tab wieder die Anmeldeseite; eine fortbestehende authentifizierte Sitzung wurde nicht behauptet. Nutzer wurde um erneute Anmeldung im passenden Paket beziehungsweise Nennung des Domainanbieters gebeten. Keine Einstellung geändert, keine Anmelde-/Sicherheitsabfrage selbst bestätigt.

**Präzisierter Stand:** Webspacekapazität bestätigt; PHP-/SSL-/Domainzuordnung und damit konkrete Zusatzkostenfreiheit bleiben offen. Der oben frühere Zustand „nur Anmeldeseite, keine Kontoprüfung“ ist für die Paketkapazität durch diese Stichprobe überholt, für die noch offenen Konfigurationen weiterhin zutreffend.


### Abschließende Machbarkeitsbewertung nach Prüfung des Praxispakets — 30.10.2026

**Die zweite Nutzeranmeldung öffnet das tatsächlich zur Praxis gehörende Hosting-Basic-Paket.** Die vorherige100GB/0B-Stichprobe betraf ein anderes Paket und belegt nicht die Praxisbelegung. Das dortige Fehlen der Jobdomain ist durch die richtige Paketzuordnung geklärt. Für die folgende Bewertung ist ausschließlich dieser neue, direkt sichtbare Kontostand maßgeblich:

| Direkt gelesener Bereich | Befund | Bedeutung |
|---|---|---|
| Paket/Kapazität | STRATO Hosting Basic;1,97GB von100GB Webspace belegt | Ausreichende Kapazität für vorhandene statische Website (lokaler Bestand etwa13MiB), kein Kapazitätsupgrade erkennbar nötig. Bestehende Inhalte erhalten; eigener Zielunterordner statt Überschreiben anderer Sites. |
| PHP | Aktuell PHP8.4, als empfohlen markiert; PHP-Boost aktiv | PHP-Formularbackend technisch im vorhandenen Paket möglich; keine Versionsumstellung, kein Node-Server nötig. Keine eigene Runtime-/Extensionprobe hochgeladen. |
| Domain | logopädiejobs.de ist aktiv im Praxispaket; A-Eintrag216.198.79.1 und CNAME angezeigt | Kein Kauf oder Registrartransfer der Jobdomain notwendig. Routing ist noch extern; spätere DNS-/Zieländerung wäre gesondert genehmigungspflichtig. DNS wurde weder geändert noch vollständig inventarisiert. |
| TLS | STRATO SSL Basic bereits logopädiejobs.de zugewiesen; Zertifikatsdetails gültig19.01.2026–10.02.2027; zusätzlich zwei unzugewiesene SSL-Basic-Zeilen | Kein neuer Zertifikatskauf für die kanonische Jobdomain erkennbar erforderlich. Bestehende Kosten/Verlängerungsbedingungen bleiben unverändert; kein Nachweis beliebiger Hostnamenabdeckung aus der Übersicht. www-/IDN-/Weiterleitungsabdeckung bei Implementierungsprüfung verifizieren. |
| Mail | social@logopaedie-simsek.de als bestehendes Postfach in der E-Mail-Verwaltung sichtbar | Kein zusätzliches Postfach allein für die vorhandene Formularfunktion nötig. Keine Nachrichten geöffnet, keine Passwörter oder Kontoeinstellungen gelesen/geändert. SMTP-Authentifizierung und Zustellung noch nicht getestet. |
| SFTP/Datenbanken |4 von11 SFTP-Zugängen,1 von25 Datenbanken verwendet | Kein zusätzlicher Zugang/DB-Tarif als technische Voraussetzung erkennbar; Datenbank wird für das bestehende Formular nicht benötigt. Keine Zugänge angelegt. |

**Ergebnis:** Website und Bewerbungsformular können nach notwendiger Anpassung voraussichtlich ohne zusätzliche laufende Hosting-, Domain-, SSL- oder Formulardienstkosten im vorhandenen Praxispaket betrieben werden. Das bestehende Paket und vorhandene Domain-/Zertifikatskosten laufen unverändert weiter. Es handelt sich um belastbar eingegrenzte Machbarkeit, nicht um getestete Betriebsfähigkeit, Preisgarantie für künftige Vertragsänderungen oder vollständige Datenschutzabnahme.

**Unverändert erforderliche technische Arbeit:** statischer Astro-Export ohne Vercel-Runtime, PHP-Portierung der serverseitigen Formularannahme/TLS-SMTP samt Schutzfunktionen und JSON/No-JS-Verhalten, Übernahme der Redirects/404/Sicherheitsregeln und Entfernung beziehungsweise gesonderte Entscheidung zu Vercel Analytics. Kein kostenpflichtiger Ersatzdienst ist dafür technisch zwingend. Die bisherigen Node-Tests sind keine PHP- oder STRATO-Abnahme. Vor Livegang sind synthetische Tests, Zertifikats-/Hostnamenprüfung, Zustellprüfung und angepasste Hosting-/Datenschutzhinweise nötig. Mailversand braucht weiterhin die konkrete Vorschau und Versandbestätigung.

**Genau nächster Schritt:** nach eigenem lokalen Implementierungsauftrag ein prüfbares statisches Exportpaket mit PHP-Formular und gleichwertigen Tests vorbereiten. Upload, neue Serverdateien, Mailversand, DNS-/Domainzieländerung und Veröffentlichung sind von dieser lesenden Prüfung ausdrücklich nicht autorisiert. Bestehende Zielumgebung nicht verändern.

Keine Speichern-/Zuweisen-/Bestellen-/Upgrade-/DNS-Aktion ausgeführt. Keine Mails geöffnet oder gesendet, keine Nutzdaten/Secrets/Sitzungskennungen archiviert. Browserprüfung erfolgte über Paketübersicht, PHP-Version, SSL-Übersicht/Zertifikatsdetails, Domainverwaltung und E-Mail-Verwaltung. Nur die interne Prüfdokumentation wurde ergänzt. Es wurde nichts gestaged, committed oder gepusht.
