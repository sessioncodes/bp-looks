import { FilesetResolver, FaceLandmarker, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const FACE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const HAIR_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite';

let visionP, faceP, hairP;

const vision = () => (visionP ??= FilesetResolver.forVisionTasks(WASM));

// Try the GPU delegate first, fall back to CPU (iOS Safari can be picky).
async function withFallback(create) {
  try {
    return await create('GPU');
  } catch {
    return await create('CPU');
  }
}

export function getFaceLandmarker() {
  return (faceP ??= vision().then((v) =>
    withFallback((delegate) =>
      FaceLandmarker.createFromOptions(v, {
        baseOptions: { modelAssetPath: FACE_MODEL, delegate },
        runningMode: 'IMAGE',
        numFaces: 1,
      })
    )
  ));
}

export function getHairSegmenter() {
  return (hairP ??= vision().then((v) =>
    withFallback((delegate) =>
      ImageSegmenter.createFromOptions(v, {
        baseOptions: { modelAssetPath: HAIR_MODEL, delegate },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      })
    )
  ));
}

export function preload() {
  getFaceLandmarker().catch(() => {});
}
