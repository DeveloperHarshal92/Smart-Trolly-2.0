import http from "http";
import { WebSocketServer } from "ws";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { loadModel } from "./src/services/detection.service.js";
import { handleDetectionSocket } from "./src/controllers/detection.controller.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Load ONNX model into memory — must finish before any inference request
    await loadModel();

    // 3. Create HTTP server from Express app — this is the single server instance
    //    both Express routes AND the WebSocket server share
    const httpServer = http.createServer(app);

    // 4. Attach WebSocket server to the same port, different upgrade path
    const wss = new WebSocketServer({
      server: httpServer,
      path: "/ws/detection",
    });

    wss.on("connection", (socket, req) => {
      console.log("[ws] client connected:", req.socket.remoteAddress);
      handleDetectionSocket(socket);
    });

    wss.on("error", (err) => {
      console.error("[ws] server error:", err);
    });

    // 5. Start listening
    httpServer.listen(PORT, () => {
      console.log(`[server] running on port ${PORT}`);
      console.log(`[server] WebSocket listening on ws://localhost:${PORT}/ws/detection`);
    });

  } catch (error) {
    console.error("[server] failed to start:", error);
    process.exit(1);
  }
};

startServer();