import EventCard from "./EventCard";

function EventGrid({ emptyBody, emptyTitle, events, onLikeChange, user }) {
  if (!events.length) {
    return (
      <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="relative z-10 w-full">
          <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-slate-400 bg-slate-500/10 py-1.5 px-3 rounded-full border border-slate-500/20 relative z-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Nothing here yet
          </p>
          <h1 className="m-0 mb-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
            {emptyTitle}
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed">
            {emptyBody}
          </p>
        </div>
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
          user={user}
        />
      ))}
    </section>
  );
}

export default EventGrid;
