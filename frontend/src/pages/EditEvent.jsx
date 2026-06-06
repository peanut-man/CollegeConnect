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
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        imageUrl: event.imageUrl || "",
      });
      setImagePreview(event.imageUrl || null);
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

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      const response = await api.post("/upload", fd);
      const url = response.data?.data?.url;
      if (url) {
        setImagePreview(url);
        setFormData((current) => ({ ...current, imageUrl: url }));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setFormData((current) => ({ ...current, imageUrl: "" }));
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

        <div className="grid gap-2 text-sm font-medium text-amber-50">
          Event poster / banner
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <img
                src={imagePreview}
                alt="Event poster preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:border-amber-500/50 hover:bg-white/10 transition-all duration-200">
              {uploading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636V13.25z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <span className="text-sm">Click to upload a poster or banner</span>
                  <span className="text-xs text-slate-500">PNG, JPEG, WebP or GIF (max 5MB)</span>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {error && (
          <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full py-3 px-6 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
            disabled={submitting || uploading}
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
