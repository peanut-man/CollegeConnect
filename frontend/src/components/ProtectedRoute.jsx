import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, requireRoles }) {
  const { authReady, loading, user } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Checking session
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          Loading your space
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          We are syncing your account before we open this page.
        </p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRoles && !requireRoles.includes(user.role)) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Access limited
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          This page is not available for your role.
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          Sign in with an organizer or admin account to create and manage
          events.
        </p>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
