import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { askQuery } from "../services/ai";

function AiAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target) && !event.target.closest('[data-ai-fab]')) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    const query = input.trim();
    if (!query || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    try {
      const { answer, events } = await askQuery(query);
      setMessages((prev) => [...prev, { role: "ai", text: answer, events }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I could not process your request right now. Please try again.", events: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleEventClick(eventId) {
    navigate(`/events/${eventId}`);
    setOpen(false);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      <div
        ref={panelRef}
        className={`fixed bottom-20 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[32rem] flex flex-col rounded-2xl border border-white/10 bg-[#161b22] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1e2532]/80">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-semibold text-sm text-slate-200">Event Assistant</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <span className="text-3xl mb-3">🤖</span>
              <p className="text-slate-400 text-sm">Ask me about campus events!</p>
              <p className="text-slate-500 text-xs mt-1">e.g. "Hackathons at IIT this month"</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-orange-500/20 border border-orange-500/30 text-slate-200"
                    : "mr-auto bg-cyan-500/10 border border-cyan-500/20 text-slate-300"
                }`}
              >
                {msg.text}
              </div>

              {msg.role === "ai" && msg.events?.length > 0 && (
                <div className="mt-2 space-y-2 ml-1">
                  {msg.events.map((event) => (
                    <button
                      key={event._id}
                      onClick={() => handleEventClick(event._id)}
                      className="w-full text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {event.collegeId?.name || "Unknown"} · {event.category}
                        {event.eventDate && ` · ${new Date(event.eventDate).toLocaleDateString()}`}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="mr-auto max-w-[85%] p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-3 bg-[#1e2532]/40">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events..."
              className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-[#1e2532] text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:from-orange-400 hover:to-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        data-ai-fab
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
        </svg>
      </button>
    </>
  );
}

export default AiAssistant;
