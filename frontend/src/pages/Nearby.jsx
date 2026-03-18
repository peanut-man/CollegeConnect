import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Nearby() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/nearby");
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="Nearby"
        title="Events happening around your college"
        text="This page uses your account's college affiliation to fetch nearby campus activity."
      />

      {loading ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Loading
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            Looking for nearby campuses
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">
            We are matching your college with nearby event hosts.
          </p>
        </section>
      ) : error ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Request failed
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            We could not load nearby events.
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">{error}</p>
        </section>
      ) : (
        <EventGrid
          emptyTitle="No nearby events right now"
          emptyBody="Once nearby colleges publish active events, they will show up here."
          events={events}
          onLikeChange={applyLikeDelta}
          user={user}
        />
      )}
    </div>
  );
}

export default Nearby;
