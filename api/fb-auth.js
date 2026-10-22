// Reverse proxy for Firebase Auth's /__/auth/* pages, so Google sign-in redirects
// stay on this domain. Safari and iPhone home-screen apps block the cross-site
// storage the default firebaseapp.com handler relies on.
export default async function handler(req, res) {
  const domain = process.env.FIREBASE_AUTH_DOMAIN;
  if (!domain) {
    res.statusCode = 404;
    return res.end('Auth proxy not configured');
  }
  const url = new URL(req.url, 'http://localhost');
  const path = (url.searchParams.get('p') || '').replace(/[^\w./-]/g, '');
  url.searchParams.delete('p');
  const target = `https://${domain}/__/auth/${path}${url.search}`;
  try {
    const upstream = await fetch(target, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      headers: { 'user-agent': req.headers['user-agent'] || '', accept: req.headers.accept || '*/*' },
      redirect: 'manual',
    });
    res.statusCode = upstream.status;
    const drop = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);
    upstream.headers.forEach((v, k) => { if (!drop.has(k)) res.setHeader(k, v); });
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (e) {
    res.statusCode = 502;
    res.end('Auth proxy error');
  }
}
