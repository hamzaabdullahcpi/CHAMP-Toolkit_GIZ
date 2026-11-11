import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CONSENT_KEY,
  applyAnalyticsConsent,
  getCookieConsent,
  onCookiePreferencesOpen,
  refreshCookieConsent,
  saveCookieConsent,
} from "../utils/googleAnalytics";
import { PRIVACY_URL, TERMS_URL } from "./Footer";

// Cookie banner, following the Green Finance in India site: Accept, Deny, View / Save Preferences.
// It shows until the visitor chooses, and the footer's "Cookie preferences" link reopens it.
export default function CookieConsent() {
  const [visible, setVisible] = useState(() => getCookieConsent() === null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(() => getCookieConsent()?.analytics === true);
  const preferencesButton = useRef<HTMLButtonElement>(null);
  const functionalSummary = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    applyAnalyticsConsent();
    const removeOpenListener = onCookiePreferencesOpen(() => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setAnalytics(getCookieConsent()?.analytics === true);
      setPreferencesOpen(false);
      setVisible(true);
    });
    // Keep other open tabs of the site in step with a choice made here
    const synchronize = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      const reloadNeeded = refreshCookieConsent();
      const consent = getCookieConsent();
      setAnalytics(consent?.analytics === true);
      setVisible(consent === null);
      if (reloadNeeded) window.location.reload();
    };
    window.addEventListener("storage", synchronize);
    return () => {
      removeOpenListener();
      window.removeEventListener("storage", synchronize);
    };
  }, []);

  useEffect(() => {
    if (preferencesOpen) functionalSummary.current?.focus();
  }, [preferencesOpen]);

  const choose = (granted: boolean) => {
    const reloadNeeded = saveCookieConsent(granted);
    setPreferencesOpen(false);
    setVisible(false);
    returnFocus.current?.focus();
    // Reload after withdrawal so an already-loaded tag cannot keep measuring.
    if (reloadNeeded) window.location.reload();
  };

  if (!visible) return null;

  const buttonClass =
    "inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-3 border text-[14px] font-semibold leading-[18px] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
  const secondaryClass = `${buttonClass} bg-grey-light border-line text-ink hover:bg-paper-strong`;

  return (
    <aside
      aria-labelledby="cookie-consent-title"
      onKeyDown={(event) => {
        if (event.key === "Escape" && preferencesOpen) {
          setPreferencesOpen(false);
          preferencesButton.current?.focus();
        }
      }}
      className="fixed z-[1300] bottom-4 left-4 right-4 lg:left-auto lg:bottom-6 lg:right-6 lg:w-[512px] max-h-[calc(100dvh-32px)] overflow-y-auto p-4 lg:p-6 bg-surface border border-line shadow-lg text-ink rounded-none"
    >
      <h2 id="cookie-consent-title" className="text-[18px] font-semibold leading-6">
        Cookie preferences
      </h2>
      <p className="mt-2 body-text-sm leading-[1.35]">
        We use necessary storage to remember your privacy choices. With your permission, Google Analytics helps us
        understand how this website is used and improve your experience. Read our{" "}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">
          Privacy Notice
        </a>{" "}
        and{" "}
        <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">
          Terms of Use
        </a>
        .
      </p>

      {preferencesOpen && (
        <div id="cookie-preferences" className="mt-4 border border-line body-text-sm leading-[1.35]">
          <details className="p-4">
            <summary ref={functionalSummary} className="cursor-pointer font-semibold">
              Functional <span className="float-right font-normal text-ink-muted">Always active</span>
            </summary>
            <p className="mt-3">Necessary storage remembers your cookie preferences. It cannot be switched off.</p>
          </details>
          <div className="flex items-start gap-4 p-4 border-t border-line">
            <details className="flex-1 min-w-0">
              <summary className="cursor-pointer font-semibold">Analytics</summary>
              <p className="mt-3">
                Optional Google Analytics helps us understand visits and how the toolkit is used. Analytics is only
                enabled when you agree. Advertising and personalized ads remain disabled.
              </p>
            </details>
            <input
              type="checkbox"
              aria-label="Analytics"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="w-[18px] h-[18px] shrink-0 accent-teal cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-[1fr_1fr_max-content] gap-2">
        <button
          type="button"
          onClick={() => choose(true)}
          className={`${buttonClass} bg-teal border-teal text-white hover:bg-dark-green hover:border-dark-green`}
        >
          Accept
        </button>
        <button type="button" onClick={() => choose(false)} className={secondaryClass}>
          Deny
        </button>
        {preferencesOpen ? (
          <button type="button" onClick={() => choose(analytics)} className={`${secondaryClass} col-span-2 lg:col-span-1`}>
            Save preferences
          </button>
        ) : (
          <button
            type="button"
            ref={preferencesButton}
            aria-expanded={preferencesOpen}
            aria-controls="cookie-preferences"
            onClick={() => setPreferencesOpen(true)}
            className={`${secondaryClass} col-span-2 lg:col-span-1`}
          >
            View preferences <ChevronDown size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
}
