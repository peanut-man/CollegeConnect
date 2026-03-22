import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ email, password });
      navigate(location.state?.from?.pathname || "/events", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Login failed. Check your email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto min-h-[calc(100vh-12rem)]">
      <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-indigo-400 bg-indigo-500/10 py-1.5 px-3 rounded-full border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Welcome back
          </p>
          <h1 className="m-0 mb-6 text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            Step into the live campus feed.
          </h1>
          <p className="max-w-prose text-lg text-slate-400 leading-relaxed">
            Log in to access your college-specific boards, nearby events, and
            likes shaping up around campus.
          </p>
        </div>
      </div>

      <form
        className="grid gap-6 p-8 md:p-12 rounded-3xl border border-white/10 bg-[#161b22] shadow-2xl relative overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 mb-2">
          <h2 className="m-0 text-3xl font-bold text-slate-100 mb-2">Log in</h2>
          <p className="m-0 text-slate-400">
            Use your college account details to continue.
          </p>
        </div>

        <div className="relative z-10 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@college.edu"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-600 text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-600 text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              required
            />
          </label>
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
          className="relative z-10 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 transition-all duration-200 border border-transparent font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-4"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : "Log in"}
        </button>

        <p className="text-slate-400 text-sm text-center relative z-10 mt-2">
          Need an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create one here.
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
