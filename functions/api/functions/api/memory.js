// functions/api/memory.js
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const kv = c.env.HERMES_MEMORY;   // ← Your binding name
    
    const memories = await kv.get('memories', 'json') || [];
    
    return c.json({
      memories: memories.slice(0, 50),
      count: memories.length
    });
  } catch (e) {
    return c.json({ memories: [], error: "KV unavailable" }, 500);
  }
});

export default app;
