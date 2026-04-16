import React from "react";
import PropTypes from "prop-types";
import "./indicators.css";
import { getDefaultIndicators, getIndicators, updateIndicators } from "../../utils/api";
import useConfigCheckboxes from "../../hooks/useConfigCheckboxes";

const SAVE_MESSAGES = { saving: "Saving...", saved: "✓ Saved", error: "✗ Error — try again" };

const DEFAULT_STATE = { periods: {}, oscillators: {}, movingaverages: {} };
const STATE_KEYS = ["periods", "oscillators", "movingaverages"];

const Indicators = ({ clientId }) => {
    const { config, saveStatus, handleCheckboxChange, handleSave } = useConfigCheckboxes({
        storageKey: "indicatorsState",
        defaultState: DEFAULT_STATE,
        fetchFn: getIndicators,
        defaultFn: getDefaultIndicators,
        updateFn: updateIndicators,
        stateKeys: STATE_KEYS,
        clientId,
    });

    const renderCheckboxes = (category) => {
        const options = config[category];
        if (!options) return <div>Error: Invalid category</div>;
        return Object.keys(options).map((item) => (
            <li key={item}>
                <label>
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
        <div className="setAndDisplayIndicators">
            <h2>Indicators</h2>
            <form>
                <div className="checkbox-group label">
                    <h3>Periods</h3>
                    <ul>{renderCheckboxes("periods")}</ul>
                    <h3>Oscillators</h3>
                    <ul>{renderCheckboxes("oscillators")}</ul>
                    <h3>Moving Averages</h3>
                    <ul>{renderCheckboxes("movingaverages")}</ul>
                    <div className="save-row">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saveStatus === "saving"}
                        >
                            Set bot indicators
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

Indicators.propTypes = {
    clientId: PropTypes.string.isRequired,
};

export default Indicators;
