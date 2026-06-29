# Agenten-Leitfaden

Dieses Projekt muss jederzeit zwischen Codex, Claude Code und anderen KI-Agenten uebergebbar sein.

## Projekt

`logopaedie-jobs` ist aktuell keine klassische Jobboerse und keine Plattform fuer externe Arbeitgeber.
Die Website dient zum jetzigen Zeitpunkt ausschliesslich der Praxis fuer Logopaedie Simsek: Stellen,
Bewerbungswege, SEO-Seiten und Inhalte muessen auf diese Praxis ausgerichtet bleiben.

Produktentscheidung vom 2026-06-29:

- Keine fremden Arbeitgeber-Anzeigen.
- Kein oeffentliches Stellen-Einreichformular fuer Dritte.
- Keine Supabase-/Datenbank-Jobboerse als aktuelles Zielbild.
- Vorhandene oder uncommitted Supabase-/Jobboard-Artefakte gelten als nicht freigegebener Entwurf, nicht als Produktvorgabe.

## Sprache

- Mit Sinan immer auf Deutsch sprechen.
- Kurz, konkret und handlungsorientiert schreiben.
- Bei unklaren Produkt-, Datenschutz- oder Bewerbungsdaten-Fragen nicht raten.

## Pflicht vor jeder Arbeit

1. `AGENTS.md` lesen.
2. `PROJECT_CONTEXT.md` lesen.
3. `WORKFLOW.md` lesen.
4. `TESTING.md` lesen.
5. `SECURITY.md` lesen.
6. `docs/agents/worker-map.md` lesen.
7. `docs/agents/git-workflow.md` lesen.
8. `git status --short` pruefen und vorhandene Nutzerarbeit respektieren.

## Agentic-Arbeitsregel

Auch wenn der Nutzer eine Aufgabe kurz oder ungenau formuliert, arbeitest du immer so:

1. Kontext lesen.
2. Ziel und Nicht-Ziele ableiten.
3. Datenschutz-, Formular-, SEO-, Routing- und Deploy-Risiken pruefen.
4. Betroffene Seiten, Komponenten, APIs, Datenmodelle und Tests identifizieren.
5. Einen kleinen nachvollziehbaren Plan erstellen.
6. Nur notwendige Aenderungen umsetzen.
7. Pflicht-Checks ausfuehren.
8. Ergebnis als handfesten Fahrplan berichten.

## Projektgrenzen

- Keine echten Bewerbungsdaten, Kontaktanfragen oder personenbezogenen Daten ungefragt lesen, loggen oder in Tests uebernehmen.
- Keine produktiven Daten oder Datenbanken veraendern ohne ausdrueckliche Freigabe.
- Keine Vercel-/DNS-/Domain-Aktion ohne ausdrueckliche Freigabe.
- SEO-Aenderungen muessen Canonicals, Sitemap-Ausschluesse, Indexierbarkeit und Redirects beruecksichtigen.
- Formular- und Admin-Aenderungen brauchen Datenschutz-, Spam- und Validierungspruefung.

## Pflicht-Checks

Der bevorzugte Abschlussbefehl ist:

```bash
./scripts/verify.sh
```

Wenn der volle Check nicht laufen kann, dokumentiere warum und fuehre eine kleinere passende Ersatzpruefung aus.

## Git-Regeln

- Keine Commits ohne ausdrueckliche Freigabe.
- Kein Push ohne ausdrueckliche Freigabe.
- Vor Commit oder Push immer `git status` und relevante `git diff`-Ansichten pruefen.
- Nur Dateien stagen, die eindeutig zur freigegebenen Aufgabe gehoeren.
- Fremde, alte oder unklare Worktree-Aenderungen nicht stagen und nicht bereinigen.
- Keine destruktiven Git-Befehle ohne ausdrueckliche Freigabe.
- Vor Commit muss `./scripts/verify.sh` erfolgreich laufen oder das verbleibende Risiko transparent berichtet werden.

## Verstaendliche Abschlussberichte

Jeder Abschlussbericht muss enthalten:

- Kurzfazit: erledigt, teilweise erledigt oder blockiert.
- Was bedeutet das? Eine einfache Erklaerung in 1-3 Saetzen.
- Handfester Fahrplan: konkrete naechste Schritte in Reihenfolge.
- Pro Schritt: Datei/Bereich, Aktion, kurze Begruendung und ob Freigabe noetig ist.
- Empfohlene Entscheidung fuer den Nutzer.
- Git-Status: gestaged, committed, gepusht, naechste Freigabe.

Wenn nicht gepusht wurde, klar sagen: `Es wurde nichts gepusht.`

Findings muessen enthalten: Status (`SUPPORTED`, `PARTIALLY_SUPPORTED`, `INSUFFICIENT_EVIDENCE`, `CONFLICTING`, `NOT_FOUND`), Prioritaet (`P1`, `P2`, `P3`), Problem, Auswirkung, naechster Schritt und Begruendung.
