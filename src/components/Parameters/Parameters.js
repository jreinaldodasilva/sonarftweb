import React from "react";
import PropTypes from "prop-types";
import "./parameters.css";
import { getDefaultParameters, getParameters, updateParameters } from "../../utils/api";
import useConfigCheckboxes from "../../hooks/useConfigCheckboxes";

const SAVE_MESSAGES = { saving: "Saving...", saved: "✓ Saved", error: "✗ Error — try again" };

const DEFAULT_STATE = { exchanges: {}, symbols: {} };
const STATE_KEYS = ["exchanges", "symbols"];

// Tooltip descriptions shown on hover for each parameter option.
const TOOLTIPS = {
    exchanges: {
        Binance:  "Binance — world's largest crypto exchange by volume",
        Okx:      "OKX — major exchange with deep liquidity on most pairs",
        Kraken:   "Kraken — established exchange known for security and EUR pairs",
    },
    symbols: {
        "BTC/USDT": "Bitcoin / Tether — highest liquidity trading pair",
        "ETH/USDT": "Ethereum / Tether — second largest crypto by market cap",
    },
};

const Parameters = ({ clientId }) => {
    const { config, saveStatus, handleCheckboxChange, handleSave } = useConfigCheckboxes({
        storageKey: "parametersState",
        defaultState: DEFAULT_STATE,
        fetchFn: getParameters,
        defaultFn: getDefaultParameters,
        updateFn: updateParameters,
        stateKeys: STATE_KEYS,
        clientId,
    });

    const renderCheckboxes = (category) => {
        const options = config[category];
        if (!options) return <div>Error: Invalid category</div>;
        const categoryTooltips = TOOLTIPS[category] ?? {};
        return Object.keys(options).map((item) => (
            <li key={item}>
                <label title={categoryTooltips[item] ?? item}>
                    <input
                        type="checkbox"
                        name={item}
                        checked={options[item] ?? false}
                        onChange={(e) => handleCheckboxChange(e, category)}
                    />
                    {item}
                </label>
            </li>
        ));
    };

    return (
        <div className="setAndDisplayParameters">
            <h2>Parameters</h2>
            <form>
                <div className="checkbox-group label">
                    <h3>Exchanges</h3>
                    <ul>{renderCheckboxes("exchanges")}</ul>
                    <h3>Symbols</h3>
                    <ul>{renderCheckboxes("symbols")}</ul>
                    <div className="save-row">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saveStatus === "saving"}
                        >
                            Set bot parameters
                        </button>
                        {saveStatus && (
                            <span className={`save-status save-status--${saveStatus}`}>
                                {SAVE_MESSAGES[saveStatus]}
                            </span>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

Parameters.propTypes = {
    clientId: PropTypes.string.isRequired,
};

export default Parameters;
