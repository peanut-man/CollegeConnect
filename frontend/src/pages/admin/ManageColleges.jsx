import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  async function fetchColleges() {
    try {
      setLoading(true);
      const response = await api.get("/colleges");
      const data = response.data?.data || response.data?.colleges || response.data || [];
      setColleges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        city: formData.city,
        state: formData.state,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.longitude) || 0,
            parseFloat(formData.latitude) || 0,
          ],
        },
      };

      await api.post("/colleges", payload);
      setFormData({ name: "", city: "", state: "", latitude: "", longitude: "" });
      fetchColleges();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add college.");
    } finally {
      setSubmitting(false);
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
        <h1 className="m-0 text-2xl">Manage Colleges</h1>
      </div>

      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <h2 className="m-0 mb-4 text-xl">Add New College</h2>

        <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-2 text-amber-50">
              College Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="MIT, IIT Delhi, etc."
                required
              />
            </label>

            <label className="grid gap-2 text-amber-50">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai, Delhi, etc."
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="grid gap-2 text-amber-50">
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra, etc."
                required
              />
            </label>

            <label className="grid gap-2 text-amber-50">
              Latitude
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="19.0760"
                required
              />
            </label>

            <label className="grid gap-2 text-amber-50">
              Longitude
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="72.8777"
                required
              />
            </label>
          </div>

          {error && (
            <p className="m-0 p-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 text-orange-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-fit inline-flex items-center justify-center rounded-full py-3 px-6 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
          >
            {submitting ? "Adding..." : "Add College"}
          </button>
        </form>
      </section>

      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <h2 className="m-0 mb-4 text-xl">All Colleges ({colleges.length})</h2>

        {loading ? (
          <p className="text-[var(--color-muted)]">Loading colleges...</p>
        ) : colleges.length === 0 ? (
          <p className="text-[var(--color-muted)]">No colleges found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-[var(--color-muted)]">Name</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">City</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">State</th>
                  <th className="text-left p-3 text-[var(--color-muted)]">Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((college) => (
                  <tr
                    key={college._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-3">{college.name}</td>
                    <td className="p-3 text-[var(--color-muted)]">{college.city}</td>
                    <td className="p-3 text-[var(--color-muted)]">{college.state}</td>
                    <td className="p-3 text-[var(--color-muted)] text-sm">
                      {college.location?.coordinates
                        ? `${college.location.coordinates[1]}, ${college.location.coordinates[0]}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ManageColleges;
