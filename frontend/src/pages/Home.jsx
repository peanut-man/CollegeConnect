import { useState } from "react";
import { Link } from "react-router-dom";
import EventGrid from "../components/EventGrid";
import Hero from "../components/Hero";
import { useAuth } from "../hooks/useAuth";
import useEventsFeed from "../hooks/useEventsFeed";

const TABS = [
  { id: "all", label: "All Events", endpoint: "/events", requiresAuth: false },
  { id: "trending", label: "Trending", endpoint: "/events/trending", requiresAuth: false },
  { id: "my-college", label: "My College", endpoint: "/events/my-college", requiresAuth: true },
  { id: "nearby", label: "Nearby", endpoint: "/events/nearby", requiresAuth: true },
];

function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab) || TABS[0];
  const { applyLikeDelta, events, loading, error } = useEventsFeed(activeTabConfig.endpoint);

  function handleTabChange(tabId) {
    const tab = TABS.find((t) => t.id === tabId);
    if (tab?.requiresAuth && !user) {
      return;
    }
    setActiveTab(tabId);
  }

  return (
    <div className="grid gap-6">
      <Hero />

      <section className="p-6 rounded-2xl border border-white/10 bg-[var(--color-panel)] shadow-[var(--shadow-panel)]">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
              Explore
            </p>
            <h2 className="m-0 text-2xl font-bold">Campus Events</h2>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
            to="/events"
          >
            See full calendar
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => {
            const isDisabled = tab.requiresAuth && !user;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`inline-flex items-center justify-center rounded-full py-2 px-4 text-sm transition-all duration-150 ease-out border ${
                  isActive
                    ? "border-orange-400/50 bg-orange-400/20 text-orange-200"
                    : isDisabled
                    ? "border-white/5 bg-white/5 text-[var(--color-muted)] cursor-not-allowed opacity-50"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
                title={isDisabled ? "Login required" : ""}
              >
                {tab.label}
                {isDisabled && (
                  <span className="ml-1 text-xs">(login)</span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
              Loading
            </p>
            <p className="m-0 text-xl">Gathering events...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="m-0 mb-2 uppercase text-xs tracking-widest text-red-400">
              Error
            </p>
            <p className="m-0 text-xl text-[var(--color-muted)]">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center">
            <p className="m-0 mb-2 uppercase text-xs tracking-widest text-[var(--color-accent-cool)]">
              Nothing here yet
            </p>
            <p className="m-0 text-xl">No events found in this category.</p>
          </div>
        ) : (
          <EventGrid
            emptyTitle="No events yet"
            emptyBody="Once events are created, they will show up here."
            events={events.slice(0, 6)}
            onLikeChange={applyLikeDelta}
            user={user}
          />
        )}
      </section>
    </div>
  );
}

export default Home;
