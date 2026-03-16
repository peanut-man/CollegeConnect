import { useEffect, useState } from "react";
import api from "../services/api";

function normalizeEvents(payload) {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.events)) {
    return payload.events;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
}

function useEventsFeed(path) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(path);
        if (!active) {
          return;
        }
        setEvents(normalizeEvents(response.data));
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(
          requestError.response?.data?.message || "Unable to load events right now.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, [path]);

  function applyLikeDelta(eventId, delta) {
    setEvents((current) =>
      current.map((event) =>
        event._id === eventId
          ? {
              ...event,
              likesCount: Math.max(0, (event.likesCount ?? 0) + delta),
            }
          : event,
      ),
    );
  }

  return { applyLikeDelta, error, events, loading };
}

export default useEventsFeed;
