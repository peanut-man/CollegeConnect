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
    <section className="auth-layout">
      <div className="auth-visual">
        <p className="eyebrow">Join the network</p>
        <h1>Create a student-ready event identity.</h1>
        <p>
          Pick your college, choose your role, and unlock curated campus event
          feeds across the network.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <p>Start with the basics and we will set up your session immediately.</p>

        <label>
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

        <label>
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

        <label>
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

        <label>
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Organizer">Organizer</option>
          </select>
        </label>

        <label>
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

        {error ? <p className="form-error">{error}</p> : null}

        <button
          type="submit"
          className="solid-button wide-button"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="form-footnote">
          Already registered? <Link to="/login">Log in here.</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
