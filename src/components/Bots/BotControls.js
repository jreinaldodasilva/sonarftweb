import React from "react";
import PropTypes from "prop-types";
import { BotState } from "../../hooks/useBots";

const BotControls = ({
    botIds,
    botState,
    selectedBotId,
    wsOpen,
    onSelectBot,
    onCreate,
    onRemove,
}) => (
    <ul>
        <button
            onClick={onCreate}
            disabled={botState !== BotState.REMOVED}
            className={botState !== BotState.REMOVED ? "btn-disabled" : ""}
        >
            Create New Bot
        </button>
        <select
            onChange={(e) => onSelectBot(e.target.value)}
            value={selectedBotId ?? ""}
            aria-label="Active Bot"
        >
            {Array.isArray(botIds) && botIds.map((botId) => (
                <option key={botId} value={botId}>{botId}</option>
            ))}
        </select>
        <button
            onClick={onRemove}
            disabled={botState !== BotState.REMOVED || selectedBotId === null || !wsOpen}
            className={
                botState !== BotState.REMOVED || selectedBotId === null || !wsOpen
                    ? "btn-disabled"
                    : ""
            }
        >
            Remove Bot {selectedBotId}
        </button>
    </ul>
);

BotControls.propTypes = {
    botIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    botState: PropTypes.number.isRequired,
    selectedBotId: PropTypes.string,
    wsOpen: PropTypes.bool.isRequired,
    onSelectBot: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

BotControls.defaultProps = {
    selectedBotId: null,
};

export default BotControls;
