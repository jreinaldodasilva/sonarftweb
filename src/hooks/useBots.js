import { useState, useEffect, useCallback } from "react";
import useWebSocket from "./useWebSocket";
import { getBotIds, getAuthToken } from "../utils/api";
import { WS } from "../utils/constants";
import { fetchAllOrders, fetchAllTrades } from "../utils/helpers";

const MAX_LOG_LINES = 500;

export const BotState = Object.freeze({
    CREATED: 0,
    REMOVED: 1,
});

// Parse a raw WebSocket message into a structured event.
// Supports JSON protocol (new) with plain-text fallback (legacy).
const parseMessage = (raw) => {
    try {
        const msg = JSON.parse(raw);
        if (msg && typeof msg.type === "string") return msg;
    } catch {
        // Not JSON — treat as legacy plain-text log
    }
    // Legacy fallback: wrap plain text as a log event
    return { type: "log", level: "INFO", message: raw };
};

const useBots = (clientId) => {
    const token = getAuthToken();
    const wsUrl = token
        ? `${WS}/${clientId}?token=${encodeURIComponent(token)}`
        : `${WS}/${clientId}`;

    const [logs, setLogs] = useState([]);
    const [botIds, setBotIds] = useState([]);
    const [botState, setBotState] = useState(BotState.REMOVED);
    const [trades, setTrades] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedBotId, setSelectedBotId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const { socket, wsOpen, wsError } = useWebSocket(wsUrl);

    // Load bot IDs on mount
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                setFetchError(null);
                const ids = await getBotIds(clientId);
                setBotIds(ids);
            } catch {
                setFetchError("Could not load bots — is the server running?");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [clientId]);

    // Handle incoming WebSocket messages
    useEffect(() => {
        if (!wsOpen || !socket) return;

        socket.onmessage = async (event) => {
            const msg = parseMessage(event.data);

            // Always append log messages to the console
            if (msg.type === "log") {
                setLogs((prev) => {
                    const next = [...prev, msg.message];
                    return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
                });
                return;
            }

            // Structured lifecycle events
            switch (msg.type) {
                case "bot_created": {
                    const ids = await getBotIds(clientId);
                    setSelectedBotId(ids[ids.length - 1]);
                    setBotIds(ids);
                    socket.send(JSON.stringify({
                        type: "keypress",
                        key: "run",
                        botid: ids[ids.length - 1],
                    }));
                    break;
                }
                case "bot_removed":
                    setBotState(BotState.REMOVED);
                    break;
                case "order_success": {
                    const allOrders = await fetchAllOrders(botIds);
                    setOrders(allOrders);
                    break;
                }
                case "trade_success": {
                    const allTrades = await fetchAllTrades(botIds);
                    setTrades(allTrades);
                    break;
                }
                default:
                    // Unknown event type — ignore silently
                    break;
            }
        };
    }, [clientId, wsOpen, socket, botIds]);

    const handleCreate = useCallback(() => {
        if (socket) {
            socket.send(JSON.stringify({ type: "keypress", key: "create" }));
            setBotState(BotState.REMOVED);
        }
    }, [socket]);

    const handleRemove = useCallback(() => {
        if (!socket || !selectedBotId) return;
        const confirmed = window.confirm(
            `Remove bot "${selectedBotId}"? This will stop the bot immediately.`
        );
        if (!confirmed) return;
        socket.send(JSON.stringify({
            type: "keypress",
            key: "remove",
            botid: selectedBotId,
        }));
    }, [socket, selectedBotId]);

    return {
        logs,
        botIds,
        botState,
        orders,
        trades,
        selectedBotId,
        setSelectedBotId,
        isLoading,
        fetchError,
        wsOpen,
        wsError,
        handleCreate,
        handleRemove,
    };
};

export default useBots;
