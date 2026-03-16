import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function LikeButton({ eventId, onLikeChange, user }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLike() {
    setBusy(true);
    setMessage("");

    try {
      await api.post(`/likes/${eventId}/like`);
      onLikeChange?.(eventId, 1);
      setMessage("Liked");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not like this event.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlike() {
    setBusy(true);
    setMessage("");

    try {
      await api.delete(`/likes/${eventId}/like`);
      onLikeChange?.(eventId, -1);
      setMessage("Removed");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not remove your like.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <Link className="ghost-button" to="/login">
        Log in to like
      </Link>
    );
  }

  return (
    <div className="like-panel">
      <button type="button" className="ghost-button" onClick={handleLike} disabled={busy}>
        {busy ? "Saving..." : "Like"}
      </button>
      <button type="button" className="ghost-button" onClick={handleUnlike} disabled={busy}>
        Unlike
      </button>
      {message ? <small className="subtle-text">{message}</small> : null}
    </div>
  );
}

export default LikeButton;
