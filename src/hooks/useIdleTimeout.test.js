import { renderHook, act } from "@testing-library/react";
import useIdleTimeout from "./useIdleTimeout";

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
});

describe("useIdleTimeout", () => {
    it("fires onIdle after the timeout when enabled", () => {
        const onIdle = jest.fn();
        renderHook(() => useIdleTimeout(onIdle, 5000, true));

        act(() => { jest.advanceTimersByTime(5000); });

        expect(onIdle).toHaveBeenCalledTimes(1);
    });

    it("does NOT fire onIdle when disabled", () => {
        const onIdle = jest.fn();
        renderHook(() => useIdleTimeout(onIdle, 5000, false));

        act(() => { jest.advanceTimersByTime(10000); });

        expect(onIdle).not.toHaveBeenCalled();
    });

    it("resets the timer on user activity", () => {
        const onIdle = jest.fn();
        renderHook(() => useIdleTimeout(onIdle, 5000, true));

        // Advance 4s — not yet fired
        act(() => { jest.advanceTimersByTime(4000); });
        expect(onIdle).not.toHaveBeenCalled();

        // Simulate activity — resets timer
        act(() => {
            window.dispatchEvent(new Event("mousemove"));
        });

        // Advance another 4s — still not fired (timer reset to 5s)
        act(() => { jest.advanceTimersByTime(4000); });
        expect(onIdle).not.toHaveBeenCalled();

        // Advance the remaining 1s — now fires
        act(() => { jest.advanceTimersByTime(1000); });
        expect(onIdle).toHaveBeenCalledTimes(1);
    });

    it("clears the timer when disabled mid-session", () => {
        const onIdle = jest.fn();
        const { rerender } = renderHook(
            ({ enabled }) => useIdleTimeout(onIdle, 5000, enabled),
            { initialProps: { enabled: true } }
        );

        act(() => { jest.advanceTimersByTime(3000); });

        // Disable before timeout fires
        rerender({ enabled: false });

        act(() => { jest.advanceTimersByTime(5000); });
        expect(onIdle).not.toHaveBeenCalled();
    });

    it("clears event listeners and timer on unmount", () => {
        const onIdle = jest.fn();
        const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = renderHook(() => useIdleTimeout(onIdle, 5000, true));
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalled();
        // Timer should be cleared — no fire after unmount
        act(() => { jest.advanceTimersByTime(10000); });
        expect(onIdle).not.toHaveBeenCalled();

        removeEventListenerSpy.mockRestore();
    });
});
