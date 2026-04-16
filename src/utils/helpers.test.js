// src/utils/helpers.test.js
import { fetchAllOrders, fetchAllTrades } from "./helpers";
import { getOrders, getTrades } from "./api";
import { mockOrder, mockTrade } from "../mocks/fixtures";

jest.mock("./api");

beforeEach(() => {
    jest.clearAllMocks();
});

// ### fetchAllOrders ###

describe("fetchAllOrders", () => {
    it("aggregates orders from all bot IDs", async () => {
        getOrders
            .mockResolvedValueOnce([mockOrder])
            .mockResolvedValueOnce([{ ...mockOrder, buy_exchange: "okx" }]);

        const result = await fetchAllOrders(["bot_001", "bot_002"]);
        expect(result).toHaveLength(2);
        expect(getOrders).toHaveBeenCalledTimes(2);
        expect(getOrders).toHaveBeenCalledWith("bot_001");
        expect(getOrders).toHaveBeenCalledWith("bot_002");
    });

    it("skips null responses (failed fetches)", async () => {
        getOrders
            .mockResolvedValueOnce([mockOrder])
            .mockResolvedValueOnce(null);

        const result = await fetchAllOrders(["bot_001", "bot_002"]);
        expect(result).toHaveLength(1);
    });

    it("returns empty array for empty botIds", async () => {
        const result = await fetchAllOrders([]);
        expect(result).toEqual([]);
        expect(getOrders).not.toHaveBeenCalled();
    });

    it("returns empty array when all fetches return null", async () => {
        getOrders.mockResolvedValue(null);
        const result = await fetchAllOrders(["bot_001", "bot_002"]);
        expect(result).toEqual([]);
    });
});

// ### fetchAllTrades ###

describe("fetchAllTrades", () => {
    it("aggregates trades from all bot IDs", async () => {
        getTrades
            .mockResolvedValueOnce([mockTrade])
            .mockResolvedValueOnce([{ ...mockTrade, buy_exchange: "okx" }]);

        const result = await fetchAllTrades(["bot_001", "bot_002"]);
        expect(result).toHaveLength(2);
        expect(getTrades).toHaveBeenCalledTimes(2);
    });

    it("skips null responses", async () => {
        getTrades
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce([mockTrade]);

        const result = await fetchAllTrades(["bot_001", "bot_002"]);
        expect(result).toHaveLength(1);
    });

    it("returns empty array for empty botIds", async () => {
        const result = await fetchAllTrades([]);
        expect(result).toEqual([]);
        expect(getTrades).not.toHaveBeenCalled();
    });
});
