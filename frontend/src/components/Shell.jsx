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
  const isAdmin = user?.role === "Admin";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 backdrop-blur-lg bg-[rgba(9,13,24,0.55)] border-b border-white/10">
        <NavLink to="/" className="inline-flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl font-bold text-[#111826] bg-gradient-to-br from-amber-300 to-orange-400">
            CC
          </span>
          <span>
            <strong className="block">College Connect</strong>
            <small className="block text-[var(--color-muted)]">
              Campus events with momentum
            </small>
          </span>
        </NavLink>

        <nav
          className="flex flex-wrap gap-3 justify-start lg:justify-center"
          aria-label="Primary"
        >
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border bg-white/5 hover:-translate-y-px ${
                  isActive
                    ? "border-orange-400/80 bg-orange-400/10"
                    : "border-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {canCreate ? (
            <NavLink
              to="/create-event"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border bg-white/5 hover:-translate-y-px ${
                  isActive
                    ? "border-orange-400/80 bg-orange-400/10"
                    : "border-white/10"
                }`
              }
            >
              Create event
            </NavLink>
          ) : null}
          {isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border bg-purple-500/10 hover:-translate-y-px ${
                  isActive
                    ? "border-purple-400/80 bg-purple-400/20"
                    : "border-purple-400/30"
                }`
              }
            >
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 justify-start lg:justify-end">
          {user ? (
            <>
              <div className="py-2.5 px-4 rounded-2xl border border-white/10 bg-white/5">
                <span className="block">{user.name}</span>
                <small className="block text-[var(--color-muted)]">
                  {user.role}
                </small>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px"
              >
                Join now
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto py-8 pb-16 w-[min(1200px,calc(100%-2rem))] max-md:w-[min(100%-1rem,1200px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default Shell;
