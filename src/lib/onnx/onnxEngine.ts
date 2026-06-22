import * as ort from 'onnxruntime-web';
import type { PredictionInput } from '@/lib/constants';

let session: ort.InferenceSession | null = null;
let scalerParams: { mean: number[]; scale: number[] } | null = null;

const FEATURE_ORDER = [
  'hours_coding',
  'coffee_intake_mg',
  'distractions',
  'sleep_hours',
  'commits',
  'bugs_reported',
  'ai_usage_hours',
  'cognitive_load',
] as const;

export async function loadModel(): Promise<void> {
  if (session) return;

  try {
    // Load scaler params
    const scalerResponse = await fetch('/models/scaler_params.json');
    if (scalerResponse.ok) {
      scalerParams = await scalerResponse.json();
    }

    // Load ONNX model
    session = await ort.InferenceSession.create('/models/model.onnx', {
      executionProviders: ['wasm'],
    });

    console.log('[DEVPULSE] ONNX model loaded successfully');
  } catch (error) {
    console.error('[DEVPULSE] Failed to load ONNX model:', error);
    throw error;
  }
}

function preprocessInputs(inputs: PredictionInput): Float32Array {
  const values = FEATURE_ORDER.map((key) => inputs[key]);
  const processed = new Float32Array(values.length);

  for (let i = 0; i < values.length; i++) {
    if (scalerParams) {
      processed[i] = (values[i] - scalerParams.mean[i]) / scalerParams.scale[i];
    } else {
      processed[i] = values[i];
    }
  }

  return processed;
}

let isRunning = false;

export async function predict(inputs: PredictionInput): Promise<{ probability: number; prediction: number }> {
  if (!session) {
    // Fallback: use a simple logistic regression approximation
    return fallbackPredict(inputs);
  }

  if (isRunning) {
    // Prevent ONNX WASM crash from concurrent session.run() calls during rapid slider dragging
    return fallbackPredict(inputs);
  }

  isRunning = true;

  try {
    const processed = preprocessInputs(inputs);
    const tensor = new ort.Tensor('float32', processed, [1, FEATURE_ORDER.length]);
    
    const feeds: Record<string, ort.Tensor> = {};
    const inputName = session.inputNames[0];
    feeds[inputName] = tensor;

    const results = await session.run(feeds);
    
    // Try to get probability from probabilities output
    const probOutput = results['probabilities'] || results['output_probability'] || results[session.outputNames[session.outputNames.length - 1]];
    const labelOutput = results['output_label'] || results['label'] || results[session.outputNames[0]];

    let probability = 0.5;
    let prediction = 0;

    if (probOutput) {
      const probData = probOutput.data as Float32Array;
      // Probability of class 1 (success)
      probability = probData.length > 1 ? probData[1] : probData[0];
    }

    if (labelOutput) {
      const labelData = labelOutput.data;
      prediction = Number(labelData[0]);
    } else {
      prediction = probability >= 0.5 ? 1 : 0;
    }

    return { probability, prediction };
  } catch (error) {
    console.error('[DEVPULSE] Inference error:', error);
    return fallbackPredict(inputs);
  } finally {
    isRunning = false;
  }
}

function fallbackPredict(inputs: PredictionInput): { probability: number; prediction: number } {
  // Simple logistic-regression-like fallback when ONNX model isn't available
  const weights = {
    hours_coding: 0.35,
    coffee_intake_mg: 0.001,
    distractions: -0.25,
    sleep_hours: 0.2,
    commits: 0.15,
    bugs_reported: -0.3,
    ai_usage_hours: 0.18,
    cognitive_load: -0.22,
  };
  const bias = -1.5;

  let z = bias;
  for (const key of FEATURE_ORDER) {
    z += inputs[key] * weights[key];
  }

  const probability = 1 / (1 + Math.exp(-z));
  const prediction = probability >= 0.5 ? 1 : 0;

  return { probability, prediction };
}

export function isModelLoaded(): boolean {
  return session !== null;
}
