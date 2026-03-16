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
    <div className="page-stack">
      <PageIntro
        eyebrow="Organizer studio"
        title="Publish a new event"
        text="This form matches the backend create-event contract, including the current temporary `collegeId` requirement."
      />

      <form className="editor-card" onSubmit={handleSubmit}>
        <label>
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

        <label>
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

        <div className="editor-grid">
          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
              <option value="Fest">Fest</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Event date
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Event time
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
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

        {error ? <p className="form-error">{error}</p> : null}

        <div className="editor-actions">
          <button type="submit" className="solid-button" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
