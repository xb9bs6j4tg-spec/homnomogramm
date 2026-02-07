// app.js
// This file implements the exact SPSS logistic computation for two nomograms.
// It intentionally keeps the linear predictor explicit and uses p = 1/(1+exp(-logit)).

function logisticProbability(constant, terms) {
  // logit = constant + Σ(B_i × X_i)
  let logit = constant;
  for (const t of terms) {
    logit += t.b * t.x;
  }
  const p = 1.0 / (1.0 + Math.exp(-logit));
  return { logit: logit, p: p };
}

// Nomogram 1 coefficients (SPSS final step)
const NOMO1 = { constant: -9.079, bGleason: 0.934, bPsa: 0.099, bDiam: 0.131 };

// Nomogram 2 coefficients (SPSS final step)
const NOMO2 = { constant: -4.346, bPosStanzen: 0.029, bGleasonBiopsy: 0.538 };

window.addEventListener('DOMContentLoaded', () => {
  // Elements for nomogram 1
  const gleason1 = document.getElementById('gleason1');
  const psa1 = document.getElementById('psa1');
  const diam1 = document.getElementById('diam1');
  const progressBar1 = document.getElementById('progressBar1');
  const probText1 = document.getElementById('probText1');

  function updateNomo1() {
    const g = parseFloat(gleason1.value) || 0.0;
    const p = parseFloat(psa1.value) || 0.0;
    const d = parseFloat(diam1.value) || 0.0;
    const terms = [ { b: NOMO1.bGleason, x: g }, { b: NOMO1.bPsa, x: p }, { b: NOMO1.bDiam, x: d } ];
    const res = logisticProbability(NOMO1.constant, terms);
    const pct = res.p * 100.0;
    progressBar1.style.width = Math.max(0, Math.min(100, pct)) + '%';
    probText1.textContent = pct.toFixed(2) + ' %';
    // Do NOT display the internal breakdown values as per user instruction.
  }

  gleason1.addEventListener('input', updateNomo1);
  psa1.addEventListener('input', updateNomo1);
  diam1.addEventListener('input', updateNomo1);
  updateNomo1();

  // Elements for nomogram 2
  const pos2 = document.getElementById('pos2');
  const g2 = document.getElementById('g2');
  const progressBar2 = document.getElementById('progressBar2');
  const probText2 = document.getElementById('probText2');

  function updateNomo2() {
    const pos = parseFloat(pos2.value) || 0.0;
    const g = parseFloat(g2.value) || 0.0;
    const terms = [ { b: NOMO2.bPosStanzen, x: pos }, { b: NOMO2.bGleasonBiopsy, x: g } ];
    const res = logisticProbability(NOMO2.constant, terms);
    const pct = res.p * 100.0;
    progressBar2.style.width = Math.max(0, Math.min(100, pct)) + '%';
    probText2.textContent = pct.toFixed(2) + ' %';
  }

  pos2.addEventListener('input', updateNomo2);
  g2.addEventListener('input', updateNomo2);
  updateNomo2();
});
