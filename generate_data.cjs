// Generates the full CSV dataset for public folder
const fs = require('fs');
const path = require('path');

// Seed for reproducibility
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function normal(mean, std) {
  const u1 = rand();
  const u2 = rand();
  return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function round2(v) { return Math.round(v * 100) / 100; }

const rows = [];
const header = 'hours_coding,coffee_intake_mg,distractions,sleep_hours,commits,bugs_reported,ai_usage_hours,cognitive_load,task_success';
rows.push(header);

for (let i = 0; i < 501; i++) {
  const hours_coding = round2(clamp(normal(5, 2.2), 0, 12));
  const coffee_intake_mg = Math.round(clamp(normal(450, 160), 0, 600));
  const distractions = Math.round(clamp(normal(3, 1.8), 0, 8));
  const sleep_hours = round2(clamp(normal(7, 1.5), 3, 10));
  const commits = Math.round(clamp(normal(4.5, 3), 0, 15));
  const bugs_reported = Math.round(clamp(normal(1, 1.3), 0, 5));
  const ai_usage_hours = round2(clamp(normal(1.4, 1.2), 0, 6.5));
  const cognitive_load = round2(clamp(normal(4.5, 2), 1, 10));

  // Success probability influenced by features
  const z = 0.35 * hours_coding 
    + 0.001 * coffee_intake_mg 
    - 0.25 * distractions 
    + 0.2 * sleep_hours 
    + 0.15 * commits 
    - 0.3 * bugs_reported 
    + 0.18 * ai_usage_hours 
    - 0.22 * cognitive_load 
    - 1.5;
  
  const prob = 1 / (1 + Math.exp(-z));
  const noise = (rand() - 0.5) * 0.3;
  const task_success = (prob + noise) > 0.5 ? 1 : 0;

  rows.push(`${hours_coding},${coffee_intake_mg},${distractions},${sleep_hours},${commits},${bugs_reported},${ai_usage_hours},${cognitive_load},${task_success}`);
}

fs.writeFileSync(path.join(__dirname, 'public', 'ai_dev_productivity.csv'), rows.join('\n'));
console.log(`Generated ${rows.length - 1} records`);
