import React, { Component } from "react";
import "./parameters.css";
import { getDefaultParameters, getParameters, updateParameters } from "../../utils/api";

class Parameters extends Component {
    constructor() {
        super();
        const localStorageState = localStorage.getItem("parametersState");
        this.state = localStorageState
            ? JSON.parse(localStorageState)
            : {
                  exchanges: {},
                  symbols: {},
              };
    }

    async componentDidMount() {
        try {
            // Check for updated parameters from server
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
            // Check for updated parameters from local storage
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
            // Fall back to default parameters
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
            (prevState) => {
                const updatedItems = {
                    ...prevState[category],
                    [item]: isChecked,
                };
                return { [category]: updatedItems };
            },
            () => {
                // Save to local storage
                localStorage.setItem(
                    "parametersState",
                    JSON.stringify(this.state)
                );
            }
        );
    };

    handleSetClick = async () => {
        // Send the current state to the server
        const { clientId } = this.props;
        try {
            await updateParameters(clientId, this.state);
        } catch {
            // Error surfaced to user via saveStatus in U1
        }
    };

    renderCheckboxes(category) {
        const options = this.state[category];
        if (!options) {
            return <div>Error: Invalid category</div>;
        }

        return Object.keys(options).map((item) => (
            <li key={item}>
                <label>
                    <input
                        type="checkbox"
                        name={item}
                        checked={options[item] || false}
                        onChange={(e) => this.handleCheckboxChange(e, category)}
                    />
                    {item}
                </label>
            </li>
        ));
    }

    render() {
        return (
            <div className="setAndDisplayParameters">
                <h2>Parameters</h2>
                <form>
                    <div className="checkbox-group label">
                        <h3>Exchanges</h3>
                        <ul>
                            {this.renderCheckboxes("exchanges")}
                        </ul>
                        <h3>Symbols</h3>
                        <ul>
                            {this.renderCheckboxes("symbols")}
                        </ul>
                        <button type="button" onClick={this.handleSetClick}>
                            Set bot parameters
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Parameters;
