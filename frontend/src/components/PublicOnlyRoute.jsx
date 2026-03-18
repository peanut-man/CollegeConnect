import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicOnlyRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return null;
  }

  if (user) {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
