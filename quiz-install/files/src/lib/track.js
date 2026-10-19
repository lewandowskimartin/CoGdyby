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

function analyticsAccepted() {
  try {
    const rec = JSON.parse(localStorage.getItem('pah_consent') || 'null');
    return !!(rec && rec.preferences && rec.preferences.analytics);
  } catch {
    return false;
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
