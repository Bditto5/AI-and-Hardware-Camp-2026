import type { CodeProject } from "../storage/projectStore";

export type CodeSuggestionTarget = "html" | "css" | "javascript";

export interface CodeSuggestion {
  summary: string;
  explanation: string;
  html?: string;
  css?: string;
  javascript?: string;
}

interface SuggestionPayload {
  summary?: unknown;
  explanation?: unknown;
  html?: unknown;
  css?: unknown;
  javascript?: unknown;
}

function candidateJsonBlocks(text: string): string[] {
  const candidates: string[] = [];
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(text.slice(firstBrace, lastBrace + 1));
  }
  return [...new Set(candidates)];
}

function optionalCode(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function parseCodeSuggestion(text: string): CodeSuggestion {
  for (const candidate of candidateJsonBlocks(text)) {
    try {
      const parsed = JSON.parse(candidate) as SuggestionPayload;
      if (!parsed || typeof parsed !== "object") continue;

      const suggestion: CodeSuggestion = {
        summary: typeof parsed.summary === "string" && parsed.summary.trim()
          ? parsed.summary.trim()
          : "AI code suggestion",
        explanation: typeof parsed.explanation === "string" ? parsed.explanation.trim() : "",
        html: optionalCode(parsed.html),
        css: optionalCode(parsed.css),
        javascript: optionalCode(parsed.javascript),
      };
      if (suggestion.html !== undefined || suggestion.css !== undefined || suggestion.javascript !== undefined) {
        return suggestion;
      }
    } catch {
      // Try the next JSON-shaped block.
    }
  }
  throw new Error("The coach explained its idea but did not return a reviewable code suggestion. Try asking for one small, specific change.");
}

export function changedSuggestionTargets(project: CodeProject, suggestion: CodeSuggestion): CodeSuggestionTarget[] {
  return (["html", "css", "javascript"] as const).filter(
    (target) => suggestion[target] !== undefined && suggestion[target] !== project[target],
  );
}

export function applyCodeSuggestion(
  project: CodeProject,
  suggestion: CodeSuggestion,
  targets: CodeSuggestionTarget[],
): CodeProject {
  const next = { ...project };
  for (const target of targets) {
    const value = suggestion[target];
    if (value !== undefined) next[target] = value;
  }
  return { ...next, updatedAt: Date.now() };
}
