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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Welcome back
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          Step into the live campus feed.
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          Log in to access your college-specific boards, nearby events, and
          likes.
        </p>
      </div>

      <form
        className="grid gap-4 p-5 md:p-8 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]"
        onSubmit={handleSubmit}
      >
        <h2 className="m-0 text-3xl">Log in</h2>
        <p className="m-0 text-[var(--color-muted)]">
          Use your college account details to continue.
        </p>

        <label className="grid gap-2 text-amber-50">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@college.edu"
            required
          />
        </label>

        <label className="grid gap-2 text-amber-50">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            required
          />
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
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="text-[var(--color-muted)]">
          Need an account? <Link to="/signup">Create one here.</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
