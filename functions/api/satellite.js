export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const site = url.searchParams.get('site') || 'CEMENCO';
  const lat = url.searchParams.get('lat') || '6.2907';
  const lng = url.searchParams.get('lng') || '-10.7605';
  const zoom = url.searchParams.get('zoom') || '17';
  const size = '640x640';
  const maptype = 'satellite';
  
  const gmapsUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${maptype}&key=${env.GOOGLE_MAPS_API_KEY}`;
  
  const img = await fetch(gmapsUrl);
  const buffer = await img.arrayBuffer();
  
  // Log to KV - LAW48
  if (env.MEMORY) {
    await env.MEMORY.put(`sat_${site}_${Date.now()}`, JSON.stringify({site, lat, lng, zoom, ts: Date.now()}));
  }
  
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png', 'X-LAW48': 'TOTH-SAT-CAPTURE' }
  });
}
