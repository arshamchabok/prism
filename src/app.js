import { generatePersonas } from './api.js';
import { updateSessionBadge } from './components/Header.js';
import { bindInputPanel } from './components/InputPanel.js';
import { populateResults } from './components/ResultsPanel.js';

// ── State ──────────────────────────────────────────────
let sessionCount = parseInt(localStorage.getItem('prism-count') || '0');

// ── Helpers ────────────────────────────────────────────
function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hide(id) { document.getElementById(id)?.classList.add('hidden'); }

function showError(message) {
  const box = document.getElementById('error-box');
  if (box) box.textContent = `Something went wrong: ${message}`;
  show('error-section');
}

function showInput() {
  show('hero-section');
  show('input-section');
}

function hideInput() {
  hide('hero-section');
  hide('input-section');
}

// ── View transitions ───────────────────────────────────
function goToLoading() {
  hideInput();
  hide('error-section');
  hide('results-section');
  show('loading-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToResults(personas, productInput) {
  hide('loading-section');
  populateResults(personas, productInput);
  show('results-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToReset() {
  hide('results-section');
  hide('error-section');
  showInput();
  // reset textarea
  const textarea = document.getElementById('product-input');
  const charDisplay = document.getElementById('char-display');
  const generateBtn = document.getElementById('generate-btn');
  if (textarea) textarea.value = '';
  if (charDisplay) charDisplay.textContent = '0';
  if (generateBtn) generateBtn.disabled = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Core action ────────────────────────────────────────
async function handleGenerate(productInput) {
  goToLoading();

  try {
    const personas = await generatePersonas(productInput);

    sessionCount++;
    localStorage.setItem('prism-count', sessionCount);
    updateSessionBadge(sessionCount);

    goToResults(personas, productInput);
  } catch (err) {
    hide('loading-section');
    showError(err.message);
    showInput();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Init ───────────────────────────────────────────────
export function initApp() {
  updateSessionBadge(sessionCount);
  bindInputPanel(handleGenerate);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', goToReset);
}
