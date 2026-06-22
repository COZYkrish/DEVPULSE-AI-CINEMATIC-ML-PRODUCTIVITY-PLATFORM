import type { PredictionInput, Recommendation } from '@/lib/constants';
import { clamp } from '@/lib/utils';

export function computeProductivityScore(probability: number, inputs: PredictionInput): number {
  const codingFactor = clamp(inputs.hours_coding / 8, 0, 1) * 25;
  const sleepFactor = clamp(inputs.sleep_hours / 8, 0, 1) * 20;
  const commitFactor = clamp(inputs.commits / 10, 0, 1) * 15;
  const focusFactor = clamp(1 - inputs.distractions / 10, 0, 1) * 15;
  const aiFactor = clamp(inputs.ai_usage_hours / 3, 0, 1) * 10;
  const bugPenalty = clamp(inputs.bugs_reported / 5, 0, 1) * 10;
  const loadPenalty = clamp(inputs.cognitive_load / 10, 0, 1) * 5;

  const rawScore = codingFactor + sleepFactor + commitFactor + focusFactor + aiFactor - bugPenalty - loadPenalty;
  const mlWeight = probability * 100 * 0.4;
  const featureWeight = rawScore * 0.6;

  return clamp(Math.round(mlWeight + featureWeight), 0, 100);
}

export function computeBurnoutRisk(inputs: PredictionInput): number {
  let risk = 0;

  if (inputs.sleep_hours < 6) risk += 25;
  else if (inputs.sleep_hours < 7) risk += 10;
  
  if (inputs.cognitive_load > 7) risk += 25;
  else if (inputs.cognitive_load > 5) risk += 10;
  
  if (inputs.hours_coding > 9) risk += 20;
  else if (inputs.hours_coding > 7) risk += 10;
  
  if (inputs.distractions > 5) risk += 15;
  else if (inputs.distractions > 3) risk += 5;
  
  if (inputs.coffee_intake_mg > 500) risk += 10;
  
  if (inputs.bugs_reported > 3) risk += 5;

  return clamp(risk, 0, 100);
}

export function computeConfidence(probability: number): number {
  return Math.abs(probability - 0.5) * 2;
}

export function generateRecommendations(inputs: PredictionInput, probability: number): Recommendation[] {
  const recs: Recommendation[] = [];

  if (inputs.sleep_hours < 7) {
    recs.push({
      title: 'Improve Sleep Quality',
      description: `You're getting ${inputs.sleep_hours}h of sleep. Aim for 7-8 hours for optimal cognitive function and productivity.`,
      icon: 'Moon',
      priority: inputs.sleep_hours < 5 ? 'high' : 'medium',
      category: 'sleep',
    });
  }

  if (inputs.cognitive_load > 6) {
    recs.push({
      title: 'Reduce Cognitive Load',
      description: `Your cognitive load is ${inputs.cognitive_load}/10. Break complex tasks into smaller chunks and take regular breaks.`,
      icon: 'Brain',
      priority: inputs.cognitive_load > 8 ? 'high' : 'medium',
      category: 'focus',
    });
  }

  if (inputs.distractions > 4) {
    recs.push({
      title: 'Minimize Distractions',
      description: `${inputs.distractions} distractions detected. Try focus blocks, DND mode, or noise-cancelling headphones.`,
      icon: 'BellOff',
      priority: inputs.distractions > 6 ? 'high' : 'medium',
      category: 'focus',
    });
  }

  if (inputs.hours_coding > 8) {
    recs.push({
      title: 'Watch for Overwork',
      description: `${inputs.hours_coding}h of coding is intensive. Ensure you're taking breaks every 90 minutes.`,
      icon: 'AlertTriangle',
      priority: 'medium',
      category: 'health',
    });
  }

  if (inputs.ai_usage_hours < 1 && inputs.hours_coding > 4) {
    recs.push({
      title: 'Leverage AI Tools',
      description: 'AI-assisted coding can boost productivity. Try using AI for boilerplate, debugging, and code review.',
      icon: 'Sparkles',
      priority: 'low',
      category: 'ai',
    });
  }

  if (inputs.coffee_intake_mg > 500) {
    recs.push({
      title: 'Monitor Caffeine',
      description: `${inputs.coffee_intake_mg}mg of caffeine is above recommended levels. Consider switching to green tea after 2pm.`,
      icon: 'Coffee',
      priority: 'low',
      category: 'health',
    });
  }

  if (inputs.bugs_reported > 3) {
    recs.push({
      title: 'Improve Code Quality',
      description: `${inputs.bugs_reported} bugs reported. Consider more thorough code reviews and automated testing.`,
      icon: 'Bug',
      priority: 'medium',
      category: 'workflow',
    });
  }

  if (inputs.commits > 10) {
    recs.push({
      title: 'Optimize Commit Strategy',
      description: `${inputs.commits} commits may indicate fragmented work. Group related changes into meaningful commits.`,
      icon: 'GitBranch',
      priority: 'low',
      category: 'workflow',
    });
  }

  if (probability < 0.5 && recs.length === 0) {
    recs.push({
      title: 'Optimize Your Workflow',
      description: 'Your current metrics suggest room for improvement. Focus on sleep, reduce distractions, and maintain consistent coding sessions.',
      icon: 'TrendingUp',
      priority: 'medium',
      category: 'workflow',
    });
  }

  // --- Positive Reinforcements ---
  
  if (inputs.sleep_hours >= 7.5) {
    recs.push({
      title: 'Optimal Rest Pattern',
      description: `Logging ${inputs.sleep_hours}h of sleep strongly correlates with lower error rates and enhanced abstract problem-solving today.`,
      icon: 'Moon',
      priority: 'low',
      category: 'sleep',
    });
  }

  if (inputs.distractions <= 2) {
    recs.push({
      title: 'Deep Work Flow',
      description: 'Minimal interruptions detected. This continuous focus state drastically reduces cognitive switching penalties.',
      icon: 'Shield',
      priority: 'low',
      category: 'focus',
    });
  }

  if (inputs.ai_usage_hours >= 1.5) {
    recs.push({
      title: 'AI Multiplier Active',
      description: 'High utilization of AI tooling is accelerating your baseline coding speed while minimizing boilerplate fatigue.',
      icon: 'Sparkles',
      priority: 'low',
      category: 'ai',
    });
  }

  if (inputs.coffee_intake_mg > 0 && inputs.coffee_intake_mg <= 300) {
    recs.push({
      title: 'Caffeine Sweet-Spot',
      description: 'Your caffeine intake is optimally balanced to provide alertness without triggering anxiety or late-day crashes.',
      icon: 'Coffee',
      priority: 'low',
      category: 'health',
    });
  }

  if (inputs.bugs_reported === 0 && inputs.commits > 0) {
    recs.push({
      title: 'Clean Code Streak',
      description: 'Zero bugs reported alongside active commits indicates exceptional code quality and thorough review practices.',
      icon: 'CheckCircle',
      priority: 'low',
      category: 'workflow',
    });
  }

  if (inputs.hours_coding >= 4 && inputs.hours_coding <= 7) {
    recs.push({
      title: 'Sustainable Rhythm',
      description: 'Your daily coding volume is in the goldilocks zone—enough for massive progress, short enough to avoid burnout.',
      icon: 'Activity',
      priority: 'low',
      category: 'health',
    });
  }

  if (probability > 0.8 && recs.length === 0) {
    recs.push({
      title: 'Great Performance!',
      description: 'Your metrics are strong. Maintain this balance for sustained productivity.',
      icon: 'Trophy',
      priority: 'low',
      category: 'workflow',
    });
  }

  return recs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
