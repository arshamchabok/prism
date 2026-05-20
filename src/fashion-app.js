import { generateFashionPersonas } from './fashion-api.js';
import { esc, getInitials, truncate } from './utils/helpers.js';

// ── State ──────────────────────────────────────────────
let uploadedImage = null; // { base64: string, mediaType: string }

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

// ── Generate button state ──────────────────────────────
function checkGenerateReady() {
  const textarea = document.getElementById('product-input');
  const generateBtn = document.getElementById('generate-btn');
  if (!generateBtn) return;
  const hasText = (textarea?.value.trim().length ?? 0) >= 5;
  generateBtn.disabled = !hasText && !uploadedImage;
}

// ── Image upload ───────────────────────────────────────
function readImageFile(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    uploadedImage = { base64: dataUrl.split(',')[1], mediaType: file.type };

    const previewImg    = document.getElementById('preview-img');
    const uploadPrompt  = document.getElementById('upload-prompt');
    const uploadPreview = document.getElementById('upload-preview');
    const uploadFilename = document.getElementById('upload-filename');

    if (previewImg)    previewImg.src = dataUrl;
    if (uploadFilename) uploadFilename.textContent = file.name;
    uploadPrompt?.classList.add('hidden');
    uploadPreview?.classList.remove('hidden');

    checkGenerateReady();
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  uploadedImage = null;

  const previewImg    = document.getElementById('preview-img');
  const uploadInput   = document.getElementById('image-upload');
  const uploadPrompt  = document.getElementById('upload-prompt');
  const uploadPreview = document.getElementById('upload-preview');

  if (previewImg)  previewImg.src = '';
  if (uploadInput) uploadInput.value = '';
  uploadPrompt?.classList.remove('hidden');
  uploadPreview?.classList.add('hidden');

  checkGenerateReady();
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
    messagingHook, imageReaction
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
          ${monthlyBudget  ? `<span class="budget-badge">${esc(monthlyBudget)}</span>` : ''}
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

        ${imageReaction ? `
          <div class="image-reaction-box">
            <div class="section-label">Their Reaction to Your Image</div>
            <div class="image-reaction-text">${esc(imageReaction)}</div>
          </div>` : ''}

        <div class="hook-box">
          <div class="section-label">Messaging Hook</div>
          <div class="hook-text">&ldquo;${esc(messagingHook)}&rdquo;</div>
        </div>
      </div>
    </div>
  `;
}

function populateFashionResults(personas, label) {
  const summaryEl = document.getElementById('product-summary-display');
  const gridEl    = document.getElementById('personas-grid');
  if (summaryEl) summaryEl.textContent = truncate(label);
  if (gridEl)    gridEl.innerHTML = personas.map(renderFashionPersonaCard).join('');
}

// ── View transitions ───────────────────────────────────
function goToLoading() {
  hideInput();
  hide('error-box');
  hide('results-section');
  show('loading-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToResults(personas, label) {
  hide('loading-section');
  populateFashionResults(personas, label);
  show('results-section');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToReset() {
  hide('results-section');
  hide('error-box');
  showInput();
  const textarea   = document.getElementById('product-input');
  const charDisplay = document.getElementById('char-display');
  if (textarea)   textarea.value = '';
  if (charDisplay) charDisplay.textContent = '0';
  clearImage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Core action ────────────────────────────────────────
async function handleGenerate(brandInput) {
  const imageToSend = uploadedImage;
  goToLoading();

  try {
    const personas = await generateFashionPersonas(brandInput, imageToSend);

    const label = brandInput || (imageToSend ? 'uploaded image' : '');
    goToResults(personas, label);
  } catch (err) {
    hide('loading-section');
    showError(err.message);
    showInput();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Input panel binding ────────────────────────────────
function bindFashionInputPanel(onGenerate) {
  const textarea    = document.getElementById('product-input');
  const charDisplay = document.getElementById('char-display');
  const generateBtn = document.getElementById('generate-btn');
  const uploadZone  = document.getElementById('upload-zone');
  const uploadInput = document.getElementById('image-upload');
  const uploadClear = document.getElementById('upload-clear');

  textarea?.addEventListener('input', () => {
    if (charDisplay) charDisplay.textContent = textarea.value.length;
    checkGenerateReady();
  });

  document.querySelectorAll('.example-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      if (textarea) {
        textarea.value = pill.dataset.example;
        if (charDisplay) charDisplay.textContent = textarea.value.length;
        textarea.focus();
      }
      checkGenerateReady();
    });
  });

  generateBtn?.addEventListener('click', () => {
    const text = textarea?.value.trim() || '';
    if (text.length >= 5 || uploadedImage) onGenerate(text);
  });

  // Click to open file picker (ignore clicks on the clear button)
  uploadZone?.addEventListener('click', (e) => {
    if (!e.target.closest('#upload-clear')) uploadInput?.click();
  });

  uploadInput?.addEventListener('change', () => {
    if (uploadInput.files[0]) readImageFile(uploadInput.files[0]);
  });

  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });
  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) readImageFile(file);
  });

  uploadClear?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearImage();
  });
}

// ── Init ───────────────────────────────────────────────
export function initFashionApp() {
  bindFashionInputPanel(handleGenerate);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', goToReset);
}
