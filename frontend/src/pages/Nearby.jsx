import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Nearby() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/nearby");
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Nearby"
        title="Events happening around your college"
        text="This page uses your account's college affiliation to fetch nearby campus activity."
      />

      {loading ? (
        <section className="state-panel">
          <p className="eyebrow">Loading</p>
          <h1>Looking for nearby campuses</h1>
          <p>We are matching your college with nearby event hosts.</p>
        </section>
      ) : error ? (
        <section className="state-panel">
          <p className="eyebrow">Request failed</p>
          <h1>We could not load nearby events.</h1>
          <p>{error}</p>
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
