// detection.service.js
// Loads the ONNX model once at startup, exposes runInference().
// This is the only file in the project that touches onnxruntime-node.

import * as ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { MODEL_CONFIG } from "./detection.config.js";
import { decodeAndFilter } from "./nms.js";

const { INPUT_WIDTH, INPUT_HEIGHT, CHANNELS, NUM_ANCHORS, VECTOR_SIZE } = MODEL_CONFIG;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL_PATH = path.resolve(__dirname, "../models/best.onnx");

// Session is created once and reused — ort session init is expensive (~200ms)
let session = null;

/**
 * Call once at server startup (in app.js / server.js).
 * Throws if the model file is missing or malformed.
 */
export async function loadModel() {
  if (session) return; // already loaded

  session = await ort.InferenceSession.create(MODEL_PATH, {
    executionProviders: ["cpu"], // swap to "cuda" if GPU is available
    graphOptimizationLevel: "all",
  });

  console.log("[detection] ONNX model loaded from", MODEL_PATH);
}

/**
 * Preprocess a raw image buffer → Float32Array ready for the model.
 * Steps: resize to 224×224 → normalize to [0,1] → HWC → CHW
 *
 * @param {Buffer} imageBuffer - raw JPEG/PNG buffer (e.g. from multer or WebSocket frame)
 * @returns {{ tensor: Float32Array, origWidth: number, origHeight: number }}
 */
async function preprocessImage(imageBuffer) {
  const sharpInstance = sharp(imageBuffer);
  const meta = await sharpInstance.metadata();

  const origWidth  = meta.width;
  const origHeight = meta.height;

  // Resize and get raw RGB pixels (no alpha channel)
  const { data } = await sharp(imageBuffer)
    .resize(INPUT_WIDTH, INPUT_HEIGHT)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert HWC uint8 [0,255] → CHW float32 [0,1]
  const pixelCount = INPUT_WIDTH * INPUT_HEIGHT;
  const tensor = new Float32Array(CHANNELS * pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    tensor[0 * pixelCount + i] = data[i * 3 + 0] / 255.0; // R channel
    tensor[1 * pixelCount + i] = data[i * 3 + 1] / 255.0; // G channel
    tensor[2 * pixelCount + i] = data[i * 3 + 2] / 255.0; // B channel
  }

  return { tensor, origWidth, origHeight };
}

/**
 * Run full inference pipeline on a single image buffer.
 *
 * @param {Buffer} imageBuffer
 * @returns {Promise<import("./nms.js").Detection[]>}
 */
export async function runInference(imageBuffer) {
  if (!session) {
    throw new Error("Model not loaded. Call loadModel() at startup.");
  }

  const { tensor, origWidth, origHeight } = await preprocessImage(imageBuffer);

  // Wrap in ort.Tensor — shape must match model input exactly
  const inputTensor = new ort.Tensor("float32", tensor, [1, CHANNELS, INPUT_WIDTH, INPUT_HEIGHT]);

  const feeds = { images: inputTensor };
  const results = await session.run(feeds);

  // rawOutput is Float32Array, shape [1, 9, 1029] flattened to length 9261
  const rawOutput = results["output0"].data;

  return decodeAndFilter(rawOutput, origWidth, origHeight);
}