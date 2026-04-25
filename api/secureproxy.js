export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { e, s } = req.query;

    if (e === 'ping_proxy') {
      res.setHeader('Content-Type', 'application/javascript');
      return res.status(200).send('void 0;');
    }

    if (s) {
      try {
        const decodedPath = decodeURIComponent(s);
        const targetUrl = `https://dexscreener.com${decodedPath}`;
        
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        if (!response.ok) {
          return res.status(response.status).send(response.statusText);
        }

        const data = await response.text();
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(200).send(data);
      } catch (err) {
        console.error('Secureproxy GET error:', err);
        return res.status(500).end();
      }
    }

    return res.status(404).end();
  }

  if (req.method === 'POST') {
    // Default POST fallback
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
