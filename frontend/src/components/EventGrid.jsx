import EventCard from "./EventCard";

function EventGrid({ emptyBody, emptyTitle, events, onLikeChange, showCollegeHint, user }) {
  if (!events.length) {
    return (
      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Nothing here yet
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          {emptyTitle}
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">{emptyBody}</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
