import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { runFTNAI } from "./src/services/ftn-ai.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- FTN AI internal backend route ---
  app.post("/api/ftn-ai/chat", async (req, res) => {
    try {
      const { history, message, context } = req.body ?? {};
      const result = await runFTNAI({
        history: Array.isArray(history) ? history : [],
        message,
        context,
      });
      res.json(result);
    } catch (error: any) {
      console.error("FTN AI Error:", error);
      res.status(400).json({ error: error?.message || "Failed to process FTN AI request." });
    }
  });

  // --- Polyglot API Gateway boundary ---
  // Runtime adapters must replace these endpoints with real collectors before
  // production use. They intentionally do not fabricate telemetry values.
  app.get("/api/mesh/go-core", (_req, res) => {
    res.json({
      service: "Go Core Engine",
      language: "Golang",
      status: "UNWIRED",
      role: "Primary Routing & Stateful Orchestration",
    });
  });

  app.get("/api/mesh/rust-filter", (_req, res) => {
    res.json({
      service: "XDP eBPF Packet Filter",
      language: "Rust/eBPF",
      status: "UNWIRED",
      role: "Ultra-Low Latency Packet Filtering",
    });
  });

  app.get("/api/mesh/providers", (_req, res) => {
    res.json({ providers: [], source: "ftn-runtime", status: "UNWIRED" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FTN Router Gateway running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
