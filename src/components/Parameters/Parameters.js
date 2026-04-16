import React, { Component } from "react";
import PropTypes from "prop-types";
import "./parameters.css";
import { getDefaultParameters, getParameters, updateParameters } from "../../utils/api";

// saveStatus: null | 'saving' | 'saved' | 'error'
const SAVE_FEEDBACK_MS = 3000;

class Parameters extends Component {
    constructor() {
        super();
        const localStorageState = localStorage.getItem("parametersState");
        this.state = localStorageState
            ? JSON.parse(localStorageState)
            : {
                  exchanges: {},
                  symbols: {},
                  saveStatus: null,
              };
    }

    async componentDidMount() {
        try {
            const { clientId } = this.props;
            const updatedParameters = await getParameters(clientId);
            if (updatedParameters) {
                this.setState({
                    exchanges: updatedParameters.exchanges,
                    symbols: updatedParameters.symbols,
                });
                return;
            }
        } catch {
            // Server unavailable — fall through to localStorage
        }

        try {
            const localStorageParameters = JSON.parse(localStorage.getItem("parametersState"));
            if (localStorageParameters) {
                this.setState({
                    exchanges: localStorageParameters.exchanges,
                    symbols: localStorageParameters.symbols,
                });
                return;
            }
        } catch {
            // localStorage unavailable — fall through to defaults
        }

        try {
            const defaultParameters = await getDefaultParameters();
            this.setState({
                exchanges: defaultParameters.exchanges,
                symbols: defaultParameters.symbols,
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
                localStorage.setItem("parametersState", JSON.stringify(this.state));
            }
        );
    };

    handleSetClick = async () => {
        const { clientId } = this.props;
        this.setState({ saveStatus: "saving" });
        try {
            await updateParameters(clientId, this.state);
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
            <div className="setAndDisplayParameters">
                <h2>Parameters</h2>
                <form>
                    <div className="checkbox-group label">
                        <h3>Exchanges</h3>
                        <ul>{this.renderCheckboxes("exchanges")}</ul>
                        <h3>Symbols</h3>
                        <ul>{this.renderCheckboxes("symbols")}</ul>
                        <div className="save-row">
                            <button
                                type="button"
                                onClick={this.handleSetClick}
                                disabled={saveStatus === "saving"}
                            >
                                Set bot parameters
                            </button>
                            {this.renderSaveStatus()}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Parameters.propTypes = {
    clientId: PropTypes.string.isRequired,
};

export default Parameters;
