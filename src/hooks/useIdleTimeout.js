import { useEffect, useRef, useCallback } from "react";

// Events that count as user activity
const ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

/**
 * Fires onIdle after timeoutMs of user inactivity.
 * Resets the timer on any activity event.
 * Only active when enabled is true (e.g. user is logged in).
 *
 * @param {Function} onIdle     - callback fired when idle timeout expires
 * @param {number}   timeoutMs  - inactivity duration in milliseconds
 * @param {boolean}  enabled    - whether the timeout is active
 */
const useIdleTimeout = (onIdle, timeoutMs, enabled) => {
    const timerRef = useRef(null);
    const onIdleRef = useRef(onIdle);

    // Keep onIdleRef current without re-registering event listeners
    useEffect(() => {
        onIdleRef.current = onIdle;
    }, [onIdle]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onIdleRef.current();
        }, timeoutMs);
    }, [timeoutMs]);

    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        // Start the timer immediately on enable
        resetTimer();

        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, resetTimer, { passive: true })
        );

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [enabled, resetTimer]);
};

export default useIdleTimeout;
