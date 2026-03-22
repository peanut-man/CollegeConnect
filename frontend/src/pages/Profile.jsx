import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="grid place-items-center min-h-[50vh]">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  // Format the date locally since the timezone is fixed
  const joinedDate = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <section className="max-w-3xl mx-auto mt-8">
      <div className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3 z-0"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-1">{user.name}</h1>
              <p className="text-slate-400 font-medium">{user.role}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Email Address</p>
              <p className="text-lg font-medium text-slate-200">{user.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Account Role</p>
              <p className="text-lg font-medium text-slate-200">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-blue-200 uppercase">
                  {user.role}
                </span>
              </p>
            </div>

            {user.collegeId && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">College</p>
                <p className="text-lg font-medium text-slate-200">
                  {typeof user.collegeId === 'object' ? user.collegeId.name : user.collegeId}
                </p>
                {typeof user.collegeId === 'object' && user.collegeId.city && (
                  <p className="text-sm text-slate-500">
                    {user.collegeId.city}, {user.collegeId.state}
                  </p>
                )}
                {typeof user.collegeId !== 'object' && (
                  <p className="text-sm text-slate-500">Your specific campus branch identifier.</p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Member Since</p>
              <p className="text-lg font-medium text-slate-200">{joinedDate}</p>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium hover:-translate-y-px"
            >
              Browse Events
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 transition-all duration-200 border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 font-medium hover:-translate-y-px"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;