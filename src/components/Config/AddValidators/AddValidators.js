import React from "react";
import validatorOptions from "./validatorOptions.json";
import "./addvalidators.css";

class AddValidators extends React.Component {
    constructor() {
        super();
        this.state = {
            validator: "",
            period: "",
        };
    }

    componentDidMount() {
        // Replace with the URL of your file or API endpoint
        //fetch('https://example.com/defaultParameters.json')
        fetch(process.env.PUBLIC_URL + "/defaultValidators.json")
            .then((response) => response.json())
            .then((data) => this.setState(data))
            .catch((error) => console.error(error));
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addValidator(this.state.validator, this.state.period);
    };

    render() {
        return (
            <div  className='addValidators'>
                <h2>Validators</h2>
                <form onSubmit={this.handleSubmit}>
                    <select
                        name="validator"
                        value={this.state.validator}
                        onChange={this.handleChange}
                    >
                        {validatorOptions.validator.map((validator, index) => (
                            <option key={index} value={validator}>
                                {validator}
                            </option>
                        ))}
                    </select>
                    <select
                        name="period"
                        value={this.state.period}
                        onChange={this.handleChange}
                    >
                        {validatorOptions.period.map((period, index) => (
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

export default AddValidators;
