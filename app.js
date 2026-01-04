// Default coefficients from regression table
const defaults = {
  intercept: -9.079,
  b_gleason: 0.934,
  b_psa: 0.099,
  b_diam: 0.131
};

// Local storage key
const STORAGE_KEY = 'nomogram-data-v1';

// Cache DOM elements
const inputs = {
  gleason: document.getElementById('gleason'),
  psa: document.getElementById('psa'),
  diam: document.getElementById('diam'),
  intercept: document.getElementById('intercept'),
  b_gleason: document.getElementById('b_gleason'),
  b_psa: document.getElementById('b_psa'),
  b_diam: document.getElementById('b_diam')
};

const bars = {
  gleason: document.getElementById('bar_gleason'),
  psa: document.getElementById('bar_psa'),
  diam: document.getElementById('bar_diam'),
  total: document.getElementById('bar_total')
};

const scores = {
  gleason: document.getElementById('points_gleason'),
  psa: document.getElementById('points_psa'),
  diam: document.getElementById('points_diam'),
  total: document.getElementById('points_total')
};

const probElements = {
  pct: document.getElementById('probPct'),
  bar: document.getElementById('probFill'),
  logit: document.getElementById('logitVal')
};

// Utility: save current inputs to localStorage
function saveToLocal() {
  const data = {
    gleason: inputs.gleason.value,
    psa: inputs.psa.value,
    diam: inputs.diam.value,
    intercept: inputs.intercept.value,
    b_gleason: inputs.b_gleason.value,
    b_psa: inputs.b_psa.value,
    b_diam: inputs.b_diam.value,
    savedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore localStorage errors (e.g., private mode)
    console.warn('Could not save to localStorage', e);
  }
}

// Utility: load from localStorage (returns true if loaded)
function loadFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data) return false;
    // apply values if present
    if (data.gleason !== undefined) inputs.gleason.value = data.gleason;
    if (data.psa !== undefined) inputs.psa.value = data.psa;
    if (data.diam !== undefined) inputs.diam.value = data.diam;
    if (data.intercept !== undefined) inputs.intercept.value = data.intercept;
    if (data.b_gleason !== undefined) inputs.b_gleason.value = data.b_gleason;
    if (data.b_psa !== undefined) inputs.b_psa.value = data.b_psa;
    if (data.b_diam !== undefined) inputs.b_diam.value = data.b_diam;
    return true;
  } catch (e) {
    console.warn('Could not load from localStorage', e);
    return false;
  }
}

// Attach event listeners (save on change)
Object.values(inputs).forEach(el => {
  el.addEventListener('input', () => { update(); saveToLocal(); });
});

document.getElementById('resetCoeffs').addEventListener('click', () => {
  inputs.intercept.value = defaults.intercept;
  inputs.b_gleason.value = defaults.b_gleason;
  inputs.b_psa.value = defaults.b_psa;
  inputs.b_diam.value = defaults.b_diam;
  update();
  saveToLocal();
});

// Download current inputs as JSON
document.getElementById('downloadData').addEventListener('click', () => {
  const data = {
    gleason: inputs.gleason.value,
    psa: inputs.psa.value,
    diam: inputs.diam.value,
    intercept: inputs.intercept.value,
    b_gleason: inputs.b_gleason.value,
    b_psa: inputs.b_psa.value,
    b_diam: inputs.b_diam.value,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nomogram-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Upload JSON file and apply values
document.getElementById('uploadFile').addEventListener('change', (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.gleason !== undefined) inputs.gleason.value = data.gleason;
      if (data.psa !== undefined) inputs.psa.value = data.psa;
      if (data.diam !== undefined) inputs.diam.value = data.diam;
      if (data.intercept !== undefined) inputs.intercept.value = data.intercept;
      if (data.b_gleason !== undefined) inputs.b_gleason.value = data.b_gleason;
      if (data.b_psa !== undefined) inputs.b_psa.value = data.b_psa;
      if (data.b_diam !== undefined) inputs.b_diam.value = data.b_diam;
      update();
      saveToLocal();
      // clear file input so the same file can be uploaded again if needed
      document.getElementById('uploadFile').value = '';
    } catch (e) {
      alert('Fehler beim Einlesen der JSON-Datei');
      console.error(e);
    }
  };
  reader.readAsText(file);
});

// Clear saved data (localStorage) and reset to defaults
document.getElementById('clearData').addEventListener('click', () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
  // reset inputs to defaults (but keep current user-entered data cleared)
  inputs.gleason.value = 3;
  inputs.psa.value = 10.00;
  inputs.diam.value = 12.0;
  inputs.intercept.value = defaults.intercept;
  inputs.b_gleason.value = defaults.b_gleason;
  inputs.b_psa.value = defaults.b_psa;
  inputs.b_diam.value = defaults.b_diam;
  update();
});

// Main update function
function update() {
  // Read input values
  const gleason = parseFloat(inputs.gleason.value) || 0;
  const psa = parseFloat(inputs.psa.value) || 0;
  const diam = parseFloat(inputs.diam.value) || 0;

  const intercept = parseFloat(inputs.intercept.value) || 0;
  const b_gleason = parseFloat(inputs.b_gleason.value) || 0;
  const b_psa = parseFloat(inputs.b_psa.value) || 0;
  const b_diam = parseFloat(inputs.b_diam.value) || 0;

  // Calculate contributions (logit terms)
  const contrib_gleason = b_gleason * gleason;
  const contrib_psa = b_psa * psa;
  const contrib_diam = b_diam * diam;

  // Calculate logit (log-odds)
  const logit = intercept + contrib_gleason + contrib_psa + contrib_diam;

  // Calculate probability using sigmoid
  const probability = 1 / (1 + Math.exp(-logit));

  // Scale contributions to 0-100 for visualization
  const maxLogit = Math.max(1, Math.abs(logit) + 5);
  const gleason_pct = Math.max(0, Math.min(100, (contrib_gleason / maxLogit) * 100 + 50));
  const psa_pct = Math.max(0, Math.min(100, (contrib_psa / maxLogit) * 100 + 50));
  const diam_pct = Math.max(0, Math.min(100, (contrib_diam / maxLogit) * 100 + 50));
  const logit_pct = Math.max(0, Math.min(100, (logit / maxLogit) * 100 + 50));

  // Update nomogram bars and scores
  bars.gleason.style.width = gleason_pct + '%';
  scores.gleason.textContent = contrib_gleason.toFixed(2);

  bars.psa.style.width = psa_pct + '%';
  scores.psa.textContent = contrib_psa.toFixed(2);

  bars.diam.style.width = diam_pct + '%';
  scores.diam.textContent = contrib_diam.toFixed(2);

  bars.total.style.width = logit_pct + '%';
  scores.total.textContent = logit.toFixed(2);

  // Update probability display
  const probPct = (probability * 100).toFixed(1);
  probElements.pct.textContent = probPct + '%';
  probElements.bar.style.width = (probability * 100) + '%';
  probElements.logit.textContent = logit.toFixed(3);
}

// Initialize on page load: try loading saved values, otherwise keep defaults
window.addEventListener('load', () => {
  const loaded = loadFromLocal();
  if (!loaded) {
    // ensure defaults are set (in case HTML changed)
    inputs.intercept.value = defaults.intercept;
    inputs.b_gleason.value = defaults.b_gleason;
    inputs.b_psa.value = defaults.b_psa;
    inputs.b_diam.value = defaults.b_diam;
  }
  update();
});
