# Vercel-Bot-Protection-Fix Report — logopädiejobs.de

**Datum:** 2026-06-01
**Branch:** fix/vercel-bot-protection
**Status:** ⚠ VERCEL-URSACHE AUSGESCHLOSSEN — keine Plattform-seitige Sperre vorhanden; nächster Beweis nur durch Fetcher-Retest des Nutzers (kein UI-Toggle nötig)
**Vorgänger-Report:** ai-crawler-fix-report.md (Branch fix/ai-crawler-access)

---

## 1. Zusammenfassung

Die Hypothese „Vercel-seitige Bot-Protection blockt AI-Crawler per IP/ASN" ist durch die API-Diagnose **widerlegt**. Das Projekt läuft auf dem **Hobby-Plan** — die konfigurierbare Firewall (Managed Rules / Custom Rules / BotID / Attack-Challenge) existiert dort schlicht **nicht** (Endpoints liefern 404) bzw. ist **leer** (`firewall/config` → `{"active":null,"draft":null,"versions":[]}`). Es gibt **keinen** IP-Block, **keine** Bot-Regel, **kein** Cloudflare/Proxy davor (DNS zeigt auf Vercel-Anycast `216.198.79.1`, `server: Vercel`, kein `cf-ray`). Die einzige Security-Einstellung — `ssoProtection: all_except_custom_domains` — nimmt die Custom-Domain **aus**, weshalb sie öffentlich ist und alle Crawler 200 erhalten. **Es wurde nichts geändert**, weil es plattform-seitig nichts zu fixen gibt; das `ROBOTS_DISALLOWED` ist mit hoher Sicherheit ein **Fetcher-seitiges Artefakt** (IDN/Punycode-Handling oder veralteter robots-Cache), kein Vercel-Block.

## 2. Vercel-Account-Kontext

- **User/Team:** `infoucarsinan-2893` / Team „Sinan Uçar's projects" (`sinan-ucars-projects`)
- **Plan:** **Hobby**
- **Projekt:** `logopaedie-jobs` — `prj_***` (ID anonymisiert), Org `team_***`
- **Framework:** astro · **Prod-URL:** `https://xn--logopdiejobs-kcb.de`
- **API-Verfügbarkeit für Firewall:** **Teilweise** — `firewall/config` erreichbar (aber leer); `attack-challenge-mode`, `bot-protection`, generisches `security` → 404 (auf Hobby nicht vorhanden)

## 3. Diagnose — API-Endpoints geprüft

| Endpoint | HTTP | Relevante Findings |
|---|---|---|
| `vercel whoami` / `teams ls` | OK | Auth gültig, Team-Kontext geklärt |
| `vercel link --yes` | OK | `.vercel/project.json` erzeugt (projectId/orgId) |
| `/v2/teams/{org}` | 200 | **`plan: "hobby"`** |
| `/v9/projects/{id}` | 200 | `ssoProtection: {deploymentType: "all_except_custom_domains"}`, `passwordProtection: null`, `trustedIps: null` |
| `/v1/security/firewall/config` | 200 | **LEER**: `{"active":null,"draft":null,"versions":[]}` → keine Regeln |
| `/v1/security/attack-challenge-mode` | 404 | Feature nicht vorhanden |
| `/v1/security/bot-protection` | 404 | Feature nicht vorhanden (BotID = Pro+) |
| `/v1/security` | 404 | kein generisches Security-Objekt |
| `dig xn--logopdiejobs-kcb.de` | — | `216.198.79.1` (Vercel-Anycast), **kein Cloudflare** |
| `curl -I` Custom-Domain | 200 | `server: Vercel`, `x-vercel-cache: HIT`, `x-vercel-id: fra1::…`, **kein** `x-robots-tag`, **kein** `cf-ray` |

## 4. Root-Cause-Identifikation

- **Kategorie:** **V8** (keine Vercel-seitige Ursache erkennbar) — kombiniert mit **V7-Kontext** (Hobby-Plan → Firewall-Features existieren nicht, können also gar nicht die Ursache sein).
- **Konkrete Quelle:** Keine. Firewall-Config leer, Bot/Challenge-Features nicht vorhanden, kein IP-Block, kein Proxy, Custom-Domain via `ssoProtection`-Ausnahme öffentlich.
- **Begründung mit Daten:**

<details>
<summary>API-Auszüge</summary>

```json
// /v2/teams/{org}
{ "name": "Sinan Uçar's projects", "slug": "sinan-ucars-projects", "plan": "hobby" }

// /v9/projects/{id} (security-relevant)
{
  "name": "logopaedie-jobs",
  "framework": "astro",
  "ssoProtection": { "deploymentType": "all_except_custom_domains" },
  "passwordProtection": null,
  "trustedIps": null,
  "oidcTokenConfig": { "enabled": true, "issuerMode": "team" }
}

// /v1/security/firewall/config  → KEINE Regeln aktiv
{ "active": null, "draft": null, "versions": [] }

// attack-challenge-mode / bot-protection / security → 404 not_found
```
</details>

> **Konsequenz für die Ausgangs-Hypothese:** Eine ASN-/IP-basierte AI-Bot-Sperre setzt die Vercel-WAF/BotID voraus. Diese ist auf Hobby nicht buchbar und im Projekt nicht vorhanden. Die Hypothese ist damit **technisch ausgeschlossen**, nicht nur „nicht gefunden".

## 5. Durchgeführte API-Calls (ändernd)

**Keine.** Es gab nichts zu patchen oder zu löschen — die Firewall-Config ist leer, die fraglichen Features existieren nicht, und `ssoProtection: all_except_custom_domains` ist für eine öffentliche Recruiting-Site **korrekt** (schützt Preview-/Deployment-URLs, lässt die Custom-Domain öffentlich). Ein spekulatives PATCH (z. B. `ssoProtection: null`) wurde **bewusst unterlassen**, da es keinen Effekt auf die bereits öffentliche Custom-Domain hätte und nur den Preview-Schutz schwächen würde.

## 6. Verifikation — cURL-Tabelle nachher

| User-Agent | Vorher (alter Report) | Nachher (2026-06-01) | OK? |
|---|---|---|---|
| Browser (Mozilla/5.0) | 200 | 200 | ✓ |
| ClaudeBot | 200 | 200 | ✓ |
| GPTBot | 200 | 200 | ✓ |
| PerplexityBot | 200 | 200 | ✓ |
| anthropic-ai | 200 | 200 | ✓ |
| ChatGPT-User | 200 | 200 | ✓ |
| `.vercel.app`-Alias | — | 200 | ✓ (kein SSO-Wall auf Prod-Alias) |

Unverändert alles 200 — erwartet, da nichts geändert wurde und nie ein Block existierte.

## 7. Vercel-Logs-Analyse

`vercel logs` zeigt für dieses Projekt **nur Function-Invocations** (Cron `/cron/expire-jobs`, Decap-OAuth `api/auth`, `api/callback`). Die Seite ist **statisch** — Aufrufe von `/` und `/robots.txt` werden am Edge ausgeliefert und **nicht** in den Runtime-Logs erfasst. Ein Live-Tail während eines Crawl-Tests kann daher den Crawler-Zugriff auf statische Pfade **nicht** belegen oder widerlegen. (Edge-Request-Logs gibt es erst ab Pro mit „Observability".) → Log-Tail hier nicht aussagekräftig, bewusst nicht als Beweis herangezogen.

## 8. Was NICHT geändert wurde

- **Repo:** nur dieses Report-File hinzugefügt (Commit auf `fix/vercel-bot-protection`)
- **Branch `fix/ai-crawler-access`:** unberührt
- **Uncommitted Files** `QuickApply.astro`, `StickyApplyBar.astro`: unberührt, nicht committet
- **Production-Domain / DNS:** nicht angefasst
- **`ssoProtection`:** bewusst belassen (korrekt konfiguriert)
- **Keine** PATCH/DELETE-API-Calls

## 9. UI-Klickpfad (nur falls du es selbst verifizieren willst — keine Pflicht)

Es ist **keine** UI-Korrektur nötig. Zur eigenen Sichtprüfung:

```
Vercel Dashboard → Project „logopaedie-jobs"
→ Settings → Firewall
   → erwartet: keine aktiven Custom/Managed Rules (leer)  ✓ bestätigt via API
→ Settings → Deployment Protection
   → „Vercel Authentication": Standard/Production-Custom-Domain ausgenommen  ✓ (all_except_custom_domains)
→ (BotID / Attack Challenge Mode sind auf Hobby nicht vorhanden)
```

## 10. Nächster Schritt für den Nutzer (Su)

1. **Beweistest (entscheidend):** Im Chat (claude.ai) Claude bitten, **exakt die Punycode-URL** zu fetchen:
   `https://xn--logopdiejobs-kcb.de/`  — **nicht** die Umlaut-Form `https://logopädiejobs.de/`.
   → Die IDN-/Punycode-Auflösung ist der wahrscheinlichste Auslöser des `ROBOTS_DISALLOWED` (Fail-Closed des Fetchers bei der Umlaut-Domain).
2. Falls weiterhin `ROBOTS_DISALLOWED` **trotz** Punycode-URL: Ursache liegt im Anthropic-Fetcher (veralteter robots-Cache / Fail-Closed), **nicht** an Website oder Vercel — beide sind hiermit + dem Vorgänger-Report nachweislich sauber. Dann ~24 h Cache-Ablauf abwarten und erneut testen.
3. Optional die Intent-Allow-Liste aus dem Vorgänger-Branch mergen (`fix/ai-crawler-access`) — reine Dokumentation, kein technischer Fix.
4. Diesen Branch bei Bedarf mergen: `git push origin fix/vercel-bot-protection` → PR.

## 11. Anhang: Vollständige API-Responses

<details>
<summary>Roh-Responses (IDs anonymisiert)</summary>

```json
// /v1/security/firewall/config?projectId=prj_***&teamId=team_***
{"active":null,"draft":null,"versions":[]}

// /v1/security/attack-challenge-mode  → 404
{"error":{"code":"not_found","message":"Not Found"}}

// /v1/security/bot-protection  → 404
{"error":{"code":"not_found","message":"Not Found"}}

// /v1/security  → 404
{"error":{"code":"not_found","message":"Not Found"}}

// curl -sI https://xn--logopdiejobs-kcb.de/
cache-control: public, max-age=0, must-revalidate
server: Vercel
x-vercel-cache: HIT
x-vercel-id: fra1::***

// dig +short xn--logopdiejobs-kcb.de
216.198.79.1   (Vercel-Anycast, kein Cloudflare)
```
</details>

---

```
=================================
FINAL STATUS: ⚠
NÄCHSTER SCHRITT FÜR NUTZER: Claude die PUNYCODE-URL https://xn--logopdiejobs-kcb.de/ fetchen lassen — Vercel & Repo sind nachweislich sauber, Ursache liegt im Fetcher (IDN/Cache).
=================================
```
