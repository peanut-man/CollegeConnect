import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function HeartIcon({ filled }) {
  if (filled) {
    return (
      <svg
        className="w-5 h-5 text-red-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function LikeButton({ eventId, onLikeChange, user }) {
  const [busy, setBusy] = useState(false);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");

  async function handleToggle() {
    if (busy) return;

    setBusy(true);
    setMessage("");

    if (liked) {
      onLikeChange?.(eventId, -1);
      try {
        await api.delete(`/likes/${eventId}/like`);
        setLiked(false);
      } catch (error) {
        onLikeChange?.(eventId, 1);
        if (error.response?.status === 404) {
          setLiked(false);
        } else {
          setMessage(error.response?.data?.message || "Error");
        }
      }
    } else {
      onLikeChange?.(eventId, 1);
      try {
        await api.post(`/likes/${eventId}/like`);
        setLiked(true);
      } catch (error) {
        onLikeChange?.(eventId, -1);
        if (error.response?.status === 409) {
          setLiked(true);
        } else {
          setMessage(error.response?.data?.message || "Error");
        }
      }
    }

    setBusy(false);
  }

  if (!user) {
    return (
      <Link
        className="inline-flex items-center gap-2 justify-center rounded-full py-3 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px"
        to="/login"
      >
        <HeartIcon filled={false} />
        <span>Like</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`inline-flex items-center gap-2 justify-center rounded-full py-3 px-4 transition-all duration-150 ease-out border hover:-translate-y-px disabled:opacity-70 disabled:cursor-default disabled:translate-y-0 ${
          liked
            ? "border-red-400/30 bg-red-400/10"
            : "border-white/10 bg-white/5"
        }`}
        onClick={handleToggle}
        disabled={busy}
      >
        <HeartIcon filled={liked} />
        <span>{busy ? "..." : liked ? "Liked" : "Like"}</span>
      </button>
      {message && (
        <small className="text-sm text-[var(--color-muted)]">{message}</small>
      )}
    </div>
  );
}

export default LikeButton;
