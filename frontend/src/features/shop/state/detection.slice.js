// features/shop/state/detection.slice.js
// Owns: connection status, latest bounding boxes (for overlay), and the
// trolley item list with per-item cooldown + temporal consistency filtering.

import { createSlice } from "@reduxjs/toolkit";

// How long (ms) a class must NOT be detected before it can be auto-added again.
const RE_ADD_COOLDOWN_MS = 4000;

// A class must be seen in this many consecutive frames before it's trusted
// enough to add to the trolley. Filters out single-frame hallucinations —
// a real product sitting in frame triggers repeatedly, noise usually doesn't.
const CONSECUTIVE_FRAMES_REQUIRED = 3;

const detectionSlice = createSlice({
  name: "detection",
  initialState: {
    status: "idle",
    error: null,
    liveBoxes: [],
    trolleyItems: [],
    lastAddedAt: {},
    streakCount: {},     // { [label]: consecutive frame count }
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
      if (action.payload === "connected") state.error = null;
    },
    setError: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    detectionReceived: (state, action) => {
      const detections = action.payload;
      state.liveBoxes = detections;

      const now = Date.now();
      const seenThisFrame = new Set(detections.map((d) => d.label));

      // Reset streak for any class NOT seen this frame — must be consecutive
      for (const label of Object.keys(state.streakCount)) {
        if (!seenThisFrame.has(label)) {
          state.streakCount[label] = 0;
        }
      }

      for (const det of detections) {
        const label = det.label;
        state.streakCount[label] = (state.streakCount[label] || 0) + 1;

        const streakOk = state.streakCount[label] >= CONSECUTIVE_FRAMES_REQUIRED;
        const lastAdded = state.lastAddedAt[label];
        const offCooldown = !lastAdded || now - lastAdded > RE_ADD_COOLDOWN_MS;

        if (streakOk && offCooldown) {
          state.trolleyItems.push({ label, addedAt: now });
          state.lastAddedAt[label] = now;
          state.streakCount[label] = 0; // reset so it must re-qualify for next add
        }
      }
    },
    removeItem: (state, action) => {
      state.trolleyItems.splice(action.payload, 1);
    },
    clearTrolley: (state) => {
      state.trolleyItems = [];
      state.lastAddedAt = {};
      state.streakCount = {};
    },
  },
});

export const {
  setStatus,
  setError,
  detectionReceived,
  removeItem,
  clearTrolley,
} = detectionSlice.actions;

export default detectionSlice.reducer;