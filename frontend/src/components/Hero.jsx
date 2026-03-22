import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 p-8 md:p-12 lg:p-16 rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#161b22] shadow-2xl">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <div className="relative z-10 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <p className="m-0 uppercase text-xs font-bold tracking-widest text-slate-300">
            Designed for live campus energy
          </p>
        </div>
        
        <h1 className="m-0 mb-6 text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-tight pb-2 pt-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
          Discover what your college is building this week.
        </h1>
        
        <p className="max-w-prose text-lg text-slate-400 leading-relaxed mb-8">
          Browse hackathons, workshops, fests, and nearby campus moments from a
          single place. Sign in to save your favorites and unlock college-aware
          feeds.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 transition-all duration-200 border border-transparent font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
            to="/events"
          >
            Explore events
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl py-3.5 px-6 transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold"
            to={user ? "/my-college" : "/signup"}
          >
            {user ? "View my college feed" : "Create an account"}
          </Link>
        </div>
      </div>

      <div
        className="relative z-10 min-h-96 max-lg:min-h-80 max-md:min-h-0 flex items-center justify-center md:pl-10"
        aria-hidden="true"
      >
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-4 absolute p-6 rounded-2xl w-[min(24rem,100%)] border border-white/10 bg-[#1e2532]/90 backdrop-blur-md shadow-xl top-4 right-4 -rotate-[-4deg] transition-transform hover:z-20 hover:scale-105 hover:-rotate-1 duration-300">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-amber-200 uppercase mb-3">
            Hackathon
          </span>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Launch Night Sprint</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Teams from three campuses building in public through midnight.</p>
        </article>
        
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-4 absolute p-6 rounded-2xl w-[min(24rem,100%)] border border-white/10 bg-[#1e2532]/80 backdrop-blur-md shadow-xl top-36 left-0 rotate-[6deg] transition-transform hover:z-20 hover:scale-105 hover:rotate-2 duration-300">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold tracking-wide bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase mb-3">
            Workshop
          </span>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Design Systems Lab</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Practical UI critique, motion, and handoff sessions for makers.</p>
        </article>
        
        <article className="max-md:relative max-md:inset-auto max-md:w-full max-md:rotate-0 max-md:mb-4 absolute p-6 rounded-2xl w-[min(24rem,100%)] border border-white/10 bg-[#1e2532]/80 backdrop-blur-md shadow-xl bottom-4 right-12 -rotate-[6deg] transition-transform hover:z-20 hover:scale-105 hover:-rotate-2 duration-300">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold tracking-wide bg-purple-500/10 border border-purple-500/30 text-purple-300 uppercase mb-3">
            Fest
          </span>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Culture Week Afterglow</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Music, food, and student clubs turning the quad into a showcase.</p>
        </article>
      </div>
    </section>
  );
}

export default Hero;
