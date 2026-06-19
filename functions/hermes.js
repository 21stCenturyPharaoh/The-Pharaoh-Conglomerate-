export default async (req) => {
  const body = await req.json().catch(() => ({}));
  
  return new Response(JSON.stringify({
    status: "Alpha Node Online",
    law: "48",
    received: body.message || "No message",
    timestamp: new Date().toISOString(),
    message: "Backend operational. Awaiting configuration."
  }, null, 2), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
