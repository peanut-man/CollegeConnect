import { Link } from "react-router-dom";
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
    <article className="grid gap-4 p-5 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)] group transition-colors duration-150 hover:border-white/20 hover:bg-[rgba(10,16,29,0.85)]">
      <Link to={`/events/${event._id}`} className="contents cursor-pointer">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-orange-400/10 border border-orange-400/30 text-orange-200">
            {event.category}
          </span>
          <span className="text-sm text-[var(--color-muted)]">
            {event.likesCount ?? 0} likes
          </span>
        </div>

        <h3 className="m-0 text-xl font-semibold group-hover:text-amber-200 transition-colors">
          {event.title}
        </h3>
        <p className="m-0 text-[var(--color-muted)] line-clamp-2">
          {event.description}
        </p>

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 m-0">
          <div className="p-4 rounded-2xl bg-white/5">
            <dt className="m-0 text-[var(--color-muted)]">Date</dt>
            <dd className="m-0 mt-1 text-amber-50">
              {formatDate(event.eventDate)}
            </dd>
          </div>
          <div className="p-4 rounded-2xl bg-white/5">
            <dt className="m-0 text-[var(--color-muted)]">Time</dt>
            <dd className="m-0 mt-1 text-amber-50">{event.eventTime}</dd>
          </div>
          {showCollegeHint ? (
            <div className="p-4 rounded-2xl bg-white/5">
              <dt className="m-0 text-[var(--color-muted)]">College</dt>
              <dd className="m-0 mt-1 text-amber-50">
                {event.collegeId?.name || "Campus event"}
              </dd>
            </div>
          ) : null}
        </dl>
      </Link>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {event.externalLink ? (
          <a
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
            href={event.externalLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Open link
          </a>
        ) : (
          <span className="text-sm text-[var(--color-muted)]">
            No external link provided
          </span>
        )}
        <LikeButton eventId={event._id} onLikeChange={onLikeChange} user={user} />
      </div>
    </article>
  );
}

export default EventCard;
