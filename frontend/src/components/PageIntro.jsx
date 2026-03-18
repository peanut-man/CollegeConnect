function PageIntro({ eyebrow, title, text, actions }) {
  return (
    <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
      <div>
        <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
          {eyebrow}
        </p>
        <h1 className="m-0 text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-tight">
          {title}
        </h1>
        <p className="max-w-prose text-[var(--color-muted)]">{text}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3 mt-6">{actions}</div> : null}
    </section>
  );
}

export default PageIntro;
