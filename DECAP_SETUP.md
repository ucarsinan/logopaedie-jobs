# Decap CMS — Setup-Anleitung

Das CMS ist eingerichtet, aber es braucht einmalig zwei manuelle Schritte, damit Redakteure sich anmelden können.

## 1. GitHub OAuth App erstellen

1. Auf GitHub einloggen → Settings → Developer settings → OAuth Apps → **New OAuth App**
2. Felder ausfüllen:
   - **Application name:** Logopädiejobs Redaktion
   - **Homepage URL:** `https://xn--logopdiejobs-kcb.de`
   - **Authorization callback URL:** `https://xn--logopdiejobs-kcb.de/api/callback`
3. Speichern → **Client ID** und **Client Secret** notieren (Secret nur einmal sichtbar)

## 2. Umgebungsvariablen in Vercel setzen

Vercel Dashboard → Projekt `logopaedie-jobs` → **Settings** → **Environment Variables**.
Zwei Variablen anlegen (für alle Environments):

- `GITHUB_CLIENT_ID` = die Client ID aus Schritt 1
- `GITHUB_CLIENT_SECRET` = das Client Secret aus Schritt 1

Nach dem Hinzufügen: **Redeploy** auslösen, damit die Variablen in den Serverless Functions ankommen.

## 3. Repo-Namen in `public/admin/config.yml` anpassen

In der Datei `public/admin/config.yml` die Zeile
```yaml
repo: SIMSEK-UCAR/logopaedie-jobs
```
auf den echten `user/repo`-Pfad ändern (z. B. `emel-simsek/logopaedie-jobs`) und committen.

## 4. Redakteure einladen

- Jeder Redakteur braucht einen **GitHub-Account** und muss **Collaborator** im Repo sein
  (GitHub → Repo → Settings → Collaborators → Add people).
- Rolle: `Write` reicht aus.

## 5. Loslegen

`https://xn--logopdiejobs-kcb.de/admin/` aufrufen → "Login with GitHub" → freigeben →
die Redaktionsoberfläche öffnet sich. Neue Artikel werden als Markdown unter
`src/content/ratgeber/` committet, Vercel deployt automatisch neu.

## Hinweise

- **Editorial Workflow ist aktiviert:** Redakteure schreiben Entwürfe, können sie zur
  Review einreichen und erst nach Freigabe veröffentlichen. Das lässt sich in der
  `config.yml` bei `publish_mode: editorial_workflow` auch wieder deaktivieren.
- **Bilder** werden unter `public/uploads/` abgelegt und sind über `/uploads/...`
  erreichbar.
- **Geschützt:** `/admin/` ist mit `robots: noindex` markiert und nur mit GitHub-Login
  bedienbar. Trotzdem ist es öffentlich erreichbar. Wer das komplett abschließen
  will, kann einen Vercel Password Protection oder ein IP-Gate davorsetzen.
