/**
 * Web Vitals reporting utility.
 *
 * In development: logs metrics to the console.
 * In production:  sends metrics as a JSON beacon to REACT_APP_VITALS_URL
 *                 (if configured). Silently no-ops if the URL is not set.
 *
 * Metric shape: { name, value, rating, delta, id, navigationType }
 * Ratings: 'good' | 'needs-improvement' | 'poor'
 */

const isDev = process.env.NODE_ENV === "development";
const vitalsUrl = process.env.REACT_APP_VITALS_URL;

const sendVitals = (metric) => {
    if (isDev) {
        // eslint-disable-next-line no-console
        console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
        return;
    }

    if (!vitalsUrl) return;

    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        ts: Date.now(),
    });

    // Use sendBeacon when available (non-blocking, survives page unload).
    // Fall back to fetch for environments that don't support it.
    if (navigator.sendBeacon) {
        navigator.sendBeacon(vitalsUrl, new Blob([body], { type: "application/json" }));
    } else {
        fetch(vitalsUrl, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
            keepalive: true,
        });
    }
};

export default sendVitals;
