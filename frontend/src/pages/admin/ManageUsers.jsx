import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const data = response.data?.data || response.data?.users || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Users endpoint not available. This feature requires backend support.");
      } else {
        setError(err.response?.data?.message || "Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  }

  function getRoleBadgeClass(role) {
    switch (role) {
      case "Admin":
        return "bg-purple-400/10 border-purple-400/30 text-purple-200";
      case "Organizer":
        return "bg-blue-400/10 border-blue-400/30 text-blue-200";
      default:
        return "bg-green-400/10 border-green-400/30 text-green-200";
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="m-0 text-2xl">View Users</h1>
      </div>

      {error && (
        <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
          {error}
        </p>
      )}

      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <h2 className="m-0 mb-4 text-xl">All Users ({users.length})</h2>

        {loading ? (
          <p className="text-[var(--color-muted)]">Loading users...</p>
        ) : users.length === 0 && !error ? (
          <p className="text-[var(--color-muted)]">No users found.</p>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-[var(--color-muted)]">Name</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Email</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Role</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">College</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-[var(--color-muted)]">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex py-1 px-2 rounded-full text-xs border ${getRoleBadgeClass(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--color-muted)]">
                      {user.collegeId?.name || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default ManageUsers;
