Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  
  if (url.pathname === "/api/hermes") {
    const body = await req.json().catch(() => ({}));
    return new Response(JSON.stringify({
      status: "Alpha Node Online",
      law: "48", 
      timestamp: new Date().toISOString(),
      received: body.message || "No message",
      message: "Test successful"
    }, null, 2), { headers });
  }
  
  const html = `<!DOCTYPE html>
<html>
<head><title>Toth Alpha Node</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:sans-serif;padding:20px;background:#000;color:#0f0">
  <h1>Alpha Node Online 👊😎✊</h1>
  <p>Project: toth-alpha-node</p>
  <p>Law: 48</p>
  <button onclick="testHermes()" style="padding:10px 20px;background:#0f0;color:#000;border:none;font-size:16px">Test</button>
  <pre id="output" style="margin-top:20px;white-space:pre-wrap"></pre>
  <script>
    async function testHermes() {
      document.getElementById('output').textContent = 'Connecting to Hermes...';
      const res = await fetch('/api/hermes', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: 'Test from Blackview' })
      });
      const data = await res.json();
      document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    }
  </script>
</body>
</html>`;
  
  return new Response(html, { 
    headers: { "Content-Type": "text/html" } 
  });
});
