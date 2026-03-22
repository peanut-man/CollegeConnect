import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Trending() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/trending");
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="Trending"
        title="The most liked events right now"
        text="This feed reflects the backend ranking by likes and recent activity."
      />

      {loading ? (
        <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="relative z-10 w-full">
            <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-cyan-400 bg-cyan-500/10 py-1.5 px-3 rounded-full border border-cyan-500/20 relative z-20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Loading
            </p>
            <h1 className="m-0 mb-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              Ranking the busiest campus events
            </h1>
            <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed">
              We are reading the trending feed now.
            </p>
          </div>
        </section>
      ) : error ? (
        <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="relative z-10 w-full">
            <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-rose-400 bg-rose-500/10 py-1.5 px-3 rounded-full border border-rose-500/20 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Request failed
            </p>
            <h1 className="m-0 mb-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              We could not load trending events.
            </h1>
            <p className="max-w-xl mx-auto text-lg text-rose-400/80 leading-relaxed">
              {error}
            </p>
          </div>
        </section>
      ) : (
        <EventGrid
          emptyTitle="No trending events yet"
          emptyBody="Likes will shape this feed as students interact with events."
          events={events}
          onLikeChange={applyLikeDelta}
          user={user}
        />
      )}
    </div>
  );
}

export default Trending;
