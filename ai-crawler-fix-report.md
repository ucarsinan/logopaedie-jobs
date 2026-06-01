# AI-Crawler-Fix Report — logopädiejobs.de

**Datum:** 2026-05-31
**Branch:** fix/ai-crawler-access
**Status:** ⚠ TEILWEISE — Repo ist sauber, kein Block gefunden; Ursache liegt außerhalb des Repos (Vercel-Dashboard / Crawler-seitig). Nutzeraktion nötig.

---

## 1. Zusammenfassung

Das gemeldete `ROBOTS_DISALLOWED` stammt **nicht** aus der Repo-Konfiguration. Eine vollständige Diagnose (Repo-Scan, alle Konfig-Layer, Git-Historie, Live-cURL gegen 11 User-Agents) zeigt: **Es existiert nirgends eine Bot-Sperre.** Weder `noai`/`X-Robots-Tag`, noch Middleware, `_headers`, `.vercelignore` oder UA-Filter — und auch in der Git-Historie wurde so etwas nie committet. Live antwortet die Domain **jedem** Crawler (ClaudeBot, GPTBot, PerplexityBot, anthropic-ai, ChatGPT-User, Googlebot, Bingbot) mit **HTTP 200**, ganz ohne `x-robots-tag`-Header; die robots.txt ist byte-sauber. Als einzige Repo-Maßnahme wurde — gemäß strategischer Entscheidung und Phase 2.4 — eine **explizite Allow-Liste** für AI-Crawler in `public/robots.txt` ergänzt (Intent-Dokumentation, kein bestätigter Fix). Die tatsächliche Ursache ist mit hoher Wahrscheinlichkeit **crawler-/dashboard-seitig** (siehe §7) und außerhalb des Repos zu beheben.

## 2. Root-Cause-Analyse

- **Kategorie:** **F** — keine im Repo (und nicht live per HTTP) erkennbare Sperre.
- **Quelle:** Nicht im Repository. Verbleibende Kandidaten liegen außerhalb: Vercel Firewall / „Block AI Bots"-Toggle (verifiziert Bots per IP/ASN, nicht per UA-String — daher mit gespooftem cURL-UA **nicht reproduzierbar**) **oder** crawler-seitiges Fail-Closed-Verhalten beim Verarbeiten der **IDN-/Punycode-Domain** (`logopädiejobs.de` ↔ `xn--logopdiejobs-kcb.de`).
- **Erklärung, warum kein Repo-Layer schuld ist:**
  - `vercel.json` enthält **nur** Redirects + einen Cron — **keinen** `headers`-Block.
  - `astro.config.mjs` nutzt `@astrojs/sitemap` + `@astrojs/vercel`, **kein** Bot-Schutz.
  - **Keine** `src/middleware.ts|js`, **keine** `public/_headers`, **keine** `.vercelignore`.
  - `api/auth.js` + `api/callback.js` sind Decap-CMS-OAuth — **kein** UA-Gating.
  - Git-Historie: `noai` / `X-Robots-Tag` wurden **nie** committet.
  - `ROBOTS_DISALLOWED` ist ein **robots.txt-Parser-Verdikt** des Fetchers — die live ausgelieferte robots.txt erlaubt jedoch alles (`Allow: /`). Ein solches Verdikt bei sauberer Datei entsteht typischerweise durch **konservatives Fail-Closed** des Fetchers, wenn die robots.txt-Anfrage nicht eindeutig verarbeitet werden kann (z. B. IDN-Auflösung, TLS für Unicode-Host, Redirect-Handling) — oder durch einen **veralteten Cache** des Crawlers aus einer früheren Domain-/Redirect-Konstellation.

## 3. Diagnose-Tabelle VORHER (Live, 2026-05-31)

| User-Agent | HTTP-Status | X-Robots-Tag | Diagnose |
|---|---|---|---|
| Browser (Mozilla/5.0) | 200 | _keiner_ | OK |
| ClaudeBot | 200 | _keiner_ | OK — kein Block |
| GPTBot | 200 | _keiner_ | OK — kein Block |
| PerplexityBot | 200 | _keiner_ | OK — kein Block |
| ChatGPT-User | 200 | _keiner_ | OK — kein Block |
| anthropic-ai | 200 | _keiner_ | OK — kein Block |
| Googlebot | 200 | _keiner_ | OK |
| Bingbot | 200 | _keiner_ | OK |
| `/robots.txt` (HEAD) | 200 | _keiner_ | `text/plain`, sauber |
| `www.` (308) | 308 → Canonical | — | korrekter Redirect |
| `http://` (308) | 308 → https Canonical | — | korrekter Redirect |
| `/jobs/` (ClaudeBot) | 200 | _keiner_ | OK |

> Hinweis: `https://logopädiejobs.de/` (Unicode direkt) lieferte lokal `HTTP 000` — ein **cURL-IDN-Quirk** der lokalen Umgebung, kein Server-Fehler. Genau dieses IDN-Verhalten ist aber der plausibelste Auslöser für ein Fail-Closed `ROBOTS_DISALLOWED` auf Crawler-Seite (siehe §7).

## 4. Durchgeführte Änderungen

### Datei: `public/robots.txt`
**Commit:** `333fad3 - docs(robots): explicit allow for AI crawlers`

**Vorher:**
```txt
User-agent: *
Allow: /

# Hier den Pfad zur generierten Sitemap angeben
Sitemap: https://xn--logopdiejobs-kcb.de/sitemap-index.xml
```

**Nachher:**
```txt
User-agent: *
Allow: /

# AI-Crawler ausdrücklich erlaubt (strategische Entscheidung: Sichtbarkeit in
# Perplexity, ChatGPT-Search, Google AI Overviews vor Trainingsdaten-Bedenken).
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

# Hier den Pfad zur generierten Sitemap angeben
Sitemap: https://xn--logopdiejobs-kcb.de/sitemap-index.xml
```

**Begründung:** Der `User-agent: * / Allow: /`-Block erlaubt diese Crawler bereits implizit. Die expliziten Gruppen sind **Intent-Dokumentation** (strategische Entscheidung: AI-Sichtbarkeit erwünscht) **und** Absicherung gegen strikte Parser. Es ist **kein bestätigter Fix** des `ROBOTS_DISALLOWED` — dafür müsste die Ursache (§7) ohnehin außerhalb des Repos liegen. Aufgenommen wurden u. a. die seit 2024 relevant gewordenen UAs `OAI-SearchBot`, `Claude-User`, `Perplexity-User`.

> **Nicht angefasst:** Die uncommitteten Arbeits­änderungen an `src/components/QuickApply.astro` und `src/components/StickyApplyBar.astro` (themenfremd) blieben unberührt und sind **nicht** Teil dieses Commits.

## 5. Diagnose-Tabelle NACHHER (Live)

| User-Agent | HTTP-Status | X-Robots-Tag | OK? |
|---|---|---|---|
| _Alle Crawler_ | **noch nicht deployed** | — | ⏳ |

> Der Branch ist **nicht** deployed. `vercel --prod` ist per globaler Deny-Regel gesperrt und wurde **nicht** ausgeführt. Live-Verifikation erst nach Merge + Auto-Deploy möglich (siehe §7). Da bereits **vor** der Änderung alle Crawler 200 erhielten, ändert dieser Commit am HTTP-Verhalten erwartungsgemäß nichts — er dokumentiert nur den Intent.

## 6. Was NICHT angefasst wurde (und warum)

- `public/robots.txt` Grund-Block (`User-agent: * / Allow: /`) — war bereits sauber, unverändert gelassen.
- `vercel.json` — nur Redirects + Cron, kein Block vorhanden.
- `astro.config.mjs` — kein Bot-Schutz, sitemap-`filter` betrifft nur Sitemap-Aufnahme (nicht Crawling/Indexierung).
- `api/auth.js`, `api/callback.js` — Decap-CMS-OAuth, kein UA-Gating.
- `src/components/QuickApply.astro`, `StickyApplyBar.astro` — themenfremde, vorbestehende uncommittete Änderungen.
- **Lokaler Build:** `npm run build` → ✓ grün; neue robots.txt korrekt in `dist/client/robots.txt` **und** `.vercel/output/static/robots.txt`.

## 7. Offene Punkte / Nutzer-Aktion erforderlich

**(A) Deploy der Repo-Änderung (Intent-Doku):**
```bash
git push origin fix/ai-crawler-access
```
→ PR öffnen & nach `main` mergen → Vercel deployt automatisch. (`vercel --prod` ist lokal per Deny-Regel gesperrt — bewusst nicht ausgeführt.)

**(B) Vercel Firewall / „Block AI Bots" prüfen (primärer Verdacht):**
1. Vercel Dashboard → Projekt `logopaedie-jobs` (Domain `xn--logopdiejobs-kcb.de`) öffnen
2. **Settings → Security → Firewall** (bzw. Tab **Firewall**)
3. Prüfen, ob eine Regel **„Block AI Bots"** / **„AI Bot Protection"** / **BotID** aktiv ist
4. Falls aktiv: **deaktivieren** oder AI-Crawler **whitelisten** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai)
5. Zusätzlich **Settings → Security → Bot Management** auf Allow/Challenge-Regeln gegen Crawler prüfen
> Wichtig: Diese Regeln matchen verifizierte Bots per **IP/ASN**, nicht per UA-String — deshalb war der Block mit gespooftem cURL-UA (alle 200) **nicht reproduzierbar**, würde aber den echten Anthropic-/OpenAI-Fetcher treffen.

**(C) IDN-/Domain-Form beim Fetch beachten:**
- Beim erneuten Test mit dem AI-Tool die **Punycode-Form** verwenden: `https://xn--logopdiejobs-kcb.de/` statt `https://logopädiejobs.de/`. Fail-Closed bei IDN-Auflösung ist ein plausibler Auslöser für `ROBOTS_DISALLOWED` bei sauberer robots.txt.
- Nach dem Deploy 24–48 h für **Crawler-seitiges robots.txt-Caching** einplanen, dann erneut testen.

**(D) Re-Verifikation nach Deploy** — Tabelle aus §3 erneut fahren und in §5 nachtragen.

## 8. Empfehlungen für die Zukunft

- **robots.txt-Drift-Monitoring:** Vierteljährlicher cURL-Check der Live-robots.txt + HTTP-Status für die wichtigsten AI-UAs (Skript aus §9 wiederverwendbar).
- **IDN-Hygiene:** In Sitemaps, Schema.org (`url`/`sameAs`) und allen kanonischen Verweisen konsequent die **Punycode-Form** nutzen (ist bereits der Fall) — IDN-Fetcher sind weiterhin fehleranfällig.
- **Neue AI-Crawler beobachten** (zuletzt relevant geworden): `OAI-SearchBot`, `Claude-User`, `Perplexity-User`, `Applebot-Extended`, `meta-externalagent`, `Bytespider`, `Amazonbot`, `Diffbot` — bei Bedarf in die Allow-Liste aufnehmen.
- **Vercel-Firewall dokumentieren:** Aktive Security-Regeln sind nicht im Repo sichtbar → in der Projekt-CLAUDE.md / einem `INFRA.md` festhalten, damit künftige Diagnosen nicht erneut im Repo suchen.

## 9. Anhang: Vollständige cURL-Logs

<details>
<summary>VORHER — Live-Tests (2026-05-31)</summary>

```
Browser        → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
ClaudeBot      → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
GPTBot         → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
PerplexityBot  → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
ChatGPT-User   → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
anthropic-ai   → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
Googlebot      → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)
Bingbot        → HTTP 200 | content-type: text/html | server: Vercel | x-robots-tag: (keiner)

robots.txt HEAD (ClaudeBot)  → HTTP 200 | content-type: text/plain | x-robots-tag: (keiner)
www.  (ClaudeBot)            → HTTP 308 → https://xn--logopdiejobs-kcb.de/
http:// (ClaudeBot)          → HTTP 308 → https://xn--logopdiejobs-kcb.de/
/jobs/ (ClaudeBot)           → HTTP 200
logopädiejobs.de (Unicode)   → HTTP 000  (lokaler cURL-IDN-Quirk, kein Serverfehler)

robots.txt BODY:
User-agent: *
Allow: /

# Hier den Pfad zur generierten Sitemap angeben
Sitemap: https://xn--logopdiejobs-kcb.de/sitemap-index.xml

robots.txt od -c: kein BOM, ASCII sauber, endet mit \n
```
</details>

<details>
<summary>NACHHER — Live</summary>

```
Noch nicht verfügbar — Branch fix/ai-crawler-access ist nicht deployed.
Nach Merge + Vercel-Auto-Deploy Tests aus §3 wiederholen.
```
</details>

---

**Finaler Status:** ⚠ **TEILWEISE** — Repo verifiziert sauber, kein Block existiert; Intent-Allow-Liste committet (Branch `fix/ai-crawler-access`), Build grün. Tatsächliche `ROBOTS_DISALLOWED`-Ursache liegt außerhalb des Repos → **Nutzeraktion nötig** (Vercel-Firewall prüfen + Punycode-Domain beim Fetch verwenden, §7).
