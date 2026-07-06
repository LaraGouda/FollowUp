export const SERVICES_DISABLED = true;
export const ANALYSIS_DISABLED = SERVICES_DISABLED;
export const AUTH_DISABLED = SERVICES_DISABLED;

export const PROJECT_HIATUS_TITLE = "Project Update";

export const PROJECT_HIATUS_MESSAGE =
  "This project is currently on a brief hiatus due to expired hackathon access to the NeuralSeek API. We're exploring replacement options and will be back soon.";

const PROJECT_HIATUS_NOTICE_RATE_LIMIT_KEY = "followup-project-hiatus-notice-rate-limit";
const PROJECT_HIATUS_NOTICE_RATE_LIMIT_WINDOW_MS = 60_000;
const PROJECT_HIATUS_NOTICE_RATE_LIMIT_MAX = 3;

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

export const shouldShowProjectHiatusNotice = (now = Date.now()): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const existing = parseRateLimitState(window.localStorage.getItem(PROJECT_HIATUS_NOTICE_RATE_LIMIT_KEY));
    if (!existing || now - existing.windowStart >= PROJECT_HIATUS_NOTICE_RATE_LIMIT_WINDOW_MS) {
      window.localStorage.setItem(
        PROJECT_HIATUS_NOTICE_RATE_LIMIT_KEY,
        JSON.stringify({ windowStart: now, count: 1 }),
      );
      return true;
    }

    if (existing.count >= PROJECT_HIATUS_NOTICE_RATE_LIMIT_MAX) {
      return false;
    }

    window.localStorage.setItem(
      PROJECT_HIATUS_NOTICE_RATE_LIMIT_KEY,
      JSON.stringify({ ...existing, count: existing.count + 1 }),
    );
    return true;
  } catch {
    return true;
  }
};

export const shouldShowAnalysisHiatusNotice = shouldShowProjectHiatusNotice;
