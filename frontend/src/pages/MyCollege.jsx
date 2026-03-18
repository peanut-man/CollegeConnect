import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function MyCollege() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/my-college");
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <PageIntro
        eyebrow="My college"
        title="Events tied to your own campus"
        text="A focused feed for the college linked to your account."
      />

      {loading ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Loading
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            Gathering your campus schedule
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">
            This page is driven by the authenticated user profile.
          </p>
        </section>
      ) : error ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Request failed
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            We could not load your college feed.
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">{error}</p>
        </section>
      ) : (
        <EventGrid
          emptyTitle="No events published for your college yet"
          emptyBody="Once organizers from your campus publish events, they will land here."
          events={events}
          onLikeChange={applyLikeDelta}
          user={user}
        />
      )}
    </div>
  );
}

export default MyCollege;
