import EventGrid from "../components/EventGrid";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

function MyCollege() {
  const { applyLikeDelta, error, events, loading } = useEventsFeed("/events/my-college");
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="My college"
        title="Events tied to your own campus"
        text="A focused feed for the college linked to your account."
      />

      {loading ? (
        <section className="state-panel">
          <p className="eyebrow">Loading</p>
          <h1>Gathering your campus schedule</h1>
          <p>This page is driven by the authenticated user profile.</p>
        </section>
      ) : error ? (
        <section className="state-panel">
          <p className="eyebrow">Request failed</p>
          <h1>We could not load your college feed.</h1>
          <p>{error}</p>
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
