// Quiz analytics. Sends events to:
//  - Google Analytics 4, only if the visitor accepted analytics in the cookie banner
//    (CookieConsent.astro creates window.dataLayer only after consent);
//  - PostHog, only if PUBLIC_POSTHOG_KEY is set (see components/PostHog.astro).
// Never pass personal data: only score, band and area ids.

function sendGa(event, props, beacon) {
  if (!Array.isArray(window.dataLayer)) return false;
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('event', event, beacon ? { ...props, transport_type: 'beacon' } : props);
  return true;
}

const phQueue = [];
let phListening = false;
function sendPostHog(event, props, beacon) {
  if (!window.__phConfig) return; // PostHog off
  const send = (e, p, b) => {
    try { window.posthog.capture(e, p, b ? { transport: 'sendBeacon' } : undefined); } catch { /* ignore */ }
  };
  if (window.posthog && typeof window.posthog.capture === 'function') return send(event, props, beacon);
  phQueue.push([event, props, beacon]);
  if (!phListening) {
    phListening = true;
    window.addEventListener('posthog:ready', () => phQueue.splice(0).forEach((q) => send(...q)), { once: true });
  }
}

// The consent record lives in localStorage, or in a first-party cookie when localStorage is
// unavailable (see components/CookieConsent.astro). Read whichever one is there.
const CONSENT_KEY = 'pah_consent';
function readConsentRaw() {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v) return v;
  } catch {
    /* storage blocked — try the cookie */
  }
  try {
    const prefix = CONSENT_KEY + '=';
    const hit = document.cookie.split('; ').find((c) => c.slice(0, prefix.length) === prefix);
    return hit ? decodeURIComponent(hit.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

function analyticsAccepted() {
  try {
    const rec = JSON.parse(readConsentRaw() || 'null');
    return !!(rec && rec.preferences && rec.preferences.analytics);
  } catch {
    return false;
  }
}

// Early Access placement hand-off. Internal links to /early-access/ carry no ?src= (it made
// duplicate URLs for crawlers), so the placement clicked (data-ea-cta) is kept in
// sessionStorage for the Early Access page to attach to ea_checkout_clicked. Written only with
// analytics consent, same rule as GA; without it the page falls back to the referring path.
const EA_SRC_KEY = 'pah_ea_src';
export function rememberEaSource(location) {
  if (!location || !analyticsAccepted()) return;
  try {
    sessionStorage.setItem(EA_SRC_KEY, String(location).slice(0, 64));
  } catch {
    /* storage blocked */
  }
}
export function readEaSource() {
  try {
    return sessionStorage.getItem(EA_SRC_KEY) || null;
  } catch {
    return null;
  }
}

export function track(event, props = {}, { beacon = false } = {}) {
  if (typeof window === 'undefined') return;
  try {
    // CookieConsent.astro starts GA on DOMContentLoaded, which can be after this runs.
    // If the visitor accepted analytics, retry once GA is there (DOMContentLoaded, then load).
    if (!sendGa(event, props, beacon) && analyticsAccepted() && document.readyState !== 'complete') {
      let done = false;
      const retry = () => { if (!done && sendGa(event, props, beacon)) done = true; };
      document.addEventListener('DOMContentLoaded', retry, { once: true });
      window.addEventListener('load', retry, { once: true });
    }
    sendPostHog(event, props, beacon);
  } catch {
    /* analytics must never break the page */
  }
}
