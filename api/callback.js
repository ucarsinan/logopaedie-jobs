// api/callback.js — Vercel Serverless Function
// GitHub leitet hier hin zurück mit ?code=...
// Wir tauschen den Code gegen ein Access-Token und schicken es per postMessage
// zurück an das Decap-CMS-Popup.

export default async function handler(req, res) {
  const { code, state } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(500).send('OAuth nicht konfiguriert (CLIENT_ID / CLIENT_SECRET fehlen).');
    return;
  }
  if (!code) {
    res.status(400).send('Kein Code übergeben.');
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state,
      }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      res.status(400).send(`OAuth-Fehler: ${data.error_description || 'Unbekannt'}`);
      return;
    }

    const payload = {
      token: data.access_token,
      provider: 'github',
    };

    // Decap erwartet eine Message im Format "authorization:<provider>:success:<json>"
    const content = `authorization:github:success:${JSON.stringify(payload)}`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!DOCTYPE html>
<html>
  <body>
    <p>Login erfolgreich, Fenster schließt sich gleich…</p>
    <script>
      (function () {
        function send(msg) {
          window.opener && window.opener.postMessage(msg, '*');
        }
        window.addEventListener('message', function (e) {
          if (e.data === 'authorizing:github') {
            send(${JSON.stringify(content)});
          }
        }, false);
        send('authorizing:github');
        setTimeout(function () { window.close(); }, 800);
      })();
    </script>
  </body>
</html>`);
  } catch (err) {
    res.status(500).send('OAuth-Callback fehlgeschlagen: ' + err.message);
  }
}
