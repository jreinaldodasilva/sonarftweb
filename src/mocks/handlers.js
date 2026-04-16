import { http, HttpResponse } from "msw";
import {
    mockBotIds,
    mockOrder,
    mockTrade,
    mockParameters,
    mockIndicators,
} from "./fixtures";

const API = "http://localhost:5000";

export const handlers = [
    // Bot IDs
    http.get(`${API}/botids/:clientId`, () =>
        HttpResponse.json({ botids: mockBotIds })
    ),

    // Orders
    http.get(`${API}/bot/:botId/orders`, () =>
        HttpResponse.json([mockOrder])
    ),

    // Trades
    http.get(`${API}/bot/:botId/trades`, () =>
        HttpResponse.json([mockTrade])
    ),

    // Default parameters
    http.get(`${API}/default_parameters`, () =>
        HttpResponse.json(mockParameters)
    ),

    // Per-client parameters
    http.get(`${API}/bot/get_parameters/:clientId`, () =>
        HttpResponse.json(mockParameters)
    ),

    http.post(`${API}/bot/set_parameters/:clientId`, () =>
        HttpResponse.json({ message: "ok" })
    ),

    // Default indicators
    http.get(`${API}/default_indicators`, () =>
        HttpResponse.json(mockIndicators)
    ),

    // Per-client indicators
    http.get(`${API}/bot/get_indicators/:clientId`, () =>
        HttpResponse.json(mockIndicators)
    ),

    http.post(`${API}/bot/set_indicators/:clientId`, () =>
        HttpResponse.json({ message: "ok" })
    ),
];
