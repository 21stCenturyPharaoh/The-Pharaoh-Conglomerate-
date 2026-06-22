// LAW48: YouTube Proxy. Google sees Cloudflare. Users see Hermes.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || 'CEMENCO Liberia';
  
  if (!env.YOUTUBE_API_KEY) {
    return new Response(JSON.stringify({ 
      error: "Missing YOUTUBE_API_KEY", 
      law: "LAW48" 
    }), { status: 500 });
  }

  // Cache in KV for 1 hour. Stop Google spam.
  const cacheKey = `YT:${query}`;
  const cached = await env.HERMES_MEMORY.get(cacheKey, { type: "json" });
  if (cached) return Response.json({ ...cached, cached: true, law: "LAW48" });

  const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${env.YOUTUBE_API_KEY}`;
  
  try {
    const r = await fetch(ytUrl);
    const j = await r.json();
    
    const clean = {
      law: "LAW48",
      case_ref: "EU8044516",
      query,
      videos: j.items?.map(v => ({
        id: v.id.videoId,
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        published: v.snippet.publishedAt,
        url: `https://youtube.com/watch?v=${v.id.videoId}`
      })) || [],
      timestamp: Date.now()
    };
    
    // Cache 1 hour
    await env.HERMES_MEMORY.put(cacheKey, JSON.stringify(clean), { expirationTtl: 3600 });
    
    // Log to LAW48 memory
    await env.HERMES_MEMORY.put(`EU8044516:${Date.now()}`, JSON.stringify({
      action: "YOUTUBE_SEARCH",
      query,
      law: "LAW48",
      timestamp: Date.now()
    }));
    
    return Response.json(clean);
    
  } catch (e) {
    return Response.json({ error: e.message, law: "LAW48" }, { status: 500 });
  }
      }
