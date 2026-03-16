import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function Events() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events");
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="All events"
        title="A live campus event board"
        text="Browse every active event currently published through the backend."
      />

      {loading ? (
        <section className="state-panel">
          <p className="eyebrow">Loading</p>
          <h1>Pulling every active event</h1>
          <p>This list is connected directly to `/api/events`.</p>
        </section>
      ) : error ? (
        <section className="state-panel">
          <p className="eyebrow">Request failed</p>
          <h1>We could not load the event board.</h1>
          <p>{error}</p>
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
