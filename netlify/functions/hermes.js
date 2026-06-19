exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const agentName = body.agentName || "";
    const message = body.message || "";

    let response;

    switch (agentName) {
      case "default":
        response = "Hermes Core online. Message received and logged.";
        break;

      case "echo":
        response = `Echo: ${message}`;
        break;

      case "system":
        response = "System node active. No actions available in Stage 1.";
        break;

      default:
        response = "Unknown agent. Hermes Core is in initialization mode.";
        break;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agent: agentName,
        input: message,
        response,
        status: "ok"
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "error",
        error: "Invalid JSON request body"
      })
    };
  }
};
