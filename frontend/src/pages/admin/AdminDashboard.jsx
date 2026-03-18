import { Link } from "react-router-dom";

const adminLinks = [
  {
    to: "/admin/colleges",
    title: "Manage Colleges",
    description: "Add, edit, or remove colleges from the network.",
    icon: "🏫",
  },
  {
    to: "/admin/events",
    title: "Manage Events",
    description: "View all events and moderate content.",
    icon: "📅",
  },
  {
    to: "/admin/users",
    title: "Manage Users",
    description: "View registered users and their roles.",
    icon: "👥",
  },
];

function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Administration
        </p>
        <h1 className="m-0 text-[clamp(2rem,4vw,3.5rem)] leading-tight tracking-tight">
          Admin Dashboard
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          Manage colleges, events, and users across the CollegeConnect network.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] hover:border-white/20 hover:-translate-y-1 transition-all duration-200 shadow-[var(--shadow-panel)]"
          >
            <span className="block text-4xl mb-4">{link.icon}</span>
            <h2 className="m-0 mb-2 text-xl group-hover:text-orange-300 transition-colors">
              {link.title}
            </h2>
            <p className="m-0 text-[var(--color-muted)]">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
