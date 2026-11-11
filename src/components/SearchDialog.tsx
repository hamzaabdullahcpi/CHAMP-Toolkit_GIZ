import { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { CountryJourneyData } from "../types/countryJourney";
import { buildSearchIndex, searchIndex, queryTerms, normalize, SearchResult, SearchTarget } from "../utils/searchIndex";

interface SearchDialogProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  actionsData: any[];
  countryJourneys: CountryJourneyData[];
  onSelect: (target: SearchTarget) => void;
}

// Wraps every query word found in `text` in a <mark>.
function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const lower = normalize(text);
  const marks: boolean[] = new Array(text.length).fill(false);
  for (const t of terms) {
    let i = lower.indexOf(t);
    while (i >= 0) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
      i = lower.indexOf(t, i + t.length);
    }
  }
  const out: ReactNode[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marks[i] !== marks[start]) {
      const piece = text.slice(start, i);
      out.push(marks[start] ? <mark key={start} className="bg-accent-light text-ink rounded-sm">{piece}</mark> : piece);
      start = i;
    }
  }
  return out;
}

export default function SearchDialog({ isOpen, initialQuery = "", onClose, actionsData, countryJourneys, onSelect }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const index = useMemo(() => buildSearchIndex(actionsData, countryJourneys), [actionsData, countryJourneys]);
  const results: SearchResult[] = useMemo(() => searchIndex(index, query), [index, query]);
  const terms = useMemo(() => queryTerms(query), [query]);

  useEffect(() => {
    if (isOpen) {
      setActive(0);
      if (initialQuery) setQuery(initialQuery);
      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        // Carry on typing after what was typed in the sidebar; otherwise select the last query
        if (initialQuery) input.setSelectionRange(input.value.length, input.value.length);
        else input.select();
      });
    }
  }, [isOpen, initialQuery]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!isOpen) return null;

  const choose = (r: SearchResult) => {
    onSelect(r.target);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); choose(results[active]); }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-[2px] flex items-start justify-center px-4 pt-[10vh]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Search the toolkit"
    >
      <div className="w-full max-w-2xl bg-surface shadow-2xl border border-line flex flex-col max-h-[75vh]" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 px-5 border-b border-line">
          <Search size={18} className="text-ink-muted shrink-0 stroke-[1.75]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions, pathways, examples, countries…"
            className="flex-1 py-4 bg-transparent text-base text-ink placeholder:text-ink-muted/70 outline-none"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
            role="combobox"
            aria-expanded={results.length > 0}
            autoComplete="off"
            spellCheck={false}
          />
          <button onClick={onClose} className="p-1.5 text-ink-muted hover:text-ink cursor-pointer" aria-label="Close search">
            <X size={16} className="stroke-[1.5]" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          {terms.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">
              Type to search across the five actions, their pathways and guidance, peer learning examples and country journeys.
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">No results for “{query.trim()}”.</p>
          ) : (
            <ul id="search-results" ref={listRef} role="listbox" className="py-2">
              {results.map((r, i) => (
                <li
                  key={`${r.type}-${r.title}-${i}`}
                  id={`search-result-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(r)}
                  className={`px-5 py-3 cursor-pointer border-l-4 ${i === active ? "bg-paper border-accent" : "border-transparent"}`}
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-accent">
                    <span>{r.type}</span>
                    {r.context && <span className="text-ink-muted normal-case tracking-normal font-medium text-xs truncate">· {r.context}</span>}
                    {i === active && <CornerDownLeft size={12} className="ml-auto text-ink-muted shrink-0" />}
                  </div>
                  <div className="text-sm font-bold text-ink mt-0.5">{highlight(r.title, terms)}</div>
                  {r.snippet && <div className="text-xs text-ink-muted mt-1 line-clamp-2">{highlight(r.snippet, terms)}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
