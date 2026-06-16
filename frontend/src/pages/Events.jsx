import { useEffect, useState } from "react";
import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

const CATEGORIES = ["Hackathon", "Seminar", "Fest", "Workshop", "Other"];

function Events() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (debouncedSearch) params.set("search", debouncedSearch);
  const qs = params.toString();
  const path = qs ? `/events?${qs}` : "/events";

  const { applyLikeDelta, error, events, loading } = useEventsFeed(path);

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="All events"
        title="A live campus event board"
        text="Browse every active event currently published through the backend."
      />

      <div className="relative p-4 md:p-5 rounded-[1.5rem] border border-white/10 bg-[#161b22] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4 z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name..."
              className="w-full pl-14 pr-11 py-2.5 rounded-xl border border-white/10 bg-[#1e2532] text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
          <div className="relative min-w-[160px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-white/10 bg-[#1e2532] text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="relative z-10">
            <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-cyan-400 bg-cyan-500/10 py-1.5 px-3 rounded-full border border-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Loading
            </p>
            <h1 className="m-0 mb-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              Pulling every active event
            </h1>
            <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed">
              This list is connected directly to `/api/events`.
            </p>
          </div>
        </section>
      ) : error ? (
        <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="relative z-10">
            <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-rose-400 bg-rose-500/10 py-1.5 px-3 rounded-full border border-rose-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Request failed
            </p>
            <h1 className="m-0 mb-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              We could not load the event board.
            </h1>
            <p className="max-w-xl mx-auto text-lg text-rose-400/80 leading-relaxed">
              {error}
            </p>
          </div>
        </section>
      ) : (
        <EventGrid
          emptyTitle="No events available"
          emptyBody="Create the first event to start the board."
          events={events}
          onLikeChange={applyLikeDelta}
          user={user}
        />
      )}
    </div>
  );
}

export default Events;
