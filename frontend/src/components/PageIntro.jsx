function PageIntro({ eyebrow, title, text, actions }) {
  return (
    <section className="page-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {actions ? <div className="intro-actions">{actions}</div> : null}
    </section>
  );
}

export default PageIntro;
