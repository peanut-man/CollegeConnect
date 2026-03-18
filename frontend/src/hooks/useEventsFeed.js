import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

async function fetchEvents(path, signal) {
  const response = await api.get(path, { signal });
  return normalizeEvents(response.data);
}

function useEventsFeed(path) {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["events", path],
    queryFn: ({ signal }) => fetchEvents(path, signal),
    staleTime: 30000,
    retry: 1,
  });

  const error = queryError
    ? queryError.response?.data?.message || "Unable to load events right now."
    : "";

  const applyLikeDelta = useCallback(
    (eventId, delta) => {
      queryClient.setQueryData(["events", path], (current) => {
        if (!Array.isArray(current)) return current;
        return current.map((event) =>
          event._id === eventId
            ? {
                ...event,
                likesCount: Math.max(0, (event.likesCount ?? 0) + delta),
              }
            : event
        );
      });
    },
    [queryClient, path]
  );

  return { applyLikeDelta, error, events, loading };
}

export default useEventsFeed;
