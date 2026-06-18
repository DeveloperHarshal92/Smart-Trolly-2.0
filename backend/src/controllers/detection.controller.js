// controllers/detection.controller.js
// Owns the WebSocket connection lifecycle for real-time detection.
// One handler instance per connected client.

import { runInference } from "../services/detection.service.js";

// Frame throttling — prevents overwhelming the ONNX session if the client
// sends frames faster than inference can process them (e.g. 30fps camera
// but inference takes 150ms per frame)
const MIN_FRAME_INTERVAL_MS = 200;

export const handleDetectionSocket = (socket) => {
  let lastFrameTime = 0;
  let processing = false;

  socket.on("message", async (rawMessage) => {
    const now = Date.now();

    // Drop frame if previous inference still running, or arriving too fast
    if (processing || now - lastFrameTime < MIN_FRAME_INTERVAL_MS) {
      return;
    }

    processing = true;
    lastFrameTime = now;

    try {
      // rawMessage is expected to be a raw JPEG/PNG buffer sent as binary
      // (frontend sends via socket.send(blob) — see useDetection.js)
      const detections = await runInference(rawMessage);

      socket.send(JSON.stringify({
        type: "detection_result",
        detections,
        timestamp: now,
      }));
    } catch (err) {
      console.error("[detection] inference error:", err.message);
      socket.send(JSON.stringify({
        type: "error",
        message: "Detection failed on this frame",
      }));
    } finally {
      processing = false;
    }
  });

  socket.on("close", () => {
    console.log("[ws] client disconnected");
  });

  socket.on("error", (err) => {
    console.error("[ws] socket error:", err.message);
  });
};