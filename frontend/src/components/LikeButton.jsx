import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function LikeButton({ eventId, onLikeChange, user }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLike() {
    if (busy) return;

    setBusy(true);
    setMessage("");

    onLikeChange?.(eventId, 1);

    try {
      await api.post(`/likes/${eventId}/like`);
      setMessage("Liked");
    } catch (error) {
      onLikeChange?.(eventId, -1);
      setMessage(error.response?.data?.message || "Could not like this event.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlike() {
    if (busy) return;

    setBusy(true);
    setMessage("");

    onLikeChange?.(eventId, -1);

    try {
      await api.delete(`/likes/${eventId}/like`);
      setMessage("Removed");
    } catch (error) {
      onLikeChange?.(eventId, 1);
      setMessage(error.response?.data?.message || "Could not remove your like.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <Link
        className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        to="/login"
      >
        Log in to like
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
        onClick={handleLike}
        disabled={busy}
      >
        {busy ? "Saving..." : "Like"}
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0"
        onClick={handleUnlike}
        disabled={busy}
      >
        Unlike
      </button>
      {message ? (
        <small className="text-sm text-[var(--color-muted)]">{message}</small>
      ) : null}
    </div>
  );
}

export default LikeButton;
