import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Trending() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/trending");
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Trending"
        title="The most liked events right now"
        text="This feed reflects the backend ranking by likes and recent activity."
      />

      {loading ? (
        <section className="state-panel">
          <p className="eyebrow">Loading</p>
          <h1>Ranking the busiest campus events</h1>
          <p>We are reading the trending feed now.</p>
        </section>
      ) : error ? (
        <section className="state-panel">
          <p className="eyebrow">Request failed</p>
          <h1>We could not load trending events.</h1>
          <p>{error}</p>
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
