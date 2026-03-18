import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  category: "Hackathon",
  eventDate: "",
  eventTime: "",
  externalLink: "",
  collegeId: "managed-by-backend",
};

function CreateEvent() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/events", formData);
      navigate("/events", { replace: true });
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors.map((item) => item.msg).join(" "));
      } else {
        setError(
          requestError.response?.data?.message ||
            "Event creation failed. Please review the form.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="Organizer studio"
        title="Publish a new event"
        text="This form matches the backend create-event contract, including the current temporary `collegeId` requirement."
      />

      <form
        className="grid gap-4 p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-amber-50">
          Event title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Build Night, Research Expo, Culture Fest..."
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="What is the event about, and why should students join?"
            required
          />
        </label>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="grid gap-2 text-amber-50">
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
              <option value="Fest">Fest</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="grid gap-2 text-amber-50">
            Event date
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-2 text-amber-50">
            Event time
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-2 text-amber-50">
            External link
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
        </div>

        <input type="hidden" name="collegeId" value={formData.collegeId} readOnly />

        {error ? (
          <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
