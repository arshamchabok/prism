import { esc, getInitials } from '../utils/helpers.js';

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

export function renderPersonaCard(persona) {
  const { name, age, jobTitle, location, summary, quote, goals = [], painPoints = [], discoveryChannels = [], messagingHook } = persona;

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
        <div class="persona-summary">${esc(summary)}</div>
      </div>

      <div class="card-body">
        <div class="persona-quote">&ldquo;${esc(quote)}&rdquo;</div>

        ${goals.length ? `
          <div>
            <div class="section-label">Goals &amp; Motivations</div>
            <div class="list-items">${renderList(goals)}</div>
          </div>` : ''}

        ${painPoints.length ? `
          <div>
            <div class="section-label">Daily Pain Points</div>
            <div class="list-items">${renderList(painPoints)}</div>
          </div>` : ''}

        ${discoveryChannels.length ? `
          <div>
            <div class="section-label">How They Discover Products</div>
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
