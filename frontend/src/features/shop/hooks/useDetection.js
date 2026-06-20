// features/shop/hooks/useDetection.js
// Bridge layer: owns the <video> stream, canvas capture loop, and the
// WebSocket lifecycle. UI layer just calls start()/stop() and reads state.

import { useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectDetectionSocket,
  sendFrame,
} from "../services/detection.api";
import {
  setStatus,
  setError,
  detectionReceived,
} from "../state/detection.slice";

// Matches backend MIN_FRAME_INTERVAL_MS (200ms) — no point capturing faster
// than the server will actually process
const CAPTURE_INTERVAL_MS = 200;
const JPEG_QUALITY = 0.7; // balance bandwidth vs detection accuracy

export const useDetection = () => {
  const dispatch = useDispatch();
  const { status, error, liveBoxes, trolleyItems, justAdded } = useSelector((s) => s.detection);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);   // hidden canvas used only for frame capture
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const beepAudioRef = useRef(null); // lazily created on first beep — avoids
                                       // browsers blocking autoplay before any user gesture

  const playBeep = useCallback(() => {
    if (!beepAudioRef.current) {
      beepAudioRef.current = new Audio("/sounds/beep.mp3");
    }
    // Reset to start in case a previous beep is still finishing —
    // back-to-back detections shouldn't get silently dropped
    beepAudioRef.current.currentTime = 0;
    beepAudioRef.current.play().catch(() => {
      // Autoplay can be blocked until the user interacts with the page at least
      // once (browser policy) — clicking "Start Scanning" counts as that gesture,
      // so this should rarely fire, but we swallow it rather than crash the app
    });
  }, []);

  // Fires once per dispatch where the reducer added new item(s) to the trolley —
  // NOT on every raw detection frame, otherwise it would beep continuously
  // while an item just sits in view.
  useEffect(() => {
    if (justAdded.length > 0) {
      playBeep();
    }
  }, [justAdded, playBeep]);

  const captureAndSend = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const socket = socketRef.current;

    if (!video || !canvas || !socket || socket.readyState !== WebSocket.OPEN) return;
    if (video.readyState < 2) return; // not enough data yet

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) sendFrame(socket, blob);
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  }, []);

  const start = useCallback(async () => {
    try {
      dispatch(setStatus("connecting"));

      // 1. Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 2. Open WebSocket
      const socket = connectDetectionSocket({
        onOpen: () => {
          dispatch(setStatus("connected"));
          // 3. Start capture loop only after socket is confirmed open
          intervalRef.current = setInterval(captureAndSend, CAPTURE_INTERVAL_MS);
        },
        onDetection: (detections) => {
          dispatch(detectionReceived(detections));
        },
        onError: (message) => {
          dispatch(setError(message));
        },
        onClose: () => {
          dispatch(setStatus("idle"));
        },
      });

      socketRef.current = socket;
    } catch (err) {
      dispatch(setError(err.message || "Could not access camera"));
    }
  }, [dispatch, captureAndSend]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    dispatch(setStatus("idle"));
  }, [dispatch]);

  // Cleanup on unmount — prevents camera staying on if user navigates away
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    videoRef,
    canvasRef,
    status,
    error,
    liveBoxes,
    trolleyItems,
    start,
    stop,
  };
};