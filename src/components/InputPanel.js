const EXAMPLES = [
  {
    label: 'Meal kit delivery',
    text: 'A meal kit delivery service targeting busy families who want to cook healthy dinners at home without the hassle of grocery shopping'
  },
  {
    label: 'B2B project management',
    text: 'A B2B project management platform built for remote software engineering teams who need real-time collaboration across time zones'
  },
  {
    label: 'First-time homebuyer app',
    text: 'A mobile app that helps first-time homebuyers understand the mortgage process, compare loan options, and track their application status'
  },
  {
    label: 'Freelance design marketplace',
    text: 'An online marketplace connecting independent graphic designers with small business owners who need affordable brand identity work'
  }
];

export function renderInputPanel() {
  const pills = EXAMPLES.map(e =>
    `<button class="example-pill" data-example="${e.text}">${e.label}</button>`
  ).join('');

  return `
    <section class="input-section" id="input-section">
      <div class="input-card">
        <textarea
          id="product-input"
          placeholder="Describe your product or service… e.g. &ldquo;A SaaS tool that helps freelancers send invoices and track payments automatically&rdquo;"
          maxlength="800"
        ></textarea>
        <div class="input-footer">
          <span class="char-count"><span id="char-display">0</span> / 800</span>
          <button class="generate-btn" id="generate-btn" disabled>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
      <div class="examples-row">
        <span class="examples-row-label">Try:</span>
        ${pills}
      </div>
    </section>
  `;
}

export function bindInputPanel(onGenerate) {
  const textarea   = document.getElementById('product-input');
  const charDisplay = document.getElementById('char-display');
  const generateBtn = document.getElementById('generate-btn');

  textarea.addEventListener('input', () => {
    charDisplay.textContent = textarea.value.length;
    generateBtn.disabled = textarea.value.trim().length < 10;
  });

  document.querySelectorAll('.example-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      textarea.value = pill.dataset.example;
      charDisplay.textContent = textarea.value.length;
      generateBtn.disabled = false;
      textarea.focus();
    });
  });

  generateBtn.addEventListener('click', () => {
    const value = textarea.value.trim();
    if (value.length >= 10) onGenerate(value);
  });
}
