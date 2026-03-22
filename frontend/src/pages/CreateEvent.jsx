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
        text="Fill in the details below to publish a new event for your college."
      />

      <form
        className="grid gap-6 p-6 md:p-10 rounded-3xl border border-white/10 bg-[#161b22] shadow-xl relative overflow-hidden max-w-4xl mx-auto w-full"
        onSubmit={handleSubmit}
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <label className="grid gap-2 text-sm font-medium text-slate-300 relative z-10">
          Event title <span className="text-rose-500">*</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Build Night, Research Expo, Culture Fest..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-600 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-300 relative z-10">
          Description <span className="text-rose-500">*</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="What is the event about, and why should students join?"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-600 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors resize-y"
            required
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Category
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#1e2532] px-4 py-3 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
              <option value="Fest">Fest</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            External link
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-600 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Event date <span className="text-rose-500">*</span>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Event time <span className="text-rose-500">*</span>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
              required
            />
          </label>
        </div>

        <input type="hidden" name="collegeId" value={formData.collegeId} readOnly />

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="m-0 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-4 relative z-10 pt-6 border-t border-white/10">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 transition-all duration-200 border border-transparent font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:translate-y-0 w-full md:w-auto"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : "Publish Event"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="inline-flex items-center justify-center rounded-xl py-3 px-6 transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold w-full md:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
