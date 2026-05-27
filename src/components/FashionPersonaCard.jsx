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

export default function FashionPersonaCard({ persona }) {
  const {
    name, age, jobTitle, location,
    styleArchetype, monthlyBudget,
    quote, goals = [],
    shoppingBehavior = [], discoveryChannels = [],
    messagingHook, imageReaction
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
        <div className="fashion-badges">
          {styleArchetype && <span className="style-archetype-badge">{styleArchetype}</span>}
          {monthlyBudget && <span className="budget-badge">{monthlyBudget}</span>}
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

        {shoppingBehavior.length > 0 && (
          <div>
            <div className="section-label">Shopping Behavior</div>
            <Tags items={shoppingBehavior} />
          </div>
        )}

        {discoveryChannels.length > 0 && (
          <div>
            <div className="section-label">How They Discover Brands</div>
            <Tags items={discoveryChannels} />
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
