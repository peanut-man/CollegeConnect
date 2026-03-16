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
    <section className="auth-layout">
      <div className="auth-visual">
        <p className="eyebrow">Welcome back</p>
        <h1>Step into the live campus feed.</h1>
        <p>
          Log in to access your college-specific boards, nearby events, and
          likes.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <p>Use your college account details to continue.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@college.edu"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button
          type="submit"
          className="solid-button wide-button"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="form-footnote">
          Need an account? <Link to="/signup">Create one here.</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
