import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PredictionInput, PredictionResult } from '@/lib/constants';
import { FEATURES, STORAGE_KEYS } from '@/lib/constants';

interface PredictionState {
  inputs: PredictionInput;
  result: PredictionResult | null;
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  history: PredictionResult[];
  
  setInput: (key: keyof PredictionInput, value: number) => void;
  setInputs: (inputs: PredictionInput) => void;
  setResult: (result: PredictionResult) => void;
  setModelLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (result: PredictionResult) => void;
  clearHistory: () => void;
  removeFromHistory: (timestamp: number) => void;
}

const defaultInputs: PredictionInput = Object.fromEntries(
  FEATURES.map((f) => [f.key, f.default])
) as unknown as PredictionInput;

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      inputs: defaultInputs,
      result: null,
      isModelLoaded: false,
      isLoading: false,
      error: null,
      history: [],

      setInput: (key, value) =>
        set((state) => ({
          inputs: { ...state.inputs, [key]: value },
        })),

      setInputs: (inputs) => set({ inputs }),

      setResult: (result) => set({ result }),

      setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 100),
        })),

      clearHistory: () => set({ history: [] }),

      removeFromHistory: (timestamp) =>
        set((state) => ({
          history: state.history.filter((r) => r.timestamp !== timestamp),
        })),
    }),
    {
      name: STORAGE_KEYS.PREDICTIONS,
      partialize: (state) => ({ history: state.history }),
    }
  )
);
