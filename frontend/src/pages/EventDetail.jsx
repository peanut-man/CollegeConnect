import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const canModify =
    user &&
    (user.role === "Admin" ||
      (event?.organizerId &&
        (event.organizerId._id === user._id || event.organizerId === user._id)));

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/events/${eventId}`);
      navigate("/events", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  function handleLikeChange(id, delta) {
    queryClient.setQueryData(["event", eventId], (current) => {
      if (!current) return current;
      if (current.data) {
        return {
          ...current,
          data: {
            ...current.data,
            likesCount: Math.max(0, (current.data.likesCount ?? 0) + delta),
          },
        };
      }
      if (current.event) {
        return {
          ...current,
          event: {
            ...current.event,
            likesCount: Math.max(0, (current.event.likesCount ?? 0) + delta),
          },
        };
      }
      return {
        ...current,
        likesCount: Math.max(0, (current.likesCount ?? 0) + delta),
      };
    });
  }

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

  const collegeName = event.collegeId?.name || "Unknown College";
  const collegeLocation = [event.collegeId?.city, event.collegeId?.state]
    .filter(Boolean)
    .join(", ");
  const organizerName = event.organizerId?.name || "Unknown Organizer";

  return (
    <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-[#161b22] shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap relative z-10">
        <Link
          to="/events"
          className="inline-flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-sm font-medium transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to events
        </Link>

        {canModify && (
          <div className="flex gap-3 relative z-10">
            <Link
              to={`/events/${eventId}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl py-2 px-4 transition-all duration-200 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2.695 14.763l-1.262 3.155a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343zM15 3.5l1.5 1.5-10.5 10.5-1.5-1.5L15 3.5z" />
              </svg>
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl py-2 px-4 transition-all duration-200 border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <article className="max-w-4xl relative z-10">
        <header className="flex items-center gap-4 flex-wrap mb-4">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-amber-200 uppercase">
            {event.category}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400 border border-white/5 bg-white/5 py-1 px-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-rose-500">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
            {event.likesCount ?? 0} likes
          </div>
        </header>

        <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
          {event.title}
        </h1>

        <div className="prose prose-invert max-w-none mb-10">
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {event.description}
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <dt className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Date
            </dt>
            <dd className="text-sm md:text-base font-semibold text-slate-100">
              {formatDate(event.eventDate)}
            </dd>
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <dt className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time
            </dt>
            <dd className="text-sm md:text-base font-semibold text-slate-100">{event.eventTime}</dd>
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <dt className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              College
            </dt>
            <dd className="text-sm md:text-base font-semibold text-slate-100">{collegeName}</dd>
            {collegeLocation && (
              <dd className="mt-1 text-xs text-slate-400">
                {collegeLocation}
              </dd>
            )}
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <dt className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Organizer
            </dt>
            <dd className="text-sm md:text-base font-semibold text-slate-100">{organizerName}</dd>
          </div>
        </dl>

        <div className="flex items-center gap-4 flex-wrap pt-6 border-t border-white/10">
          {event.externalLink ? (
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 transition-all duration-200 border border-transparent font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
              href={event.externalLink}
              target="_blank"
              rel="noreferrer"
            >
              <span>Register / Open Link</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 cursor-pointer">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          ) : (
            <span className="text-sm italic text-slate-500">
              No external link provided
            </span>
          )}
          <div className="ml-auto">
            <LikeButton
              eventId={event._id}
              onLikeChange={handleLikeChange}
              user={user}
            />
          </div>
        </div>
      </article>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </section>
  );
}

export default EventDetail;
