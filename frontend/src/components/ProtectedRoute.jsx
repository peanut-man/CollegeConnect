import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, requireRoles }) {
  const { authReady, loading, user } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <section className="state-panel">
        <p className="eyebrow">Checking session</p>
        <h1>Loading your space</h1>
        <p>We are syncing your account before we open this page.</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRoles && !requireRoles.includes(user.role)) {
    return (
      <section className="state-panel">
        <p className="eyebrow">Access limited</p>
        <h1>This page is not available for your role.</h1>
        <p>
          Sign in with an organizer or admin account to create and manage
          events.
        </p>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
