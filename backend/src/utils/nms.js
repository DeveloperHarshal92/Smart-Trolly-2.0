// nms.js
// Manual Non-Max Suppression — required because model was exported with end2end: false.
// Input:  raw output tensor [1, 9, 1029] from onnxruntime
// Output: filtered array of Detection objects

import { MODEL_CONFIG } from "./detection.config.js";

const {
  NUM_ANCHORS,
  VECTOR_SIZE,
  CLASS_OFFSET,
  NUM_CLASSES,
  CLASS_NAMES,
  CONFIDENCE_THRESHOLD,
  IOU_THRESHOLD,
} = MODEL_CONFIG;

/**
 * @typedef {Object} Detection
 * @property {string} label      - class name e.g. "parle_g"
 * @property {number} classIndex - 0–4
 * @property {number} confidence - 0–1
 * @property {Object} bbox       - { cx, cy, w, h } normalized 0–1
 * @property {Object} bboxPixel  - { x1, y1, x2, y2 } in original image pixels
 */

/**
 * Convert model output tensor → filtered Detection[].
 *
 * @param {Float32Array} rawOutput  - flat array from ort session, length 1 * 9 * 1029
 * @param {number} origWidth        - original frame width before resize
 * @param {number} origHeight       - original frame height before resize
 * @returns {Detection[]}
 */
export function decodeAndFilter(rawOutput, origWidth, origHeight) {
  const candidates = [];

  for (let a = 0; a < NUM_ANCHORS; a++) {
    // Output layout is [batch, vector, anchor] — iterate across anchors
    const base = a; // index into the flattened [1, 9, 1029] tensor

    // Extract bbox (cx, cy, w, h) — stored at rows 0–3 across anchor dimension
    const cx = rawOutput[0 * NUM_ANCHORS + base];
    const cy = rawOutput[1 * NUM_ANCHORS + base];
    const w  = rawOutput[2 * NUM_ANCHORS + base];
    const h  = rawOutput[3 * NUM_ANCHORS + base];

    // Extract class scores (rows 4–8) and find argmax
    let maxScore = -Infinity;
    let classIndex = -1;

    for (let c = 0; c < NUM_CLASSES; c++) {
      const score = rawOutput[(CLASS_OFFSET + c) * NUM_ANCHORS + base];
      if (score > maxScore) {
        maxScore = score;
        classIndex = c;
      }
    }

    if (maxScore < CONFIDENCE_THRESHOLD) continue;

    // Scale normalized coords back to original image dimensions
    const x1 = (cx - w / 2) * origWidth;
    const y1 = (cy - h / 2) * origHeight;
    const x2 = (cx + w / 2) * origWidth;
    const y2 = (cy + h / 2) * origHeight;

    candidates.push({
      label: CLASS_NAMES[classIndex],
      classIndex,
      confidence: maxScore,
      bbox: { cx, cy, w, h },
      bboxPixel: {
        x1: Math.max(0, x1),
        y1: Math.max(0, y1),
        x2: Math.min(origWidth,  x2),
        y2: Math.min(origHeight, y2),
      },
    });
  }

  // Sort by confidence descending before NMS
  candidates.sort((a, b) => b.confidence - a.confidence);

  return nonMaxSuppression(candidates);
}

/**
 * IoU (Intersection over Union) between two pixel bboxes.
 */
function computeIoU(a, b) {
  const interX1 = Math.max(a.x1, b.x1);
  const interY1 = Math.max(a.y1, b.y1);
  const interX2 = Math.min(a.x2, b.x2);
  const interY2 = Math.min(a.y2, b.y2);

  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const interArea = interW * interH;

  if (interArea === 0) return 0;

  const aArea = (a.x2 - a.x1) * (a.y2 - a.y1);
  const bArea = (b.x2 - b.x1) * (b.y2 - b.y1);

  return interArea / (aArea + bArea - interArea);
}

/**
 * Greedy NMS — class-agnostic (suppresses across all classes).
 * Candidates must be sorted by confidence descending before calling.
 */
function nonMaxSuppression(candidates) {
  const kept = [];
  const suppressed = new Set();

  for (let i = 0; i < candidates.length; i++) {
    if (suppressed.has(i)) continue;

    kept.push(candidates[i]);

    for (let j = i + 1; j < candidates.length; j++) {
      if (suppressed.has(j)) continue;
      const iou = computeIoU(candidates[i].bboxPixel, candidates[j].bboxPixel);
      if (iou > IOU_THRESHOLD) suppressed.add(j);
    }
  }

  return kept;
}