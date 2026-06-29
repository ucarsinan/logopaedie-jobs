# Git Workflow — logopaedie-jobs

Git ist Teil des kontrollierten Agentenprozesses, aber nicht autonom.

## Regeln

- Keine Commits ohne ausdrueckliche Freigabe.
- Kein Push ohne ausdrueckliche Freigabe.
- Keine destruktiven Git-Befehle ohne ausdrueckliche Freigabe.
- Nur Dateien stagen, die eindeutig zur freigegebenen Aufgabe gehoeren.
- Fremde oder unklare Worktree-Aenderungen nicht stagen und nicht bereinigen.
- Vor Commit/Push immer `git status` und relevante Diffs pruefen.
- Vor Commit `./scripts/verify.sh` ausfuehren oder Restrisiko klar berichten.

## Git-Ampel

Jeder Bericht beantwortet:

- Wurde etwas gestaged?
- Wurde ein Commit erstellt?
- Wurde etwas gepusht?
- Was fehlt fuer den naechsten Git-Schritt?

Wenn kein Push passiert ist: `Es wurde nichts gepusht.`

## Standardablauf

1. `git status --short`
2. Eigene Aenderungen identifizieren.
3. Fremde Aenderungen abgrenzen.
4. Relevante Diffs pruefen.
5. `./scripts/verify.sh`
6. Commit-Scope vorschlagen.
7. Freigabe einholen.
8. Gezielt stagen.
9. Commit.
10. Push nur nach Freigabe.
