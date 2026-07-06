export const ANALYSIS_DISABLED = true;

export const PROJECT_HIATUS_TITLE = "Project Update";

export const PROJECT_HIATUS_MESSAGE =
  "This project is currently on a brief hiatus due to expired hackathon access to the NeuralSeek API. We're exploring replacement options and will be back soon.";

const ANALYSIS_NOTICE_RATE_LIMIT_KEY = "followup-analysis-hiatus-notice-rate-limit";
const ANALYSIS_NOTICE_RATE_LIMIT_WINDOW_MS = 60_000;
const ANALYSIS_NOTICE_RATE_LIMIT_MAX = 3;

type RateLimitState = {
  windowStart: number;
  count: number;
};

const parseRateLimitState = (value: string | null): RateLimitState | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as RateLimitState).windowStart === "number" &&
      typeof (parsed as RateLimitState).count === "number"
    ) {
      return parsed as RateLimitState;
    }
  } catch {
    return null;
  }

  return null;
};

export const shouldShowAnalysisHiatusNotice = (now = Date.now()): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const existing = parseRateLimitState(window.localStorage.getItem(ANALYSIS_NOTICE_RATE_LIMIT_KEY));
    if (!existing || now - existing.windowStart >= ANALYSIS_NOTICE_RATE_LIMIT_WINDOW_MS) {
      window.localStorage.setItem(
        ANALYSIS_NOTICE_RATE_LIMIT_KEY,
        JSON.stringify({ windowStart: now, count: 1 }),
      );
      return true;
    }

    if (existing.count >= ANALYSIS_NOTICE_RATE_LIMIT_MAX) {
      return false;
    }

    window.localStorage.setItem(
      ANALYSIS_NOTICE_RATE_LIMIT_KEY,
      JSON.stringify({ ...existing, count: existing.count + 1 }),
    );
    return true;
  } catch {
    return true;
  }
};
