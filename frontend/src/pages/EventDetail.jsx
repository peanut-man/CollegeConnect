import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import LikeButton from "../components/LikeButton";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function formatDate(dateString) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

function fetchEvent(eventId, signal) {
  return api.get(`/events/${eventId}`, { signal }).then((res) => res.data);
}

function EventDetail() {
  const { eventId } = useParams();
  const { user } = useAuth();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ signal }) => fetchEvent(eventId, signal),
    select: (data) => data.event ?? data.data ?? data,
  });

  if (isLoading) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="text-[var(--color-muted)]">Loading event...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          {error.response?.data?.message || "Unable to load event."}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px mt-4"
        >
          Back to events
        </Link>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          Event not found.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px mt-4"
        >
          Back to events
        </Link>
      </section>
    );
  }

  function handleLikeChange() {
    refetch();
  }

  return (
    <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
      <Link
        to="/events"
        className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px mb-4"
      >
        &larr; Back to events
      </Link>

      <article className="max-w-3xl">
        <header className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-orange-400/10 border border-orange-400/30 text-orange-200">
            {event.category}
          </span>
          <span className="text-sm text-[var(--color-muted)]">
            {event.likesCount ?? 0} likes
          </span>
        </header>

        <h1 className="my-2 mb-4 text-2xl md:text-3xl lg:text-4xl font-bold">
          {event.title}
        </h1>

        <p className="m-0 text-[var(--color-muted)]">{event.description}</p>

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 m-0 mt-6">
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
          {event.collegeId?.name && (
            <div className="p-4 rounded-2xl bg-white/5">
              <dt className="m-0 text-[var(--color-muted)]">College</dt>
              <dd className="m-0 mt-1 text-amber-50">{event.collegeId.name}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-center gap-3 flex-wrap mt-6">
          {event.externalLink ? (
            <a
              className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px"
              href={event.externalLink}
              target="_blank"
              rel="noreferrer"
            >
              Open external link
            </a>
          ) : (
            <span className="text-[var(--color-muted)]">
              No external link provided
            </span>
          )}
          <LikeButton
            eventId={event._id}
            onLikeChange={handleLikeChange}
            user={user}
          />
        </div>
      </article>
    </section>
  );
}

export default EventDetail;
