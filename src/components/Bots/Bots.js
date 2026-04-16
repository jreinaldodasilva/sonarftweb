import React from "react";
import PropTypes from "prop-types";
import useBots from "../../hooks/useBots";
import BotControls from "./BotControls";
import BotConsole from "./BotConsole";
import TradeHistoryTable from "./TradeHistoryTable";
import "./bots.css";

const Bots = ({ user }) => {
    const {
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
    } = useBots(user.id);

    return (
        <div className="bots-container">
            {isLoading && <div className="bots-loading">Loading...</div>}
            {fetchError && <div className="bots-ws-error">⚠ {fetchError}</div>}
            {wsError && (
                <div className="bots-ws-error">⚠ {wsError} — reconnecting...</div>
            )}

            <div className="bots">
                <h2>
                    Bots <span>(paper trading)</span>
                    <span className={`ws-status ${wsOpen ? "ws-status--open" : "ws-status--closed"}`}>
                        {wsOpen ? "● Connected" : "○ Disconnected"}
                    </span>
                </h2>
                <BotControls
                    botIds={botIds}
                    botState={botState}
                    selectedBotId={selectedBotId}
                    wsOpen={wsOpen}
                    onSelectBot={setSelectedBotId}
                    onCreate={handleCreate}
                    onRemove={handleRemove}
                />
                <BotConsole logs={logs} />
            </div>

            <div className="history">
                <h2>Order History</h2>
                <TradeHistoryTable rows={orders} />

                <h2>Trade History</h2>
                <TradeHistoryTable rows={trades} />
            </div>
        </div>
    );
};

Bots.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string,
    }).isRequired,
};

export default Bots;
