import React, { Component } from "react";
import "./indicators.css";
import { getDefaultIndicators, getIndicators, updateIndicators } from "../../utils/api";

// saveStatus: null | 'saving' | 'saved' | 'error'
const SAVE_FEEDBACK_MS = 3000;

class Indicators extends Component {
    constructor() {
        super();
        const localStorageState = localStorage.getItem("indicatorsState");
        this.state = localStorageState
            ? JSON.parse(localStorageState)
            : {
                  periods: {},
                  oscillators: {},
                  movingaverages: {},
                  saveStatus: null,
              };
    }

    async componentDidMount() {
        try {
            const { clientId } = this.props;
            const updatedIndicators = await getIndicators(clientId);
            if (updatedIndicators) {
                this.setState({
                    periods: updatedIndicators.periods,
                    oscillators: updatedIndicators.oscillators,
                    movingaverages: updatedIndicators.movingaverages,
                });
                return;
            }
        } catch {
            // Server unavailable — fall through to localStorage
        }

        try {
            const localStorageIndicators = JSON.parse(localStorage.getItem("indicatorsState"));
            if (localStorageIndicators) {
                this.setState({
                    periods: localStorageIndicators.periods,
                    oscillators: localStorageIndicators.oscillators,
                    movingaverages: localStorageIndicators.movingaverages,
                });
                return;
            }
        } catch {
            // localStorage unavailable — fall through to defaults
        }

        try {
            const defaultIndicators = await getDefaultIndicators();
            this.setState({
                periods: defaultIndicators.periods,
                oscillators: defaultIndicators.oscillators,
                movingaverages: defaultIndicators.movingaverages,
            });
        } catch {
            // All sources failed — state remains as initialised
        }
    }

    handleCheckboxChange = (e, category) => {
        const item = e.target.name;
        const isChecked = e.target.checked;

        this.setState(
            (prevState) => ({
                [category]: { ...prevState[category], [item]: isChecked },
            }),
            () => {
                localStorage.setItem("indicatorsState", JSON.stringify(this.state));
            }
        );
    };

    handleSetClick = async () => {
        const { clientId } = this.props;
        this.setState({ saveStatus: "saving" });
        try {
            await updateIndicators(clientId, this.state);
            this.setState({ saveStatus: "saved" });
            setTimeout(() => this.setState({ saveStatus: null }), SAVE_FEEDBACK_MS);
        } catch {
            this.setState({ saveStatus: "error" });
            setTimeout(() => this.setState({ saveStatus: null }), SAVE_FEEDBACK_MS);
        }
    };

    renderCheckboxes(category) {
        const options = this.state[category];
        if (!options) return <div>Error: Invalid category</div>;

        return Object.keys(options).map((item) => (
            <li key={item}>
                <label>
                    <input
                        type="checkbox"
                        name={item}
                        checked={options[item] ?? false}
                        onChange={(e) => this.handleCheckboxChange(e, category)}
                    />
                    {item}
                </label>
            </li>
        ));
    }

    renderSaveStatus() {
        const { saveStatus } = this.state;
        if (!saveStatus) return null;
        const messages = {
            saving: "Saving...",
            saved: "✓ Saved",
            error: "✗ Error — try again",
        };
        return (
            <span className={`save-status save-status--${saveStatus}`}>
                {messages[saveStatus]}
            </span>
        );
    }

    render() {
        const { saveStatus } = this.state;
        return (
            <div className="setAndDisplayIndicators">
                <h2>Indicators</h2>
                <form>
                    <div className="checkbox-group label">
                        <h3>Periods</h3>
                        <ul>{this.renderCheckboxes("periods")}</ul>
                        <h3>Oscillators</h3>
                        <ul>{this.renderCheckboxes("oscillators")}</ul>
                        <h3>Moving Averages</h3>
                        <ul>{this.renderCheckboxes("movingaverages")}</ul>
                        <div className="save-row">
                            <button
                                type="button"
                                onClick={this.handleSetClick}
                                disabled={saveStatus === "saving"}
                            >
                                Set bot indicators
                            </button>
                            {this.renderSaveStatus()}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Indicators;
