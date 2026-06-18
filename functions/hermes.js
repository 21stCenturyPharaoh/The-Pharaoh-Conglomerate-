import config from "../hermes.config.js";

export default async (request) => {
  try {
    const body = await request.json();

    const agentName = body.agentName || "Unknown";
    const message = body.message || "";

    const agent =
      config.agents[agentName] || {
        role: "Unknown Agent"
      };

    const reply =
      `Hermes online.\n\n` +
      `Agent: ${agentName}\n` +
      `Role: ${agent.role}\n\n` +
      `Received:\n${message}`;

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        reply: "Hermes is online, but the request could not be processed."
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
