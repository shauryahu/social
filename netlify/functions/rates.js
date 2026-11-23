// Netlify Function: returns live Binance USDT prices for the coins on the page.
const HOSTS = [
  'https://data-api.binance.vision',
  'https://api.binance.com',
  'https://api1.binance.com',
  'https://api2.binance.com'
];
const COINS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'TRX', 'LTC', 'GRAM'];
const WANT = new Set(COINS.map((c) => c + 'USDT'));

exports.handler = async () => {
  for (const host of HOSTS) {
    try {
      const res = await fetch(host + '/api/v3/ticker/price');
      if (!res.ok) continue;
      const all = await res.json();
      const rows = all.filter((x) => WANT.has(x.symbol));
      if (!rows.length) continue;
      return {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, max-age=3',
          'access-control-allow-origin': '*'
        },
        body: JSON.stringify(rows)
      };
    } catch (e) { /* try next host */ }
  }
  return { statusCode: 502, headers: { 'content-type': 'application/json' }, body: '[]' };
};
