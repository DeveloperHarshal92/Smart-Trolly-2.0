// detection.config.js
// Single source of truth for all model constants.
// If you retrain with more classes or a different image size, change it here only.

export const MODEL_CONFIG = {
  // Input
  INPUT_WIDTH: 224,
  INPUT_HEIGHT: 224,
  CHANNELS: 3,

  // Output tensor shape: [1, 9, 1029]
  NUM_ANCHORS: 1029,       // total anchor proposals
  VECTOR_SIZE: 9,          // 4 bbox + 5 class scores

  // Bbox slice: output[0:4] = cx, cy, w, h (normalized 0–1)
  BBOX_OFFSET: 0,
  BBOX_SIZE: 4,

  // Class scores slice: output[4:9]
  CLASS_OFFSET: 4,
  NUM_CLASSES: 5,

  // Class index → label (from model metadata)
  CLASS_NAMES: {
    0: "parle_g",
    1: "good_day",
    2: "colgate",
    3: "dairy_milk",
    4: "parachute",
  },

  // Prices (₹) — consumed by billing module
  CLASS_PRICES: {
    parle_g:   10,
    good_day:  10,
    colgate:   20,
    dairy_milk: 5,
    parachute: 15,
  },

  // Inference thresholds
  CONFIDENCE_THRESHOLD: 0.70,  // min class score to keep a detection
  IOU_THRESHOLD: 0.45,        // NMS: suppress boxes overlapping more than this
};