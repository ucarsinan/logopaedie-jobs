// api/auth.js — Vercel Serverless Function
// Startet den GitHub-OAuth-Flow für Decap CMS.
// Der Redakteur klickt in /admin/ auf "Login with GitHub",
// Decap ruft /api/auth?provider=github auf, und wir leiten zu GitHub weiter.

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).json({ error: 'GITHUB_CLIENT_ID ist nicht gesetzt' });
    return;
  }

  const host = req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;

  const state = Math.random().toString(36).slice(2);
  const scope = 'repo,user';

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  res.writeHead(302, { Location: url });
  res.end();
}
