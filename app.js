// app.js
// THIS FILE: Implements exact SPSS-identical logistic computations for two nomograms.
// Critical note (per user instruction):
// "Dieses binär-logistische Modell verwendet ausschließlich die Regressionskoeffizienten
// (B) aus der SPSS-Tabelle 'Variablen in der Gleichung'. Die Wahrscheinlichkeitsberechnung
// ist numerisch identisch zu IBM SPSS Statistics."

function logisticProbability(constant, terms) {
  // logit = constant + Σ(B_i × X_i)
  let logit = constant;
  for (const t of terms) {
    logit += t.b * t.x;
  }
  // p = 1 / (1 + exp(-logit))
  const p = 1.0 / (1.0 + Math.exp(-logit));
  return { logit: logit, p: p };
}

// --- Nomogramm 1 coefficients (from SPSS image, final step):
// Konstante = -9.079
// B(Gleason grade group) = 0.934
// B(preoperative PSA [ng/ml]) = 0.099
// B(maximum lesion diameter [mm]) = 0.131
const NOMO1 = {
  constant: -9.079,
  bGleason: 0.934,
  bPsa: 0.099,
  bDiam: 0.131
};

// --- Nomogramm 2 coefficients (from SPSS image, final step):
// Konstante = -4.346
// B(Anteil positiver Stanzen [%]) = 0.029
// B(Gleason-Score bei Biopsie) = 0.538
const NOMO2 = {
  constant: -4.346,
  bPosStanzen: 0.029,
  bGleasonBiopsy: 0.538
};

window.addEventListener('DOMContentLoaded', () => {
  // Nomogram 1
  const g1 = document.getElementById('g1');
  const psa1 = document.getElementById('psa1');
  const diam1 = document.getElementById('diam1');
  const calc1 = document.getElementById('calc1');
  const result1 = document.getElementById('result1');
  const break1 = document.getElementById('break1');

  calc1.addEventListener('click', () => {
    const gleason = parseFloat(g1.value) || 0.0;
    const psa = parseFloat(psa1.value) || 0.0;
    const diam = parseFloat(diam1.value) || 0.0;

    const terms = [
      { b: NOMO1.bGleason, x: gleason },
      { b: NOMO1.bPsa, x: psa },
      { b: NOMO1.bDiam, x: diam }
    ];

    const res = logisticProbability(NOMO1.constant, terms);
    result1.textContent = `Probability: ${(res.p * 100).toFixed(4)} %`;
    break1.textContent = `constant: ${NOMO1.constant}\n` +
      `term_gleason: ${ (NOMO1.bGleason * gleason).toFixed(6) }\n` +
      `term_preop_psa: ${ (NOMO1.bPsa * psa).toFixed(6) }\n` +
      `term_max_lesion_diameter: ${ (NOMO1.bDiam * diam).toFixed(6) }\n` +
      `logit: ${ res.logit.toFixed(6) }`;
  });

  // Nomogram 2
  const pos2 = document.getElementById('pos2');
  const g2 = document.getElementById('g2');
  const calc2 = document.getElementById('calc2');
  const result2 = document.getElementById('result2');
  const break2 = document.getElementById('break2');

  calc2.addEventListener('click', () => {
    const pos = parseFloat(pos2.value) || 0.0;
    const gleasonBi = parseFloat(g2.value) || 0.0;

    const terms = [
      { b: NOMO2.bPosStanzen, x: pos },
      { b: NOMO2.bGleasonBiopsy, x: gleasonBi }
    ];

    const res = logisticProbability(NOMO2.constant, terms);
    result2.textContent = `Probability: ${(res.p * 100).toFixed(4)} %`;
    break2.textContent = `constant: ${NOMO2.constant}\n` +
      `term_pos_stanzen: ${ (NOMO2.bPosStanzen * pos).toFixed(6) }\n` +
      `term_gleason_biopsy: ${ (NOMO2.bGleasonBiopsy * gleasonBi).toFixed(6) }\n` +
      `logit: ${ res.logit.toFixed(6) }`;
  });

  // Optional: compute initial values
  calc1.click();
  calc2.click();
});
