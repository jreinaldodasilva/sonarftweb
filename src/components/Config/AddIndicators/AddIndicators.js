import React from "react";
import indicatorOptions from "./indicatorOptions.json";
import "./addindicators.css";

class AddIndicators extends React.Component {
    constructor() {
        super();
        this.state = {
            indicator: "",
            period: "",
        };
    }

    componentDidMount() {
        // Replace with the URL of your file or API endpoint
        //fetch('https://example.com/defaultParameters.json')
        fetch(process.env.PUBLIC_URL + "/defaultIndicators.json")
            .then((response) => response.json())
            .then((data) => this.setState(data))
            .catch((error) => console.error(error));
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addIndicator(this.state.indicator, this.state.period);
    };

    render() {
        return (
            <div  className='addIndicators'>
                <h2>Indicators</h2>
                <form onSubmit={this.handleSubmit}>
                    <select
                        name="indicator"
                        value={this.state.indicator}
                        onChange={this.handleChange}
                    >
                        {indicatorOptions.indicator.map((indicator, index) => (
                            <option key={index} value={indicator}>
                                {indicator}
                            </option>
                        ))}
                    </select>
                    <select
                        name="period"
                        value={this.state.period}
                        onChange={this.handleChange}
                    >
                        {indicatorOptions.period.map((period, index) => (
                            <option key={index} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                    <input type="submit" value="Set" />
                </form>
            </div>
        );
    }
}

export default AddIndicators;
