import LikeButton from "./LikeButton";

function formatDate(dateString) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

function EventCard({ event, onLikeChange, showCollegeHint, user }) {
  return (
    <article className="event-card">
      <div className="event-card-header">
        <span className="pill">{event.category}</span>
        <span className="likes-badge">{event.likesCount ?? 0} likes</span>
      </div>

      <h3>{event.title}</h3>
      <p className="event-description">{event.description}</p>

      <dl className="event-meta">
        <div>
          <dt>Date</dt>
          <dd>{formatDate(event.eventDate)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{event.eventTime}</dd>
        </div>
        {showCollegeHint ? (
          <div>
            <dt>College</dt>
            <dd>{event.collegeId?.name || "Campus event"}</dd>
          </div>
        ) : null}
      </dl>

      <div className="event-actions">
        {event.externalLink ? (
          <a
            className="ghost-button"
            href={event.externalLink}
            target="_blank"
            rel="noreferrer"
          >
            Open link
          </a>
        ) : (
          <span className="subtle-text">No external link provided</span>
        )}
        <LikeButton eventId={event._id} onLikeChange={onLikeChange} user={user} />
      </div>
    </article>
  );
}

export default EventCard;
