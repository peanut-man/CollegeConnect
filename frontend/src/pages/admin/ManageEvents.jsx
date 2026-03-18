import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

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

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const response = await api.get("/events");
      const data = response.data?.data || response.data?.events || response.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId) {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setDeleting(eventId);
    setError("");

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((current) => current.filter((e) => e._id !== eventId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="m-0 text-2xl">Manage Events</h1>
      </div>

      {error && (
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          {error}
        </p>
      )}

      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <h2 className="m-0 mb-4 text-xl">All Events ({events.length})</h2>

        {loading ? (
          <p className="text-[var(--color-muted)]">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-[var(--color-muted)]">No events found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-[var(--color-muted)]">Title</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Category</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Date</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">College</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Likes</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-3">
                      <Link
                        to={`/events/${event._id}`}
                        className="hover:text-orange-300 transition-colors"
                      >
                        {event.title}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex py-1 px-2 rounded-full text-xs bg-orange-400/10 border border-orange-400/30 text-orange-200">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--color-muted)]">
                      {formatDate(event.eventDate)}
                    </td>
                    <td className="p-3 text-[var(--color-muted)]">
                      {event.collegeId?.name || "N/A"}
                    </td>
                    <td className="p-3 text-[var(--color-muted)]">
                      {event.likesCount ?? 0}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(event._id)}
                        disabled={deleting === event._id}
                        className="inline-flex items-center justify-center rounded-full py-2 px-4 text-sm transition-colors border border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 disabled:opacity-50 disabled:cursor-default"
                      >
                        {deleting === event._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ManageEvents;
