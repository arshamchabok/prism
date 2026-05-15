const STEPS = [
  'Analyzing your product space',
  'Identifying distinct buyer segments',
  'Building persona profiles',
  'Crafting messaging hooks'
];

export function renderLoadingPanel() {
  const stepHTML = STEPS.map((label, i) =>
    `<div class="loading-step" id="step-${i + 1}">${label}</div>`
  ).join('');

  return `
    <section class="loading-section hidden" id="loading-section">
      <svg class="loading-prism" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="24,4 44,40 4,40" fill="none" stroke="url(#lg2)" stroke-width="2" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="lg2" x1="4" y1="4" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="#7c6cfa"/>
            <stop offset="50%"  stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#22d3ee"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="loading-text">Refracting your audience…</div>
      <div class="loading-steps">${stepHTML}</div>
    </section>
  `;
}

export function animateLoadingSteps() {
  const ids = STEPS.map((_, i) => `step-${i + 1}`);
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active', 'done');
  });

  let current = 0;
  const interval = setInterval(() => {
    if (current > 0) {
      const prev = document.getElementById(ids[current - 1]);
      if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
    }
    if (current < ids.length) {
      const curr = document.getElementById(ids[current]);
      if (curr) curr.classList.add('active');
      current++;
    } else {
      clearInterval(interval);
    }
  }, 1400);
}
