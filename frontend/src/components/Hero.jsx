import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 p-5 md:p-8 rounded-3xl overflow-hidden border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)] bg-gradient-to-br from-orange-400/10 via-transparent to-cyan-400/5">
      <div>
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          Designed for live campus energy
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          Discover what your college is building this week.
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">
          Browse hackathons, workshops, fests, and nearby campus moments from a
          single place. Sign in to save your favorites and unlock college-aware
          feeds.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-transparent font-bold bg-gradient-to-br from-orange-400 to-amber-300 text-[#1b1d22] hover:-translate-y-px"
            to="/events"
          >
            Explore events
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
            to={user ? "/my-college" : "/signup"}
          >
            {user ? "View my college feed" : "Create an account"}
          </Link>
        </div>
      </div>

      <div
        className="relative min-h-96 max-lg:min-h-80 max-md:min-h-0"
        aria-hidden="true"
      >
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-3 absolute p-5 rounded-2xl w-[min(22rem,100%)] border border-white/20 bg-[var(--color-panel-strong)] shadow-[var(--shadow-panel)] top-0 right-0 -rotate-[5deg]">
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-orange-400/10 border border-orange-400/30 text-orange-200">
            Hackathon
          </span>
          <h2>Launch Night Sprint</h2>
          <p>Teams from three campuses building in public through midnight.</p>
        </article>
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-3 absolute p-5 rounded-2xl w-[min(22rem,100%)] border border-white/20 bg-[var(--color-panel-strong)] shadow-[var(--shadow-panel)] top-24 left-0 rotate-[4deg]">
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-orange-400/10 border border-orange-400/30 text-orange-200">
            Workshop
          </span>
          <h2>Design Systems Lab</h2>
          <p>Practical UI critique, motion, and handoff sessions for makers.</p>
        </article>
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-3 absolute p-5 rounded-2xl w-[min(22rem,100%)] border border-white/20 bg-[var(--color-panel-strong)] shadow-[var(--shadow-panel)] bottom-0 right-8 -rotate-[2deg]">
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-sm bg-orange-400/10 border border-orange-400/30 text-orange-200">
            Fest
          </span>
          <h2>Culture Week Afterglow</h2>
          <p>Music, food, and student clubs turning the quad into a showcase.</p>
        </article>
      </div>
    </section>
  );
}

export default Hero;
