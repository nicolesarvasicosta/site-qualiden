const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

let initialized = false;

// Loads Google Analytics once. Does nothing when no measurement ID is configured,
// so local development and unconfigured deploys send no data.
export function initAnalytics() {
  if (initialized || !MEASUREMENT_ID) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  // gtag.js only recognises the `arguments` object here; pushing a plain array
  // makes it silently ignore every command.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.gtag = function gtag(..._args: GtagArgs) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  // Page views are sent manually on route changes (see trackPageView)
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.('event', name, params);
}
