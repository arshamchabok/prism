import { renderPersonaCard } from './PersonaCard.js';
import { truncate } from '../utils/helpers.js';

export function renderResultsPanel() {
  return `
    <section class="results-section hidden" id="results-section">
      <div class="results-header">
        <div>
          <div class="results-title">Your Customer Personas</div>
          <div class="results-subtitle">Generated for: <em id="product-summary-display"></em></div>
        </div>
        <button class="reset-btn" id="reset-btn">← New product</button>
      </div>
      <div class="personas-grid" id="personas-grid"></div>
    </section>
  `;
}

export function populateResults(personas, productInput) {
  const summaryEl = document.getElementById('product-summary-display');
  const gridEl = document.getElementById('personas-grid');

  if (summaryEl) summaryEl.textContent = truncate(productInput);
  if (gridEl) gridEl.innerHTML = personas.map(renderPersonaCard).join('');
}
