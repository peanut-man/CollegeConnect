import { Link } from "react-router-dom";
import EventGrid from "../components/EventGrid";
import Hero from "../components/Hero";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Home() {
  const { applyLikeDelta, events, loading, error } = useEventsFeed("/events");
  const { user } = useAuth();
  const highlights = events.slice(0, 3);

  return (
    <div className="grid gap-6">
      <Hero />
      <PageIntro
        eyebrow="This week"
        title="Fresh campus activity"
        text="A focused preview of newly published events so students can spot what is moving across nearby communities."
        actions={
          <Link
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
            to="/events"
          >
            See full calendar
          </Link>
        }
      />

      {loading ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Loading
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            Gathering the latest campus events
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">
            We are pulling live data from the backend now.
          </p>
        </section>
      ) : error ? (
        <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
          <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
            Feed unavailable
          </p>
          <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
            We could not load the homepage events.
          </h1>
          <p className="max-w-prose text-[var(--color-muted)]">{error}</p>
        </section>
      ) : (
        <EventGrid
          emptyTitle="No featured events yet"
          emptyBody="Once events are created, the newest ones will show up here."
          events={highlights}
          onLikeChange={applyLikeDelta}
          user={user}
        />
      )}
    </div>
  );
}

export default Home;
