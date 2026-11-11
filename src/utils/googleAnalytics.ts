// Consent-gated Google Analytics, ported from the Green Finance in India site.
// No Google tag loads until a visitor accepts. Uses the CHAMP GA4 property by default;
// set VITE_GA_MEASUREMENT_ID (e.g. "G-XXXXXXX") to point at a different property.

export const CONSENT_KEY = "champ-cookie-consent-v1";
const OPEN_EVENT = "champ-cookie-preferences-open";
const SCRIPT_ID = "champ-google-analytics";
const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
const DEFAULT_MEASUREMENT_ID = "G-X3J71SJ7HS";
const configuredId = String(import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID).trim();
const measurementId = /^G-[A-Z0-9]+$/.test(configuredId) ? configuredId : "";

export interface CookieConsentChoice {
  version: 1;
  analytics: boolean;
  expiresAt: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

let sessionChoice: CookieConsentChoice | null | undefined;
let loaded = false;

export function getCookieConsent(): CookieConsentChoice | null {
  let choice = sessionChoice;
  if (choice === undefined) {
    try {
      choice = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
    } catch {
      return null;
    }
  }
  return choice?.version === 1 && typeof choice.analytics === "boolean" &&
    Number.isFinite(choice.expiresAt) && choice.expiresAt > Date.now()
    ? choice : null;
}

function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((part) => part.trim().split("=")[0])
    .filter((name) => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const domains = ["", hostname];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`.${parts.slice(i).join(".")}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

// Loads or unloads the Google tag to match the stored choice. Returns true when the page
// must reload to fully stop a tag that was already running.
export function applyAnalyticsConsent(): boolean {
  const allowed = getCookieConsent()?.analytics === true;
  if (measurementId) window[`ga-disable-${measurementId}`] = !allowed;
  if (!allowed) {
    clearAnalyticsCookies();
    document.getElementById(SCRIPT_ID)?.remove();
    const reloadNeeded = loaded;
    loaded = false;
    return reloadNeeded;
  }
  if (!measurementId || loaded) return false;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  // Events before consent are discarded, rather than replayed after acceptance.
  window.gtag = function () {
    // gtag expects the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    if (getCookieConsent()?.analytics === true) window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onerror = () => {
    script.remove();
    loaded = false;
  };
  document.head.appendChild(script);
  return false;
}

export function saveCookieConsent(analytics: boolean): boolean {
  sessionChoice = {
    version: 1, analytics: analytics === true,
    expiresAt: Date.now() + CONSENT_LIFETIME,
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(sessionChoice));
  } catch {
    // The current choice still applies if this browser blocks local storage.
  }
  return applyAnalyticsConsent();
}

export function refreshCookieConsent(): boolean {
  sessionChoice = undefined;
  return applyAnalyticsConsent();
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onCookiePreferencesOpen(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
