import { generateFashionPersonas } from './fashion-api.js';
import { updateSessionBadge } from './components/Header.js';
import { bindInputPanel } from './components/InputPanel.js';
import { esc, getInitials, truncate } from './utils/helpers.js';

// ── State ──────────────────────────────────────────────
let sessionCount = parseInt(localStorage.getItem('prism-fashion-count') || '0');

// ── Helpers ────────────────────────────────────────────
function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hide(id) { document.getElementById(id)?.classList.add('hidden'); }

function showError(message) {
  const box = document.getElementById('error-box');
  if (box) box.textContent = `Something went wrong: ${message}`;
  show('error-box');
}

function showInput() {
  show('hero-section');
  show('input-section');
}

function hideInput() {
  hide('hero-section');
  hide('input-section');
}

// ── Card rendering ─────────────────────────────────────
function renderList(items) {
  return items.map(item => `
    <div class="list-item">
      <div class="list-bullet"></div>
      <span>${esc(item)}</span>
    </div>
  `).join('');
}

function renderTags(items) {
  return items.map(item => `<span class="tag">${esc(item)}</span>`).join('');
}

function renderFashionPersonaCard(persona) {
  const {
    name, age, jobTitle, location,
    styleArchetype, monthlyBudget,
    quote, goals = [],
    shoppingBehavior = [], discoveryChannels = [],
    messagingHook
  } = persona;

  return `
    <div class="persona-card">
      <div class="card-header">
        <div class="persona-meta">
          <div class="persona-avatar">${getInitials(name || '?')}</div>
          <div>
            <div class="persona-name">${esc(name)}</div>
            <div class="persona-title">${esc(jobTitle)}</div>
            <div class="persona-location">${esc(location)}</div>
          </div>
          <div class="persona-age-badge">${esc(String(age))}</div>
        </div>
        <div class="fashion-badges">
          ${styleArchetype ? `<span class="style-archetype-badge">${esc(styleArchetype)}</span>` : ''}
          ${monthlyBudget ? `<span class="budget-badge">${esc(monthlyBudget)}</span>` : ''}
        </div>
      </div>

      <div class="card-body">
        <div class="persona-quote">&ldquo;${esc(quote)}&rdquo;</div>

        ${goals.length ? `
          <div>
            <div class="section-label">Goals &amp; Motivations</div>
            <div class="list-items">${renderList(goals)}</div>
          </div>` : ''}

        ${shoppingBehavior.length ? `
          <div>
            <div class="section-label">Shopping Behavior</div>
            <div class="tag-list">${renderTags(shoppingBehavior)}</div>
          </div>` : ''}

        ${discoveryChannels.length ? `
          <div>
            <div class="section-label">How They Discover Brands</div>
            <div class="tag-list">${renderTags(discoveryChannels)}</div>
          </div>` : ''}

        <div class="hook-box">
          <div class="section-label">Messaging Hook</div>
          <div class="hook-text">&ldquo;${esc(messagingHook)}&rdquo;</div>
        </div>
      </div>
    </div>
  `;
}

function populateFashionResults(personas, brandInput) {
  const summaryEl = document.getElementById('product-summary-display');
  const gridEl = document.getElementById('personas-grid');
  if (summaryEl) summaryEl.textContent = truncate(brandInput);
  if (gridEl) gridEl.innerHTML = personas.map(renderFashionPersonaCard).join('');
}

// ── View transitions ───────────────────────────────────
function goToLoading() {
  hideInput();
  hide('error-box');
  hide('results-section');
  show('loading-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToResults(personas, brandInput) {
  hide('loading-section');
  populateFashionResults(personas, brandInput);
  show('results-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToReset() {
  hide('results-section');
  hide('error-box');
  showInput();
  const textarea = document.getElementById('product-input');
  const charDisplay = document.getElementById('char-display');
  const generateBtn = document.getElementById('generate-btn');
  if (textarea) textarea.value = '';
  if (charDisplay) charDisplay.textContent = '0';
  if (generateBtn) generateBtn.disabled = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Core action ────────────────────────────────────────
async function handleGenerate(brandInput) {
  goToLoading();

  try {
    const personas = await generateFashionPersonas(brandInput);

    sessionCount++;
    localStorage.setItem('prism-fashion-count', sessionCount);
    updateSessionBadge(sessionCount);

    goToResults(personas, brandInput);
  } catch (err) {
    hide('loading-section');
    showError(err.message);
    showInput();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Init ───────────────────────────────────────────────
export function initFashionApp() {
  updateSessionBadge(sessionCount);
  bindInputPanel(handleGenerate);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', goToReset);
}
