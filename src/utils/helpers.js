import { getOrders, getTrades } from "./api";

export const fetchAllOrders = async (botIds) => {
  const allOrders = [];
  for (const id of botIds) {
    const orderData = await getOrders(id);
    if (orderData) allOrders.push(...orderData);
  }
  return allOrders;
};

export const fetchAllTrades = async (botIds) => {
  const allTrades = [];
  for (const id of botIds) {
    const tradeData = await getTrades(id);
    if (tradeData) allTrades.push(...tradeData);
  }
  return allTrades;
};
