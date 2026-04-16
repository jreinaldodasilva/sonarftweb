// src/utils/api.test.js
import {
    getBotIds,
    getOrders,
    getTrades,
    getDefaultParameters,
    getParameters,
    updateParameters,
    getDefaultIndicators,
    getIndicators,
    updateIndicators,
    getAuthToken,
} from "./api";
import {
    mockBotIds,
    mockOrder,
    mockTrade,
    mockParameters,
    mockIndicators,
    mockResponse,
} from "../mocks/fixtures";

// Mock netlify-identity-widget (already mocked globally in setupTests.js)
// Mock fetch globally
global.fetch = jest.fn();

// Mock the local JSON fallbacks
jest.mock("./parameterOptions.json", () => ({
    exchanges: { Binance: true },
    symbols: { "BTC/USDT": true },
}));
jest.mock("./indicatorOptions.json", () => ({
    periods: { "5min": true },
    oscillators: {},
    movingaverages: {},
}));

beforeEach(() => {
    fetch.mockClear();
});

// ### getAuthToken ###

describe("getAuthToken", () => {
    it("returns null when no user is logged in", () => {
        // netlify-identity-widget mock returns null from currentUser()
        expect(getAuthToken()).toBeNull();
    });
});

// ### getBotIds ###

describe("getBotIds", () => {
    it("returns bot IDs on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse({ botids: mockBotIds }));
        const result = await getBotIds("client_123");
        expect(result).toEqual(mockBotIds);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/botids/client_123"),
            expect.objectContaining({ method: "GET" })
        );
    });

    it("includes Authorization header when token is available", async () => {
        const netlifyIdentity = require("netlify-identity-widget");
        netlifyIdentity.currentUser.mockReturnValueOnce({
            token: { access_token: "test-jwt" },
        });
        fetch.mockResolvedValueOnce(mockResponse({ botids: mockBotIds }));
        await getBotIds("client_123");
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer test-jwt",
                }),
            })
        );
    });

    it("throws on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        await expect(getBotIds("client_123")).rejects.toThrow("HTTP error! status: 500");
    });

    it("throws on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        await expect(getBotIds("client_123")).rejects.toThrow("Network error");
    });
});

// ### getOrders ###

describe("getOrders", () => {
    it("returns order data on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse([mockOrder]));
        const result = await getOrders("bot_001");
        expect(result).toEqual([mockOrder]);
    });

    it("returns null when response is not ok", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 404));
        const result = await getOrders("bot_001");
        expect(result).toBeNull();
    });

    it("returns null on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        const result = await getOrders("bot_001");
        expect(result).toBeNull();
    });
});

// ### getTrades ###

describe("getTrades", () => {
    it("returns trade data on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse([mockTrade]));
        const result = await getTrades("bot_001");
        expect(result).toEqual([mockTrade]);
    });

    it("returns null when response is not ok", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 404));
        const result = await getTrades("bot_001");
        expect(result).toBeNull();
    });

    it("returns null on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        const result = await getTrades("bot_001");
        expect(result).toBeNull();
    });
});

// ### getDefaultParameters ###

describe("getDefaultParameters", () => {
    it("returns server data on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse(mockParameters));
        const result = await getDefaultParameters();
        expect(result).toEqual(mockParameters);
    });

    it("falls back to local JSON on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        const result = await getDefaultParameters();
        expect(result).toHaveProperty("exchanges");
        expect(result).toHaveProperty("symbols");
    });

    it("falls back to local JSON on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        const result = await getDefaultParameters();
        expect(result).toHaveProperty("exchanges");
    });
});

// ### getParameters ###

describe("getParameters", () => {
    it("returns parameters on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse(mockParameters));
        const result = await getParameters("client_123");
        expect(result).toEqual(mockParameters);
    });

    it("throws on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 404));
        await expect(getParameters("client_123")).rejects.toThrow("HTTP error! status: 404");
    });

    it("throws on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        await expect(getParameters("client_123")).rejects.toThrow("Network error");
    });
});

// ### updateParameters ###

describe("updateParameters", () => {
    it("sends POST with parameters body and returns response", async () => {
        fetch.mockResolvedValueOnce(mockResponse({ message: "ok" }));
        const result = await updateParameters("client_123", mockParameters);
        expect(result).toEqual({ message: "ok" });
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/bot/set_parameters/client_123"),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(mockParameters),
            })
        );
    });

    it("throws on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        await expect(updateParameters("client_123", mockParameters)).rejects.toThrow();
    });
});

// ### getDefaultIndicators ###

describe("getDefaultIndicators", () => {
    it("returns server data on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse(mockIndicators));
        const result = await getDefaultIndicators();
        expect(result).toEqual(mockIndicators);
    });

    it("falls back to local JSON on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        const result = await getDefaultIndicators();
        expect(result).toHaveProperty("periods");
    });

    it("falls back to local JSON on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));
        const result = await getDefaultIndicators();
        expect(result).toHaveProperty("periods");
    });
});

// ### getIndicators ###

describe("getIndicators", () => {
    it("returns indicators on success", async () => {
        fetch.mockResolvedValueOnce(mockResponse(mockIndicators));
        const result = await getIndicators("client_123");
        expect(result).toEqual(mockIndicators);
    });

    it("throws on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 404));
        await expect(getIndicators("client_123")).rejects.toThrow("HTTP error! status: 404");
    });
});

// ### updateIndicators ###

describe("updateIndicators", () => {
    it("sends POST with indicators body and returns response", async () => {
        fetch.mockResolvedValueOnce(mockResponse({ message: "ok" }));
        const result = await updateIndicators("client_123", mockIndicators);
        expect(result).toEqual({ message: "ok" });
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/bot/set_indicators/client_123"),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(mockIndicators),
            })
        );
    });

    it("throws on HTTP error", async () => {
        fetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        await expect(updateIndicators("client_123", mockIndicators)).rejects.toThrow();
    });
});
