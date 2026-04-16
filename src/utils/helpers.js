import { getOrders, getTrades } from "./api";

export const fetchAllOrders = async (botIds) => {
    const results = await Promise.all(botIds.map((id) => getOrders(id)));
    return results.filter(Boolean).flat();
};

export const fetchAllTrades = async (botIds) => {
    const results = await Promise.all(botIds.map((id) => getTrades(id)));
    return results.filter(Boolean).flat();
};
