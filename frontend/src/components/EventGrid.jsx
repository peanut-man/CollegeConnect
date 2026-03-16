import EventCard from "./EventCard";

function EventGrid({ emptyBody, emptyTitle, events, onLikeChange, showCollegeHint, user }) {
  if (!events.length) {
    return (
      <section className="state-panel">
        <p className="eyebrow">Nothing here yet</p>
        <h1>{emptyTitle}</h1>
        <p>{emptyBody}</p>
      </section>
    );
  }

  return (
    <section className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onLikeChange={onLikeChange}
          showCollegeHint={showCollegeHint}
          user={user}
        />
      ))}
    </section>
  );
}

export default EventGrid;
