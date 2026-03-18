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
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Loading
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            Ranking the busiest campus events
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">
            We are reading the trending feed now.
          </p>
        </section>
      ) : error ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Request failed
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            We could not load trending events.
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">{error}</p>
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
