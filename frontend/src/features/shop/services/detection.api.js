// features/shop/services/detection.api.js
// Owns the WebSocket connection itself — open/close/send.
// No business logic here, just transport.

const WS_PATH = "/ws/detection";

/**
 * Opens a WebSocket connection to the detection endpoint.
 * @param {Object} handlers
 * @param {(detections: Array) => void} handlers.onDetection
 * @param {(message: string) => void} handlers.onError
 * @param {() => void} handlers.onOpen
 * @param {() => void} handlers.onClose
 * @returns {WebSocket} the raw socket — caller is responsible for closing it
 */
export function connectDetectionSocket({ onDetection, onError, onOpen, onClose }) {
  // Same-origin in dev — Vite proxy forwards /ws to the backend.
  // wss:// in production if served over https.
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${window.location.host}${WS_PATH}`);

  socket.binaryType = "blob";

  socket.onopen = () => {
    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "detection_result") {
        onDetection?.(data.detections);
      } else if (data.type === "error") {
        onError?.(data.message);
      }
    } catch (err) {
      onError?.("Malformed response from detection server");
    }
  };

  socket.onerror = () => {
    onError?.("WebSocket connection error");
  };

  socket.onclose = () => {
    onClose?.();
  };

  return socket;
}

/**
 * Sends a single frame (Blob) over an open socket.
 * Caller checks socket.readyState before calling this — kept dumb on purpose.
 */
export function sendFrame(socket, blob) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(blob);
  }
}