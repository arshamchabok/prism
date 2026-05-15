export function renderHeader(sessionCount) {
  return `
    <header>
      <div class="logo">
        <svg class="logo-prism" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="14,2 26,22 2,22" fill="none" stroke="url(#prism-grad)" stroke-width="1.5" stroke-linejoin="round"/>
          <line x1="14" y1="2" x2="14" y2="22" stroke="rgba(124,108,250,0.3)" stroke-width="1"/>
          <line x1="14" y1="22" x2="4"  y2="10" stroke="rgba(192,132,252,0.3)" stroke-width="1"/>
          <line x1="14" y1="22" x2="24" y2="10" stroke="rgba(34,211,238,0.3)"  stroke-width="1"/>
          <defs>
            <linearGradient id="prism-grad" x1="2" y1="2" x2="26" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stop-color="#7c6cfa"/>
              <stop offset="100%" stop-color="#22d3ee"/>
            </linearGradient>
          </defs>
        </svg>
        Prism
        <span class="logo-tag">Beta</span>
      </div>
      <div class="header-right">
        <span class="badge-count" id="session-count">
          ${sessionCount > 0 ? `${sessionCount} persona set${sessionCount > 1 ? 's' : ''} generated` : ''}
        </span>
      </div>
    </header>
  `;
}

export function updateSessionBadge(count) {
  const el = document.getElementById('session-count');
  if (el) el.textContent = count > 0 ? `${count} persona set${count > 1 ? 's' : ''} generated` : '';
}
