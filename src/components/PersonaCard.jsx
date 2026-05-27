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

export default function PersonaCard({ persona }) {
  const {
    name, age, jobTitle, location, summary, quote,
    goals = [], painPoints = [], discoveryChannels = [], messagingHook
  } = persona

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
        <div className="persona-summary">{summary}</div>
      </div>

      <div className="card-body">
        <div className="persona-quote">&#8220;{quote}&#8221;</div>

        {goals.length > 0 && (
          <div>
            <div className="section-label">Goals &amp; Motivations</div>
            <ListItems items={goals} />
          </div>
        )}

        {painPoints.length > 0 && (
          <div>
            <div className="section-label">Daily Pain Points</div>
            <ListItems items={painPoints} />
          </div>
        )}

        {discoveryChannels.length > 0 && (
          <div>
            <div className="section-label">How They Discover Products</div>
            <Tags items={discoveryChannels} />
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
