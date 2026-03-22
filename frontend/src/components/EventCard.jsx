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

function EventCard({ event, onLikeChange, user }) {
  const collegeName = event.collegeId?.name || "Campus event";
  const collegeLocation = [event.collegeId?.city, event.collegeId?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group relative flex flex-col p-6 rounded-2xl border border-white/10 bg-[#161b22] shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-amber-500/10">
      <Link to={`/events/${event._id}`} className="contents cursor-pointer">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium tracking-wide bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-amber-200 uppercase">
            {event.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-rose-500">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
            {event.likesCount ?? 0}
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="mb-6 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date</span>
            <span className="text-sm font-semibold text-slate-200 truncate">
              {formatDate(event.eventDate)}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Time</span>
            <span className="text-sm font-semibold text-slate-200 truncate">{event.eventTime}</span>
          </div>
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 col-span-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Location</span>
            <span className="text-sm font-semibold text-slate-200 truncate" title={collegeName}>{collegeName}</span>
            {collegeLocation && (
              <span className="text-xs mt-0.5 text-slate-400 truncate" title={collegeLocation}>
                {collegeLocation}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
        {event.externalLink ? (
          <a
            className="inline-flex items-center justify-center gap-2 rounded-lg py-2 px-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            href={event.externalLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Register Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        ) : (
          <span className="text-sm italic text-slate-500">
            No link available
          </span>
        )}
        <LikeButton eventId={event._id} onLikeChange={onLikeChange} user={user} />
      </div>
    </article>
  );
}

export default EventCard;
