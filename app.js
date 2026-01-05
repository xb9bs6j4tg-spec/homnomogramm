// Nomogram logic — client-side only
const COEFF = {
  intercept: -9.079,
  b_gleason: 0.934,
  b_psa: 0.099,
  b_diam: 0.131
};

// Elements
const psaEl = document.getElementById('psa');
const diamEl = document.getElementById('diam');
const gleasonEl = document.getElementById('gleason');
const probTextEl = document.getElementById('probText');
const progressBarEl = document.getElementById('progressBar');

function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

function readInputs(){
  const psa = parseFloat(psaEl.value) || 0;
  const diam = parseFloat(diamEl.value) || 0;
  const gleason = parseInt(gleasonEl.value) || 1;
  return {psa, diam, gleason};
}

function compute(values){
  const {psa, diam, gleason} = values;
  const lp = COEFF.intercept + COEFF.b_gleason * gleason + COEFF.b_psa * psa + COEFF.b_diam * diam;
  const p = sigmoid(lp);
  return {p};
}

function updateUI(){
  const vals = readInputs();
  const {p} = compute(vals);
  const percentage = p * 100;
  probTextEl.textContent = percentage.toFixed(1) + ' %';
  progressBarEl.style.width = percentage + '%';
}

// Attach listeners
[psaEl, diamEl, gleasonEl].forEach(el => el.addEventListener('input', updateUI));

// Initialize
updateUI();
