function DeleteConfirmModal({ isOpen, onClose, onConfirm, loading, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 p-6 rounded-2xl border border-white/10 bg-[var(--color-panel-strong)] shadow-[var(--shadow-panel)]">
        <h2 className="m-0 mb-2 text-xl font-bold">{title || "Confirm Delete"}</h2>
        <p className="m-0 mb-6 text-[var(--color-muted)]">
          {message || "Are you sure you want to delete this? This action cannot be undone."}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full py-2 px-4 transition-transform duration-150 ease-out border border-white/10 bg-white/5 hover:-translate-y-px disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full py-2 px-4 transition-transform duration-150 ease-out border border-red-400/30 bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
