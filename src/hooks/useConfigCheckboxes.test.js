import { renderHook, act, waitFor } from "@testing-library/react";
import useConfigCheckboxes from "./useConfigCheckboxes";
import { mockParameters } from "../mocks/fixtures";

const mockFetchFn = jest.fn();
const mockDefaultFn = jest.fn();
const mockUpdateFn = jest.fn();

const defaultConfig = {
    storageKey: "testState",
    defaultState: { exchanges: {}, symbols: {} },
    fetchFn: mockFetchFn,
    defaultFn: mockDefaultFn,
    updateFn: mockUpdateFn,
    stateKeys: ["exchanges", "symbols"],
    clientId: "client_123",
};

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

describe("useConfigCheckboxes — data loading", () => {
    it("loads config from server on mount", async () => {
        mockFetchFn.mockResolvedValueOnce(mockParameters);
        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));

        await waitFor(() =>
            expect(result.current.config.exchanges).toEqual(mockParameters.exchanges)
        );
        expect(mockFetchFn).toHaveBeenCalledWith("client_123");
    });

    it("falls back to localStorage when server fails", async () => {
        mockFetchFn.mockRejectedValueOnce(new Error("Network error"));
        localStorage.setItem("testState", JSON.stringify(mockParameters));

        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));

        await waitFor(() =>
            expect(result.current.config.exchanges).toEqual(mockParameters.exchanges)
        );
        expect(mockDefaultFn).not.toHaveBeenCalled();
    });

    it("falls back to bundled defaults when server and localStorage both fail", async () => {
        mockFetchFn.mockRejectedValueOnce(new Error("Network error"));
        mockDefaultFn.mockResolvedValueOnce(mockParameters);

        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));

        await waitFor(() =>
            expect(result.current.config.exchanges).toEqual(mockParameters.exchanges)
        );
        expect(mockDefaultFn).toHaveBeenCalled();
    });

    it("initialises from localStorage synchronously before server responds", () => {
        localStorage.setItem("testState", JSON.stringify(mockParameters));
        mockFetchFn.mockResolvedValueOnce(mockParameters);

        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));

        // Synchronous initial state from localStorage
        expect(result.current.config.exchanges).toEqual(mockParameters.exchanges);
    });
});

describe("useConfigCheckboxes — checkbox interaction", () => {
    it("updates config and localStorage on checkbox change", async () => {
        mockFetchFn.mockResolvedValueOnce(mockParameters);
        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));

        await waitFor(() => expect(result.current.config.exchanges).toBeDefined());

        act(() => {
            result.current.handleCheckboxChange(
                { target: { name: "Okx", checked: true } },
                "exchanges"
            );
        });

        expect(result.current.config.exchanges.Okx).toBe(true);
        const stored = JSON.parse(localStorage.getItem("testState"));
        expect(stored.exchanges.Okx).toBe(true);
    });
});

describe("useConfigCheckboxes — save", () => {
    it("sets saveStatus to saved on successful update", async () => {
        mockFetchFn.mockResolvedValueOnce(mockParameters);
        mockUpdateFn.mockResolvedValueOnce({ message: "ok" });

        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));
        await waitFor(() => expect(result.current.config.exchanges).toBeDefined());

        await act(async () => { await result.current.handleSave(); });

        expect(result.current.saveStatus).toBe("saved");
        expect(mockUpdateFn).toHaveBeenCalledWith("client_123", result.current.config);
    });

    it("sets saveStatus to error on failed update", async () => {
        mockFetchFn.mockResolvedValueOnce(mockParameters);
        mockUpdateFn.mockRejectedValueOnce(new Error("Server error"));

        const { result } = renderHook(() => useConfigCheckboxes(defaultConfig));
        await waitFor(() => expect(result.current.config.exchanges).toBeDefined());

        await act(async () => { await result.current.handleSave(); });

        expect(result.current.saveStatus).toBe("error");
    });
});
