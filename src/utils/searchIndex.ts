import { CountryJourneyData } from "../types/countryJourney";

// Where a search result takes the reader.
export type SearchTarget =
  | { kind: "page"; page: number | string }
  | { kind: "action"; actionId: number; pathwayIndex?: number; example?: any }
  | { kind: "country"; countryId: string; actionId?: number };

export interface SearchEntry {
  type: string; // label shown on the result, e.g. "Pathway"
  title: string;
  context?: string; // where it lives, e.g. "Action 1"
  body: string;
  target: SearchTarget;
}

export interface SearchResult extends SearchEntry {
  score: number;
  snippet: string;
}

const join = (...parts: unknown[]): string =>
  parts
    .flat(Infinity as 1)
    .filter((p) => typeof p === "string" && p.trim())
    .join(" ");

// Strips markdown/HTML marks so snippets read as plain text.
const clean = (text: string) =>
  text
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function buildSearchIndex(actions: any[], countries: CountryJourneyData[]): SearchEntry[] {
  const entries: SearchEntry[] = [
    { type: "Page", title: "Home", body: "CHAMP Toolkit homepage", target: { kind: "page", page: 0 } },
    { type: "Page", title: "Actions", body: "Overview of the five CHAMP actions", target: { kind: "page", page: "actions" } },
    { type: "Page", title: "Country Journeys", body: "Overview of country journeys", target: { kind: "page", page: "journeys" } },
  ];

  for (const action of actions ?? []) {
    const actionId = Number(action.id);
    const actionLabel = `Action ${actionId}`;
    entries.push({
      type: "Action",
      title: `${actionId}. ${action.title ?? ""}`,
      body: clean(join(action.description, action.systemsLogic)),
      target: { kind: "action", actionId },
    });

    (action.pathways ?? []).forEach((p: any, pathwayIndex: number) => {
      entries.push({
        type: "Pathway",
        title: p.title ?? "",
        context: actionLabel,
        body: clean(
          join(
            p.overview, p.whatItIs, p.whyItIsNeeded, p.potentialNationalLead, p.keyActors, p.transferability,
            p.enablingConditions,
            (p.implementationGuidance ?? []).map((g: any) => [g.title, g.content]),
          ),
        ),
        target: { kind: "action", actionId, pathwayIndex },
      });

      for (const ex of p.illustrativeExamples ?? []) {
        entries.push({
          type: ex.type || "Example",
          title: ex.title ?? "",
          context: `${actionLabel} · ${p.title ?? ""}`,
          body: clean(join(ex.connectionLine, ex.excerpt, ex.fullText)),
          target: { kind: "action", actionId, pathwayIndex, example: ex },
        });
      }
    });
  }

  for (const c of countries ?? []) {
    if (c.published === false) continue;
    entries.push({
      type: "Country Journey",
      title: c.countryName,
      body: clean(
        join(
          c.tagline, c.summary, c.keyMechanisms, c.headerTitle, c.headerDescription, c.modelOverview,
          (c.premises ?? []).map((p) => [p.title, p.description]),
          (c.contextSections ?? []).map((s) => [s.title, s.paragraphs, (s.bulletPoints ?? []).map((b) => [b.label, b.text])]),
        ),
      ),
      target: { kind: "page", page: c.countryId },
    });
    if (!c.isReady) continue;
    for (const a of c.actions ?? []) {
      entries.push({
        type: "Country Action",
        title: a.title,
        context: c.countryName,
        body: clean(join(a.paragraphs, a.caseStudy?.title, a.caseStudy?.paragraphs, a.enabledSummary)),
        target: { kind: "country", countryId: c.countryId, actionId: a.actionNumber },
      });
    }
  }

  return entries;
}

// Lower-cases and drops accents ("São" → "sao") one character at a time, so positions
// in the result line up with the original text (used to place snippets and highlights).
export const normalize = (s: string) =>
  Array.from(s.toLowerCase(), (ch) => {
    const plain = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return plain.length === ch.length ? plain : ch;
  }).join("");

export function queryTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter((t) => t.length > 0);
}

// Every word in the query must appear in the title, context or body.
// Title hits count most; results are ranked by score.
export function searchIndex(entries: SearchEntry[], query: string, limit = 30): SearchResult[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  const results: SearchResult[] = [];

  for (const e of entries) {
    const title = normalize(e.title);
    const context = normalize(e.context ?? "");
    const body = normalize(e.body);
    let score = 0;
    let ok = true;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inContext = context.includes(t);
      const bodyCount = body.split(t).length - 1;
      if (!inTitle && !inContext && bodyCount === 0) { ok = false; break; }
      score += (inTitle ? 10 : 0) + (inContext ? 2 : 0) + Math.min(bodyCount, 5);
      if (title.startsWith(t)) score += 3;
    }
    if (!ok) continue;
    if (title.includes(terms.join(" "))) score += 10;
    if (e.type === "Page" || e.type === "Action" || e.type === "Country Journey") score += 1;
    results.push({ ...e, score, snippet: makeSnippet(e.body, body, terms) });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Short excerpt around the first matching word of the body.
function makeSnippet(body: string, normalizedBody: string, terms: string[]): string {
  const hits = terms.map((t) => normalizedBody.indexOf(t)).filter((i) => i >= 0);
  const at = hits.length ? Math.min(...hits) : 0;
  const start = Math.max(0, at - 60);
  const end = Math.min(body.length, start + 180);
  return (start > 0 ? "…" : "") + body.slice(start, end).trim() + (end < body.length ? "…" : "");
}
