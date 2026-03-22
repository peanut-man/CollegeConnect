import { useState, useEffect, useRef } from "react";
import api from "../services/api";

function CollegeSelect({ value, onChange, required = false }) {
  const [query, setQuery] = useState("");
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setColleges([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get("/colleges/search", {
          params: { q: query, limit: 10 },
          signal: controller.signal,
        });
        setColleges(response.data?.data || []);
        setHighlightIndex(-1);
      } catch (error) {
        if (error.name !== "CanceledError") {
          setColleges([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(college) {
    setSelectedCollege(college);
    setQuery(college.name);
    setIsOpen(false);
    onChange({ target: { name: "collegeId", value: college._id } });
  }

  function handleInputChange(event) {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setIsOpen(true);

    if (!newQuery.trim()) {
      setSelectedCollege(null);
      onChange({ target: { name: "collegeId", value: "" } });
    }
  }

  function handleKeyDown(event) {
    if (!isOpen || colleges.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightIndex((prev) =>
          prev < colleges.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : colleges.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (highlightIndex >= 0 && colleges[highlightIndex]) {
          handleSelect(colleges[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  const showDropdown = isOpen && (loading || colleges.length > 0 || query.trim());

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search for your college..."
        className="w-full"
        autoComplete="off"
      />
      <input type="hidden" name="collegeId" value={value} required={required} />

      {showDropdown && (
        <ul className="absolute bg-[#1e2532] border border-white/10 w-full mt-1 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-50 max-h-60 overflow-y-auto">
          {loading && (
            <li className="p-3 text-[var(--color-muted)]">Searching...</li>
          )}

          {!loading && colleges.length === 0 && query.trim() && (
            <li className="p-3 text-[var(--color-muted)]">No colleges found</li>
          )}

          {!loading &&
            colleges.map((college, index) => (
              <li
                key={college._id}
                onClick={() => handleSelect(college)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`p-3 cursor-pointer transition-colors ${
                  index === highlightIndex
                    ? "bg-white/10 text-amber-300"
                    : "hover:bg-white/5"
                }`}
              >
                {college.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default CollegeSelect;
