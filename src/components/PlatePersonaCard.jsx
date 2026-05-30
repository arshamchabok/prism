import { getInitials } from '../utils/helpers.js'

function ListItems({ items }) {
  return (
    <div className="list-items">
      {items.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-bullet" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

function Tags({ items }) {
  return (
    <div className="tag-list">
      {items.map((item, i) => <span key={i} className="tag">{item}</span>)}
    </div>
  )
}

const PERSONA_BADGE = {
  'The Regular': { border: 'rgba(52,211,153,0.4)', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  'The Occasion Diner': { border: 'rgba(251,113,133,0.4)', color: '#fb7185', bg: 'rgba(251,113,133,0.08)' },
  'The Discoverer': { border: 'rgba(251,191,36,0.4)', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
}

export default function PlatePersonaCard({ persona }) {
  const {
    name, age, jobTitle, location,
    diningPersona, averageSpend,
    diningFrequency, occasionType, discoveryChannel, loyaltyDriver,
    quote, goals = [],
    messagingHook, imageReaction,
  } = persona

  const badge = PERSONA_BADGE[diningPersona] || PERSONA_BADGE['The Discoverer']

  return (
    <div className="persona-card">
      <div className="card-header">
        <div className="persona-meta">
          <div className="persona-avatar">{getInitials(name || '?')}</div>
          <div>
            <div className="persona-name">{name}</div>
            <div className="persona-title">{jobTitle}</div>
            <div className="persona-location">{location}</div>
          </div>
          <div className="persona-age-badge">{age}</div>
        </div>

        <div className="fashion-badges">
          {diningPersona && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '999px',
              border: `1px solid ${badge.border}`,
              color: badge.color,
              background: badge.bg,
            }}>
              {diningPersona}
            </span>
          )}
          {averageSpend && <span className="budget-badge">{averageSpend}</span>}
        </div>
      </div>

      <div className="card-body">
        <div className="persona-quote">&#8220;{quote}&#8221;</div>

        {goals.length > 0 && (
          <div>
            <div className="section-label">Goals &amp; Motivations</div>
            <ListItems items={goals} />
          </div>
        )}

        {(diningFrequency || occasionType) && (
          <div>
            <div className="section-label">Dining Habits</div>
            <Tags items={[diningFrequency, occasionType].filter(Boolean)} />
          </div>
        )}

        {(discoveryChannel || loyaltyDriver) && (
          <div>
            <div className="section-label">Discovery &amp; Loyalty</div>
            <Tags items={[discoveryChannel, loyaltyDriver].filter(Boolean)} />
          </div>
        )}

        {imageReaction && (
          <div className="image-reaction-box">
            <div className="section-label">Their Reaction to Your Image</div>
            <div className="image-reaction-text">{imageReaction}</div>
          </div>
        )}

        <div className="hook-box">
          <div className="section-label">Messaging Hook</div>
          <div className="hook-text">&#8220;{messagingHook}&#8221;</div>
        </div>
      </div>
    </div>
  )
}
