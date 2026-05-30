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

const ROLE_CLASS = {
  'Economic Buyer': 'economic',
  'Champion': 'champion',
  'End User': 'enduser',
}

export default function DeployPersonaCard({ persona }) {
  const {
    name, age, jobTitle, location,
    buyingRole, companySize, technicalLevel, roleInBuyingDecision,
    quote, goals = [],
    adoptionBlockers = [], churnRisks = [],
    messagingHook, urlReaction,
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

        <div className="deploy-badges">
          {buyingRole && (
            <span className={`buying-role-badge ${ROLE_CLASS[buyingRole] || 'enduser'}`}>
              {buyingRole}
            </span>
          )}
          {companySize && <span className="company-size-badge">{companySize}</span>}
          {technicalLevel && <span className="tech-level-badge">{technicalLevel}</span>}
        </div>

        {roleInBuyingDecision && (
          <div className="role-decision-label">{roleInBuyingDecision}</div>
        )}
      </div>

      <div className="card-body">
        <div className="persona-quote">&#8220;{quote}&#8221;</div>

        {goals.length > 0 && (
          <div>
            <div className="section-label">Goals &amp; Motivations</div>
            <ListItems items={goals} />
          </div>
        )}

        {adoptionBlockers.length > 0 && (
          <div>
            <div className="section-label">Adoption Blockers</div>
            <Tags items={adoptionBlockers} />
          </div>
        )}

        {churnRisks.length > 0 && (
          <div>
            <div className="section-label">Churn Risks</div>
            <Tags items={churnRisks} />
          </div>
        )}

        {urlReaction && (
          <div className="url-reaction-box">
            <div className="section-label">Reaction to Your URL</div>
            <div className="url-reaction-text">{urlReaction}</div>
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
