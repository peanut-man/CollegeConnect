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
    <div className="page-stack">
      <Hero />
      <PageIntro
        eyebrow="This week"
        title="Fresh campus activity"
        text="A focused preview of newly published events so students can spot what is moving across nearby communities."
        actions={
          <Link className="ghost-button" to="/events">
            See full calendar
          </Link>
        }
      />

      {loading ? (
        <section className="state-panel">
          <p className="eyebrow">Loading</p>
          <h1>Gathering the latest campus events</h1>
          <p>We are pulling live data from the backend now.</p>
        </section>
      ) : error ? (
        <section className="state-panel">
          <p className="eyebrow">Feed unavailable</p>
          <h1>We could not load the homepage events.</h1>
          <p>{error}</p>
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
