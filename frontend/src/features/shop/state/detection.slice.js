// features/shop/state/detection.slice.js
// Owns: connection status, latest bounding boxes (for overlay), trolley items
// with cooldown + temporal consistency, and a transient "justAdded" list that
// the hook layer watches to trigger side effects (beep sound) outside the reducer.

import { createSlice } from "@reduxjs/toolkit";

const RE_ADD_COOLDOWN_MS = 4000;
const CONSECUTIVE_FRAMES_REQUIRED = 3;

const detectionSlice = createSlice({
  name: "detection",
  initialState: {
    status: "idle",
    error: null,
    liveBoxes: [],
    trolleyItems: [],
    lastAddedAt: {},
    streakCount: {},
    justAdded: [],   // labels added in the MOST RECENT dispatch only — for side effects
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
      state.justAdded = []; // reset every dispatch — only this frame's additions matter

      const now = Date.now();
      const seenThisFrame = new Set(detections.map((d) => d.label));

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
          state.streakCount[label] = 0;
          state.justAdded.push(label); // <-- hook layer watches this
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
      state.justAdded = [];
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