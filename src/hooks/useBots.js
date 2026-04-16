import { useState, useEffect, useCallback } from "react";
import useWebSocket from "./useWebSocket";
import { getBotIds, getAuthToken } from "../utils/api";
import {
    WS,
    BOT_CREATED_MESSAGE,
    BOT_REMOVED_MESSAGE,
    ORDER_SUCCESS,
    TRADE_SUCCESS,
} from "../utils/constants";
import { fetchAllOrders, fetchAllTrades } from "../utils/helpers";

const MAX_LOG_LINES = 500;

export const BotState = Object.freeze({
    CREATED: 0,
    REMOVED: 1,
});

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
            setLogs((prev) => {
                const next = [...prev, event.data];
                return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
            });

            if (event.data.includes(BOT_CREATED_MESSAGE)) {
                const ids = await getBotIds(clientId);
                setSelectedBotId(ids[ids.length - 1]);
                setBotIds(ids);
                socket.send(JSON.stringify({
                    type: "keypress",
                    key: "run",
                    botid: ids[ids.length - 1],
                }));
            } else if (event.data.includes(BOT_REMOVED_MESSAGE)) {
                setBotState(BotState.REMOVED);
            }

            if (event.data.includes(ORDER_SUCCESS)) {
                const allOrders = await fetchAllOrders(botIds);
                setOrders(allOrders);
            }

            if (event.data.includes(TRADE_SUCCESS)) {
                const allTrades = await fetchAllTrades(botIds);
                setTrades(allTrades);
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
