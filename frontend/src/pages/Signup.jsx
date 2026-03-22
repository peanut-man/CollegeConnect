import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CollegeSelect from "../components/CollegeSelect";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    collegeId: "",
  });

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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto min-h-[calc(100vh-12rem)]">
      <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-gradient-to-bl from-teal-500/10 via-transparent to-emerald-500/5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-teal-400 bg-teal-500/10 py-1.5 px-3 rounded-full border border-teal-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Join the network
          </p>
          <h1 className="m-0 mb-6 text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            Create a student-ready event identity.
          </h1>
          <p className="max-w-prose text-lg text-slate-400 leading-relaxed">
            Pick your college, choose your role, and unlock curated campus event
            feeds across the network.
          </p>
        </div>
      </div>

      <form
        className="grid gap-5 p-8 md:p-12 rounded-3xl border border-white/10 bg-[#161b22] shadow-2xl relative overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 mb-2">
          <h2 className="m-0 text-3xl font-bold text-slate-100 mb-2">Sign up</h2>
          <p className="m-0 text-slate-400">
            Start with the basics and we will set up your session immediately.
          </p>
        </div>

        <div className="relative z-20 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Full name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 placeholder:text-slate-600 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@college.edu"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 placeholder:text-slate-600 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 placeholder:text-slate-600 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
              required
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Role
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#1e2532] px-4 py-2.5 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                <option value="Student">Student</option>
                <option value="Organizer">Organizer</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-300">
              College
              <CollegeSelect
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full!"
                required
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 relative z-10 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="m-0 text-sm font-medium">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          className="relative z-10 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 transition-all duration-200 border border-transparent font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-4"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : "Create account"}
        </button>

        <p className="text-slate-400 text-sm text-center relative z-10 mt-2">
          Already registered?{" "}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
            Log in here.
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;
