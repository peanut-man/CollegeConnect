import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function normalizeColleges(payload) {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.colleges)) {
    return payload.colleges;
  }
  return [];
}

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    collegeId: "",
  });

  useEffect(() => {
    let active = true;

    async function loadColleges() {
      try {
        const response = await api.get("/colleges");
        if (!active) {
          return;
        }
        setColleges(normalizeColleges(response.data));
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load colleges for signup.",
          );
        }
      } finally {
        if (active) {
          setLoadingColleges(false);
        }
      }
    }

    loadColleges();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup(formData);
      navigate("/events", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Signup failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Join the network
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          Create a student-ready event identity.
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          Pick your college, choose your role, and unlock curated campus event
          feeds across the network.
        </p>
      </div>

      <form
        className="grid gap-4 p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]"
        onSubmit={handleSubmit}
      >
        <h2 className="m-0 text-3xl">Sign up</h2>
        <p className="m-0 text-[var(--color-muted)]">
          Start with the basics and we will set up your session immediately.
        </p>

        <label className="grid gap-2 text-amber-50">
          Full name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@college.edu"
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Organizer">Organizer</option>
          </select>
        </label>

        <label className="grid gap-2 text-amber-50">
          College
          <select
            name="collegeId"
            value={formData.collegeId}
            onChange={handleChange}
            disabled={loadingColleges}
            required
          >
            <option value="">
              {loadingColleges ? "Loading colleges..." : "Select your college"}
            </option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
        </label>

        {error ? (
          <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-[var(--color-muted)]">
          Already registered? <Link to="/login">Log in here.</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
