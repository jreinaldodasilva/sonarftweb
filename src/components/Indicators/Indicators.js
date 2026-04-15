import React, { Component } from "react";
import "./indicators.css";
import { getDefaultIndicators, getIndicators, updateIndicators } from "../../utils/api";

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
              };
    }

    async componentDidMount() {
        try {
            // Check for updated indicators from server
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
            // Check for updated indicators from local storage
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
            // Fall back to default indicators
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
                    "indicatorsState",
                    JSON.stringify(this.state)
                );
            }
        );
    };

    handleSetClick = async () => {
        // Send the current state to the server
        const { clientId } = this.props;
        try {
            await updateIndicators(clientId, this.state);
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
            <div className="setAndDisplayIndicators">
                <h2>Indicators</h2>
                <form>
                    <div className="checkbox-group label">
                        <h3>Periods</h3>
                        <ul>
                            {this.renderCheckboxes("periods")}
                        </ul>
                        <h3>Oscillators</h3>
                        <ul>
                            {this.renderCheckboxes("oscillators")}
                        </ul>
                        <h3>Moving Averages</h3>
                        <ul>
                            {this.renderCheckboxes("movingaverages")}
                        </ul>
                        <button type="button" onClick={this.handleSetClick}>
                            Set bot indicators
                        </button>                        
                    </div>
                </form>
            </div>
        );
    }
}

export default Indicators;
