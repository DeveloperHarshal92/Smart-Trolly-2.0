// services/detection.service.js
// Loads the ONNX model once at startup, exposes runInference().
// This is the ONLY file in the project that touches onnxruntime-node.

import * as ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { MODEL_CONFIG } from "../config/detection.config.js";
import { decodeAndFilter } from "../utils/nms.js";

const { INPUT_WIDTH, INPUT_HEIGHT, CHANNELS } = MODEL_CONFIG;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// __dirname = backend/src/services -> up two levels -> backend/models/best.onnx
const MODEL_PATH = path.resolve(__dirname, "../../models/best.onnx");

let session = null;

export async function loadModel() {
  if (session) return;

  session = await ort.InferenceSession.create(MODEL_PATH, {
    executionProviders: ["cpu"],
    graphOptimizationLevel: "all",
  });

  console.log("[detection] ONNX model loaded from", MODEL_PATH);
}

async function preprocessImage(imageBuffer) {
  const meta = await sharp(imageBuffer).metadata();
  const origWidth = meta.width;
  const origHeight = meta.height;

  const { data } = await sharp(imageBuffer)
    .resize(INPUT_WIDTH, INPUT_HEIGHT)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = INPUT_WIDTH * INPUT_HEIGHT;
  const tensor = new Float32Array(CHANNELS * pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    tensor[0 * pixelCount + i] = data[i * 3 + 0] / 255.0;
    tensor[1 * pixelCount + i] = data[i * 3 + 1] / 255.0;
    tensor[2 * pixelCount + i] = data[i * 3 + 2] / 255.0;
  }

  return { tensor, origWidth, origHeight };
}

export async function runInference(imageBuffer) {
  if (!session) {
    throw new Error("Model not loaded. Call loadModel() at startup.");
  }

  const { tensor, origWidth, origHeight } = await preprocessImage(imageBuffer);
  const inputTensor = new ort.Tensor("float32", tensor, [1, CHANNELS, INPUT_WIDTH, INPUT_HEIGHT]);

  const results = await session.run({ images: inputTensor });
  const rawOutput = results["output0"].data;

  return decodeAndFilter(rawOutput, origWidth, origHeight);
}