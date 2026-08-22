export const PRODUCES = ["text/html", "text/markdown"] as const;

export type ProducedType = (typeof PRODUCES)[number];

type AcceptEntry = {
  q: number;
  specificity: number;
  type: string;
};

const parseAccept = (header: string): AcceptEntry[] => {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((token) => token.trim());
    const type = (parts.at(0) ?? "").toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((token) => token.trim());
      if (name === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          q = Math.max(0, Math.min(1, parsed));
        }
      }
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    return { q, specificity, type };
  });
};

const matches = (entry: AcceptEntry, candidate: string): boolean => {
  if (entry.type === "*/*") {
    return true;
  }
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
};

const mostSpecificMatch = (
  entries: AcceptEntry[],
  candidate: string
): { entry: AcceptEntry; position: number } | null => {
  let matched: AcceptEntry | null = null;
  let matchedPosition = Number.POSITIVE_INFINITY;

  for (let idx = 0; idx < entries.length; idx += 1) {
    const entry = entries.at(idx);
    if (!(entry && matches(entry, candidate))) {
      continue;
    }
    if (
      matched === null ||
      entry.specificity > matched.specificity ||
      (entry.specificity === matched.specificity && idx < matchedPosition)
    ) {
      matched = entry;
      matchedPosition = idx;
    }
  }

  if (matched === null) {
    return null;
  }
  return { entry: matched, position: matchedPosition };
};

export const preferredType = (header: string | null): ProducedType | null => {
  if (!header) {
    return "text/html";
  }

  const entries = parseAccept(header);
  if (entries.length === 0) {
    return "text/html";
  }

  let bestType: ProducedType | null = null;
  let bestQ = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of PRODUCES) {
    const matched = mostSpecificMatch(entries, candidate);
    if (matched === null || matched.entry.q <= 0) {
      continue;
    }

    if (
      matched.entry.q > bestQ ||
      (matched.entry.q === bestQ && matched.position < bestPosition)
    ) {
      bestQ = matched.entry.q;
      bestPosition = matched.position;
      bestType = candidate;
    }
  }

  return bestType;
};

export const appendVaryAccept = (headers: Headers): void => {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept, Accept-Encoding");
    return;
  }

  const tokens = existing.split(",").map((token) => token.trim().toLowerCase());
  let vary = existing;
  if (!tokens.includes("accept")) {
    vary = `${vary}, Accept`;
  }
  if (!tokens.includes("accept-encoding")) {
    vary = `${vary}, Accept-Encoding`;
  }
  headers.set("Vary", vary);
};

export const isRscRequest = (headers: Headers): boolean => {
  return (
    headers.has("rsc") ||
    headers.has("next-router-state-tree") ||
    headers.has("next-router-prefetch") ||
    headers.has("next-url")
  );
};

export const MARKDOWN_VARY = "Accept, Accept-Encoding";
