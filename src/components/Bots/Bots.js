import React, { useState, useEffect, useRef } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import { getBotIds } from "../../utils/api";
import {
    WS,
    BOT_CREATED_MESSAGE,
    BOT_REMOVED_MESSAGE,
    ORDER_SUCCESS,
    TRADE_SUCCESS,
} from "../../utils/constants";
import { fetchAllOrders, fetchAllTrades } from "../../utils/helpers";
import "./bots.css";

const BotState = Object.freeze({
    CREATED: 0,
    REMOVED: 1,
});

const Bots = ({ user }) => {
    const clientId = user.id;
    const [logs, setLogs] = useState("");
    const [botIds, setBotIds] = useState([]);
    const [botState, setBotState] = useState(BotState.REMOVED);
    const [trades, setTrades] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedBotId, setSelectedBotId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const consoleEndRef = useRef(null);
    const { socket, wsOpen } = useWebSocket(`${WS}/${clientId}`);

    useEffect(() => {
        const fetchBotIds = async () => {
            try {
                setIsLoading(true);
                const ids = await getBotIds(clientId);
                setBotIds(ids);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBotIds();
    }, [clientId]);

    useEffect(() => {
        if (wsOpen) {
            socket.onmessage = async (event) => {
                setLogs((logs) => logs + "\n" + event.data);

                if (event.data.includes(BOT_CREATED_MESSAGE)) {
                    const ids = await getBotIds(clientId);
                    setSelectedBotId(ids[ids.length - 1]);
                    setBotIds(ids);
                    socket.send(
                        JSON.stringify({
                            type: "keypress",
                            key: "run",
                            botid: ids[ids.length - 1],
                        })
                    );
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
        }
    }, [clientId, wsOpen, socket, botIds, selectedBotId]);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleCreateButtonClick = () => {
        if (socket) {
            socket.send(JSON.stringify({ type: "keypress", key: "create" }));
            setBotState(BotState.REMOVED);
        }
    };

    const handleRemoveButtonClick = () => {
        if (socket && selectedBotId) {
            socket.send(
                JSON.stringify({
                    type: "keypress",
                    key: "remove",
                    botid: selectedBotId,
                })
            );
        }
    };

    //console.log("Rendering with:", { orders, trades, botIds });

    return (
        <div className="bots-container">
            {isLoading && <div>Loading...</div>}
            <div className="bots">
                <h2>
                    Bots <span>(paper trading)</span>
                    <ul>
                        <button
                            onClick={handleCreateButtonClick}
                            disabled={botState !== BotState.REMOVED}
                            style={{
                                opacity:
                                    botState === BotState.REMOVED ? 1 : 0.5,
                            }}
                        >
                            Create New Bot
                        </button>
                        <select
                            onChange={(e) => setSelectedBotId(e.target.value)}
                            value={selectedBotId}
                        >
                            {Array.isArray(botIds) &&
                                botIds.map((botId, index) => (
                                    <option key={index} value={botId}>
                                        {botId}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleRemoveButtonClick}
                            disabled={
                                botState !== BotState.REMOVED ||
                                selectedBotId === null
                            }
                            style={{
                                opacity:
                                    botState === BotState.REMOVED &&
                                    selectedBotId !== null
                                        ? 1
                                        : 0.5,
                            }}
                        >
                            Remove Bot {selectedBotId}
                        </button>
                    </ul>
                </h2>
                <ul>
                    <pre className="console">
                        {logs}
                        <div ref={consoleEndRef} />
                    </pre>
                </ul>
            </div>

            <div className="history">
                <h2>Order History </h2>
                <ul>
                    <div className="tables-container">
                        <table className="tradehistory-table">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Time</th>
                                    <th>Position</th>
                                    <th>Symbol</th>
                                    <th>Amount</th>
                                    <th>Buy Exchange</th>
                                    <th>Price</th>
                                    <th>Value</th>
                                    <th>Sell Exchange</th>
                                    <th>Price</th>
                                    <th>Value</th>
                                    <th>Profit</th>
                                    <th>Profit Perc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orders) &&
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{order.timestamp}</td>
                                            <td>{order.position}</td>
                                            <td>
                                                {order.base}/{order.quote}
                                            </td>
                                            <td>{order.buy_trade_amount}</td>
                                            <td>{order.buy_exchange}</td>
                                            <td>{order.buy_price}</td>
                                            <td>{order.buy_value}</td>
                                            <td>{order.sell_exchange}</td>
                                            <td>{order.sell_price}</td>
                                            <td>{order.sell_value}</td>
                                            <td>{order.profit}</td>
                                            <td>{order.profit_percentage}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </ul>

                <h2>Trade History </h2>
                <ul>
                    <div className="tables-container">
                        <table className="tradehistory-table">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Time</th>
                                    <th>Position</th>
                                    <th>Symbol</th>
                                    <th>Amount</th>
                                    <th>Buy Exchange</th>
                                    <th>Price</th>
                                    <th>Value</th>
                                    <th>Sell Exchange</th>
                                    <th>Price</th>
                                    <th>Value</th>
                                    <th>Profit</th>
                                    <th>Profit Perc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(trades) &&
                                    trades.map((trade, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{trade.timestamp}</td>
                                            <td>{trade.position}</td>
                                            <td>
                                                {trade.base}/{trade.quote}
                                            </td>
                                            <td>{trade.buy_trade_amount}</td>
                                            <td>{trade.buy_exchange}</td>
                                            <td>{trade.buy_price}</td>
                                            <td>{trade.buy_value}</td>
                                            <td>{trade.sell_exchange}</td>
                                            <td>{trade.sell_price}</td>
                                            <td>{trade.sell_value}</td>
                                            <td>{trade.profit}</td>
                                            <td>{trade.profit_percentage}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Bots;
