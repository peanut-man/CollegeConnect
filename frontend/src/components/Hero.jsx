import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Designed for live campus energy</p>
        <h1>Discover what your college is building this week.</h1>
        <p className="hero-text">
          Browse hackathons, workshops, fests, and nearby campus moments from a
          single place. Sign in to save your favorites and unlock college-aware
          feeds.
        </p>
        <div className="hero-actions">
          <Link className="solid-button" to="/events">
            Explore events
          </Link>
          <Link className="ghost-button" to={user ? "/my-college" : "/signup"}>
            {user ? "View my college feed" : "Create an account"}
          </Link>
        </div>
      </div>

      <div className="hero-card-stack" aria-hidden="true">
        <article className="spotlight-card card-a">
          <span className="pill">Hackathon</span>
          <h2>Launch Night Sprint</h2>
          <p>Teams from three campuses building in public through midnight.</p>
        </article>
        <article className="spotlight-card card-b">
          <span className="pill">Workshop</span>
          <h2>Design Systems Lab</h2>
          <p>Practical UI critique, motion, and handoff sessions for makers.</p>
        </article>
        <article className="spotlight-card card-c">
          <span className="pill">Fest</span>
          <h2>Culture Week Afterglow</h2>
          <p>Music, food, and student clubs turning the quad into a showcase.</p>
        </article>
      </div>
    </section>
  );
}

export default Hero;
