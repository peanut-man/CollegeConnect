import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Events() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events");
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="All events"
        title="A live campus event board"
        text="Browse every active event currently published through the backend."
      />

      {loading ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Loading
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            Pulling every active event
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">
            This list is connected directly to `/api/events`.
          </p>
        </section>
      ) : error ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Request failed
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            We could not load the event board.
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">{error}</p>
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
