// src/hooks/useWebSocket.test.js
import { renderHook, act } from "@testing-library/react";
import useWebSocket from "./useWebSocket";

// WebSocket mock factory
const createMockWs = () => ({
    close: jest.fn(),
    send: jest.fn(),
    onopen: null,
    onclose: null,
    onerror: null,
    readyState: WebSocket.OPEN,
});

let mockWsInstance;

beforeEach(() => {
    jest.useFakeTimers();
    mockWsInstance = createMockWs();
    global.WebSocket = jest.fn(() => mockWsInstance);
});

afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
});

// ### Connection ###

describe("useWebSocket — connection", () => {
    it("opens a WebSocket connection on mount", () => {
        renderHook(() => useWebSocket("ws://localhost:5000/ws/test"));
        expect(WebSocket).toHaveBeenCalledWith("ws://localhost:5000/ws/test");
        expect(WebSocket).toHaveBeenCalledTimes(1);
    });

    it("sets wsOpen to true when connection opens", () => {
        const { result } = renderHook(() => useWebSocket("ws://test"));
        act(() => { mockWsInstance.onopen(); });
        expect(result.current.wsOpen).toBe(true);
    });

    it("sets wsOpen to false when connection closes", () => {
        const { result } = renderHook(() => useWebSocket("ws://test", false));
        act(() => { mockWsInstance.onopen(); });
        expect(result.current.wsOpen).toBe(true);
        act(() => { mockWsInstance.onclose(); });
        expect(result.current.wsOpen).toBe(false);
    });

    it("returns socket instance after connection opens", () => {
        const { result } = renderHook(() => useWebSocket("ws://test"));
        act(() => { mockWsInstance.onopen(); });
        expect(result.current.socket).toBe(mockWsInstance);
    });
});

// ### Error handling ###

describe("useWebSocket — error handling", () => {
    it("sets wsError when onerror fires", () => {
        const { result } = renderHook(() => useWebSocket("ws://test"));
        act(() => { mockWsInstance.onerror(); });
        expect(result.current.wsError).toBeTruthy();
        expect(typeof result.current.wsError).toBe("string");
    });

    it("clears wsError when connection successfully opens", () => {
        const { result } = renderHook(() => useWebSocket("ws://test"));
        act(() => { mockWsInstance.onerror(); });
        expect(result.current.wsError).toBeTruthy();
        act(() => { mockWsInstance.onopen(); });
        expect(result.current.wsError).toBeNull();
    });
});

// ### Memory leak regression (W1) ###

describe("useWebSocket — memory leak fix", () => {
    it("does NOT create a new WebSocket after unmount (memory leak regression)", () => {
        const { unmount } = renderHook(() => useWebSocket("ws://test", true));
        act(() => { mockWsInstance.onopen(); });

        // Unmount — should set shouldReconnect.current = false
        unmount();

        // Simulate the close event that unmount triggers
        act(() => {
            if (mockWsInstance.onclose) mockWsInstance.onclose();
        });

        // Advance timers to trigger any pending reconnect setTimeout
        act(() => { jest.runAllTimers(); });

        // WebSocket should only have been constructed once (on mount)
        expect(WebSocket).toHaveBeenCalledTimes(1);
    });

    it("closes the socket on unmount", () => {
        const { unmount } = renderHook(() => useWebSocket("ws://test"));
        act(() => { mockWsInstance.onopen(); });
        unmount();
        expect(mockWsInstance.close).toHaveBeenCalled();
    });
});

// ### Reconnect with backoff ###

describe("useWebSocket — reconnect backoff", () => {
    it("reconnects after close when autoReconnect is true", () => {
        renderHook(() => useWebSocket("ws://test", true));
        act(() => { mockWsInstance.onopen(); });
        act(() => { mockWsInstance.onclose(); });

        // First backoff delay is 1000ms
        act(() => { jest.advanceTimersByTime(1000); });
        expect(WebSocket).toHaveBeenCalledTimes(2);
    });

    it("does NOT reconnect when autoReconnect is false", () => {
        renderHook(() => useWebSocket("ws://test", false));
        act(() => { mockWsInstance.onopen(); });
        act(() => { mockWsInstance.onclose(); });
        act(() => { jest.runAllTimers(); });
        expect(WebSocket).toHaveBeenCalledTimes(1);
    });

    it("uses exponential backoff on repeated failures", () => {
        const secondMockWs = createMockWs();
        WebSocket
            .mockImplementationOnce(() => mockWsInstance)
            .mockImplementationOnce(() => secondMockWs);

        renderHook(() => useWebSocket("ws://test", true));

        // First close — backoff 1s
        act(() => { mockWsInstance.onclose(); });
        act(() => { jest.advanceTimersByTime(999); });
        expect(WebSocket).toHaveBeenCalledTimes(1); // not yet

        act(() => { jest.advanceTimersByTime(1); });
        expect(WebSocket).toHaveBeenCalledTimes(2); // reconnected

        // Second close — backoff 2s
        act(() => { secondMockWs.onclose(); });
        act(() => { jest.advanceTimersByTime(1999); });
        expect(WebSocket).toHaveBeenCalledTimes(2); // not yet

        act(() => { jest.advanceTimersByTime(1); });
        expect(WebSocket).toHaveBeenCalledTimes(3); // reconnected
    });
});
