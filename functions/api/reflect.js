// functions/api/reflect.js
import { Hono } from 'hono';

const app = new Hono();

app.post('/', async (c) => {
  try {
    const kv = c.env.HERMES_MEMORY;   // ← Your binding name
    
    const body = await c.req.json();
    
    const newEntry = {
      id: Date.now().toString(),
      timestamp: body.timestamp || Date.now(),
      action: body.action || "UNKNOWN",
      case_ref: body.case_ref || "EU8044516",
      law: body.law || "LAW48",
      type: "REFLECT"
    };

    let memories = await kv.get('memories', 'json') || [];
    memories.unshift(newEntry);
    
    if (memories.length > 100) memories = memories.slice(0, 100);
    
    await kv.put('memories', JSON.stringify(memories));

    return c.json({
      success: true,
      message: "Reflection logged",
      entry: newEntry
    });
  } catch (e) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default app;
