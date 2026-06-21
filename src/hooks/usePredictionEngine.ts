import { useCallback, useEffect, useRef } from 'react';
import { usePredictionStore } from '@/store/predictionStore';
import { loadModel, predict } from '@/lib/onnx/onnxEngine';
import { computeProductivityScore, computeBurnoutRisk, computeConfidence, generateRecommendations } from '@/lib/ml/predictionUtils';
import type { PredictionInput, PredictionResult } from '@/lib/constants';

export function usePredictionEngine() {
  const { inputs, setResult, setModelLoaded, setLoading, setError, addToHistory } = usePredictionStore((s) => s);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadModel()
      .then(() => setModelLoaded(true))
      .catch((err) => {
        console.warn('[DEVPULSE] Model load failed, using fallback:', err);
        setModelLoaded(true); // still allow fallback
      });
  }, [setModelLoaded]);

  const runPrediction = useCallback(
    async (inputOverrides?: Partial<PredictionInput>) => {
      const currentInputs = { ...inputs, ...inputOverrides };
      setLoading(true);
      setError(null);

      try {
        const { probability } = await predict(currentInputs);
        const result: PredictionResult = {
          successProbability: probability,
          isSuccess: probability >= 0.5,
          confidenceScore: computeConfidence(probability),
          productivityScore: computeProductivityScore(probability, currentInputs),
          burnoutRisk: computeBurnoutRisk(currentInputs),
          recommendations: generateRecommendations(currentInputs, probability),
          timestamp: Date.now(),
          inputs: { ...currentInputs },
        };

        setResult(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Prediction failed';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [inputs, setResult, setLoading, setError]
  );

  const runPredictionDebounced = useCallback(
    (inputOverrides?: Partial<PredictionInput>) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => runPrediction(inputOverrides), 150);
    },
    [runPrediction]
  );

  const savePrediction = useCallback(
    (result: PredictionResult) => {
      addToHistory(result);
    },
    [addToHistory]
  );

  return {
    runPrediction,
    runPredictionDebounced,
    savePrediction,
  };
}
