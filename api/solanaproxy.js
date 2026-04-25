export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Vercel parses JSON bodies automatically if the content-type is application/json.
      // But we just want to forward it as stringified JSON to Solana RPC.
      const bodyStr = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;

      const response = await fetch("https://api.mainnet-beta.solana.com", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: bodyStr
      });

      const data = await response.text();
      res.setHeader('Content-Type', 'application/json');
      return res.status(response.status).send(data);
    } catch (err) {
      console.error('Solanaproxy error:', err);
      return res.status(500).end();
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
