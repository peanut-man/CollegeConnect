import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const primaryLinks = [
  { to: "/events", label: "All events" },
  { to: "/trending", label: "Trending" },
  { to: "/nearby", label: "Nearby" },
  { to: "/my-college", label: "My college" },
];

function Shell() {
  const { user, logout } = useAuth();
  const canCreate = user && ["Admin", "Organizer"].includes(user.role);

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">CC</span>
          <span>
            <strong>College Connect</strong>
            <small>Campus events with momentum</small>
          </span>
        </NavLink>

        <nav className="topnav" aria-label="Primary">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          {canCreate ? (
            <NavLink
              to="/create-event"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Create event
            </NavLink>
          ) : null}
        </nav>

        <div className="account-bar">
          {user ? (
            <>
              <div className="account-chip">
                <span>{user.name}</span>
                <small>{user.role}</small>
              </div>
              <button type="button" className="ghost-button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="ghost-button">
                Log in
              </NavLink>
              <NavLink to="/signup" className="solid-button">
                Join now
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default Shell;
