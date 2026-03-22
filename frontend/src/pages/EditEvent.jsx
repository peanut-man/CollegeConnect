import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function EditEvent() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Hackathon",
    eventDate: "",
    eventTime: "",
    externalLink: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    data: event,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ signal }) =>
      api.get(`/events/${eventId}`, { signal }).then((res) => res.data),
    select: (data) => data.event ?? data.data ?? data,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "Hackathon",
        eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
        eventTime: event.eventTime || "",
        externalLink: event.externalLink || "",
      });
    }
  }, [event]);

  const canModify =
    user &&
    (user.role === "Admin" ||
      (event?.organizerId &&
        (event.organizerId._id === user._id || event.organizerId === user._id)));

  function handleChange(e) {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.put(`/events/${eventId}`, formData);
      navigate(`/events/${eventId}`, { replace: true });
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors.map((item) => item.msg).join(" "));
      } else {
        setError(
          requestError.response?.data?.message ||
            "Event update failed. Please review the form."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="text-[var(--color-muted)]">Loading event...</p>
      </section>
    );
  }

  if (fetchError || !event) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          {fetchError?.response?.data?.message || "Event not found."}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center justify-center rounded-full py-3 px-4 mt-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        >
          Back to events
        </Link>
      </section>
    );
  }

  if (!canModify) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          You don't have permission to edit this event.
        </p>
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center justify-center rounded-full py-3 px-4 mt-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        >
          View Event
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        >
          &larr; Back to event
        </Link>
        <h1 className="m-0 text-2xl">Edit Event</h1>
      </div>

      <form
        className="grid gap-4 p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-amber-50">
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event title"
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your event..."
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Hackathon">Hackathon</option>
            <option value="Seminar">Seminar</option>
            <option value="Fest">Fest</option>
            <option value="Workshop">Workshop</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-2 text-amber-50">
            Event Date
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-2 text-amber-50">
            Event Time
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="grid gap-2 text-amber-50">
          External Link (optional)
          <input
            type="url"
            name="externalLink"
            value={formData.externalLink}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        {error && (
          <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full py-3 px-6 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center justify-center rounded-full py-3 px-6 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;
