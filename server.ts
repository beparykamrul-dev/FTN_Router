import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Gemini AI Backend Route ---
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const { history, message, contextAwareness } = req.body;
      
      let sysInstruction = "You are FTN AI, a proprietary artificial intelligence engineered exclusively for the FTN Network Grid. You are NOT a generic LLM. You are FTN AI. Provide professional, concise network remediation advice and configuration snippets (like RouterOS) when asked. Speak in a confident, highly technical tone. Assume you have real-time memory and telemetry context.";
      
      if (contextAwareness) {
         sysInstruction += "\n\n[LIVE TELEMETRY SNAPSHOT]\n- Global Edge Tunnels: 3,492 Active (AES-256-GCM)\n- BGP Routes: 842k IPv4, 150k IPv6 (Stable)\n- OLT-GPON-04: Critical Warning (Power Supply A Wear: 92%)\n- CA Node ca-edge-02: Degraded (89% Load)\n- Remote VPN Cert: Expires in 12 Days\nUse this context if relevant to the user's query.";
      }
      
      // We reconstruct the chat using the history provided by the client
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: sysInstruction,
        },
        history: history || []
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI request." });
    }
  });

  // --- Polyglot API Gateway Simulation ---
  
  // Simulated Go Backend Routing
  app.get("/api/mesh/go-core", (req, res) => {
    res.json({
      service: "Go Core Engine",
      language: "Golang 1.22",
      status: "ONLINE",
      goroutines: Math.floor(Math.random() * 50000) + 10000,
      latencyMs: Math.floor(Math.random() * 5) + 1,
      role: "Primary Routing & Stateful Orchestration"
    });
  });

  // Simulated Rust Middleware / eBPF Filter
  app.get("/api/mesh/rust-filter", (req, res) => {
    res.json({
      service: "XDP eBPF Packet Filter",
      language: "Rust 1.76",
      status: "ACTIVE",
      droppedPackets: Math.floor(Math.random() * 1000000),
      memorySafe: true,
      role: "Ultra-Low Latency WAF & Packet Inspection"
    });
  });

  // Global Providers Metrics
  app.get("/api/mesh/providers", (req, res) => {
    res.json([
      { provider: "Cloudflare", type: "Proxy/CDN", status: "Active", latency: "12ms" },
      { provider: "Datadog", type: "Metrics APM", status: "Active", latency: "45ms" },
      { provider: "Twilio", type: "SMS Alerting", status: "Standby", latency: "N/A" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Polyglot Gateway Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
