function PageIntro({ eyebrow, title, text, actions }) {
  return (
    <section className="relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-[#161b22] shadow-2xl overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3 z-0"></div>

      <div className="relative z-10">
        {eyebrow && (
          <p className="m-0 mb-4 inline-flex items-center gap-2 uppercase text-xs font-bold tracking-widest text-cyan-400 bg-cyan-500/10 py-1.5 px-3 rounded-full border border-cyan-500/20 relative z-20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {eyebrow}
          </p>
        )}
        <h1 className="m-0 mb-4 pb-2 pt-1 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
          {title}
        </h1>
        <p className="max-w-3xl text-lg text-slate-400 leading-relaxed m-0">
          {text}
        </p>
      </div>
      
      {actions && (
        <div className="relative z-10 flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
          {actions}
        </div>
      )}
    </section>
  );
}

export default PageIntro;
