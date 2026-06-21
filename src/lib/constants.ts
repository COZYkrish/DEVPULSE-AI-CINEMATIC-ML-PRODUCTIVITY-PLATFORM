// ============================================
// DEVPULSE AI — Design System Constants
// ============================================

export const COLORS = {
  primary: '#00E5FF',
  secondary: '#7C3AED',
  accent: '#22D3EE',
  background: '#050816',
  surface: '#0F172A',
  surfaceLight: '#1E293B',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
} as const;

export const THREE_COLORS = {
  primary: 0x00E5FF,
  secondary: 0x7C3AED,
  accent: 0x22D3EE,
  background: 0x050816,
  surface: 0x0F172A,
  success: 0x10B981,
  warning: 0xF59E0B,
  danger: 0xEF4444,
} as const;

export const FEATURES = [
  { key: 'hours_coding', label: 'Hours Coding', min: 0, max: 12, step: 0.1, default: 5, unit: 'hrs', icon: 'Code2', description: 'Daily coding hours' },
  { key: 'coffee_intake_mg', label: 'Coffee Intake', min: 0, max: 600, step: 10, default: 400, unit: 'mg', icon: 'Coffee', description: 'Daily caffeine consumption' },
  { key: 'distractions', label: 'Distractions', min: 0, max: 10, step: 1, default: 3, unit: '', icon: 'Bell', description: 'Number of daily interruptions' },
  { key: 'sleep_hours', label: 'Sleep Hours', min: 0, max: 12, step: 0.1, default: 7, unit: 'hrs', icon: 'Moon', description: 'Hours of sleep last night' },
  { key: 'commits', label: 'Commits', min: 0, max: 15, step: 1, default: 5, unit: '', icon: 'GitCommit', description: 'Git commits today' },
  { key: 'bugs_reported', label: 'Bugs Reported', min: 0, max: 10, step: 1, default: 1, unit: '', icon: 'Bug', description: 'Bugs reported today' },
  { key: 'ai_usage_hours', label: 'AI Usage', min: 0, max: 8, step: 0.1, default: 1.5, unit: 'hrs', icon: 'Brain', description: 'Hours using AI tools' },
  { key: 'cognitive_load', label: 'Cognitive Load', min: 0, max: 10, step: 0.1, default: 4, unit: '/10', icon: 'Activity', description: 'Mental fatigue level' },
] as const;

export type FeatureKey = typeof FEATURES[number]['key'];

export interface PredictionInput {
  hours_coding: number;
  coffee_intake_mg: number;
  distractions: number;
  sleep_hours: number;
  commits: number;
  bugs_reported: number;
  ai_usage_hours: number;
  cognitive_load: number;
}

export interface PredictionResult {
  successProbability: number;
  isSuccess: boolean;
  confidenceScore: number;
  productivityScore: number;
  burnoutRisk: number;
  recommendations: Recommendation[];
  timestamp: number;
  inputs: PredictionInput;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  category: 'sleep' | 'focus' | 'health' | 'workflow' | 'ai';
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  isBest: boolean;
}

export const ROUTES = [
  { path: '/', label: 'Home', icon: 'Home' },
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/model-arena', label: 'Model Arena', icon: 'Trophy' },
  { path: '/ai-insights', label: 'AI Insights', icon: 'Brain' },
  { path: '/developer-lab', label: 'Developer Lab', icon: 'FlaskConical' },
  { path: '/data-explorer', label: 'Data Explorer', icon: 'Database' },
  { path: '/history', label: 'History', icon: 'History' },
  { path: '/about', label: 'About', icon: 'Info' },
] as const;

export const PRESETS: Record<string, PredictionInput> = {
  'Ideal Developer': {
    hours_coding: 6,
    coffee_intake_mg: 300,
    distractions: 1,
    sleep_hours: 8,
    commits: 7,
    bugs_reported: 0,
    ai_usage_hours: 2,
    cognitive_load: 3,
  },
  'Burnout Risk': {
    hours_coding: 10,
    coffee_intake_mg: 600,
    distractions: 7,
    sleep_hours: 4,
    commits: 12,
    bugs_reported: 5,
    ai_usage_hours: 1,
    cognitive_load: 9,
  },
  'Night Owl': {
    hours_coding: 7,
    coffee_intake_mg: 500,
    distractions: 2,
    sleep_hours: 5,
    commits: 6,
    bugs_reported: 2,
    ai_usage_hours: 3,
    cognitive_load: 6,
  },
  'Balanced': {
    hours_coding: 5,
    coffee_intake_mg: 400,
    distractions: 3,
    sleep_hours: 7,
    commits: 4,
    bugs_reported: 1,
    ai_usage_hours: 1.5,
    cognitive_load: 4,
  },
  'Junior Dev': {
    hours_coding: 3,
    coffee_intake_mg: 200,
    distractions: 5,
    sleep_hours: 7,
    commits: 2,
    bugs_reported: 3,
    ai_usage_hours: 0.5,
    cognitive_load: 7,
  },
};

export const APP_NAME = 'DEVPULSE AI';
export const APP_TAGLINE = 'Predict Developer Productivity. Understand Success. Optimize Performance.';
export const STORAGE_KEYS = {
  PREDICTIONS: 'devpulse_predictions',
  SETTINGS: 'devpulse_settings',
  THEME: 'devpulse_theme',
} as const;
