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
  'The Beginner':          { border: 'rgba(96,165,250,0.4)',  color: '#60a5fa', bg: 'rgba(96,165,250,0.08)'  },
  'The Committed Regular': { border: 'rgba(52,211,153,0.4)',  color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  'The Comeback':          { border: 'rgba(251,146,60,0.4)',  color: '#fb923c', bg: 'rgba(251,146,60,0.08)'  },
}

export default function FitnessPersonaCard({ persona }) {
  const {
    name, age, jobTitle, location,
    fitnessPersona, fitnessGoal, experienceLevel,
    motivationStyle, biggestObstacle, commitmentDriver,
    quote, goals = [],
    messagingHook,
  } = persona

  const badge = PERSONA_BADGE[fitnessPersona] || PERSONA_BADGE['The Comeback']

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
          {fitnessPersona && (
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
              {fitnessPersona}
            </span>
          )}
          {experienceLevel && (
            <span className="tech-level-badge">{experienceLevel}</span>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="persona-quote">&#8220;{quote}&#8221;</div>

        {fitnessGoal && (
          <div>
            <div className="section-label">Fitness Goal</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{fitnessGoal}</div>
          </div>
        )}

        {goals.length > 0 && (
          <div>
            <div className="section-label">Goals &amp; Motivations</div>
            <ListItems items={goals} />
          </div>
        )}

        {(motivationStyle || biggestObstacle) && (
          <div>
            <div className="section-label">Mindset Profile</div>
            <Tags items={[motivationStyle, biggestObstacle].filter(Boolean)} />
          </div>
        )}

        {commitmentDriver && (
          <div>
            <div className="section-label">What Keeps Them Coming Back</div>
            <div className="fitness-commitment-box">
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{commitmentDriver}</div>
            </div>
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
