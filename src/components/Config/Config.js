import React from 'react';
import SetParameters from './SetParameters/SetParameters';
import ParametersList from './ParametersList/ParametersList';
import AddIndicators from './AddIndicators/AddIndicators';
import IndicatorsList from './IndicatorsList/IndicatorsList';
import AddValidators from './AddValidators/AddValidators';
import ValidatorsList from './ValidatorsList/ValidatorsList';
import { v4 as uuidv4 } from 'uuid'; // import uuid

class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parameters: {},
            indicators: [],
            validators: [],
            error: null,
            user: props.user,
        };
    }

    setParameters = (paramSet) => {
        this.setState({ parameters: paramSet });
    };

    addIndicator = (indicatorName, indicatorValue) => {
        const newIndicator = {
            id: uuidv4(),
            title: indicatorName,
            value: indicatorValue,
        };
        this.setState((prevState) => ({
            indicators: [...prevState.indicators, newIndicator],
        }));
    };

    deleteIndicator = (idToDelete) => {
        this.setState((prevState) => ({
            indicators: prevState.indicators.filter(
                (indicator) => indicator.id !== idToDelete
            ),
        }));
    };

    addValidator = (validatorName, validatorValue) => {
        const newValidator = {
            id: uuidv4(),
            title: validatorName,
            value: validatorValue,
        };
        this.setState((prevState) => ({
            validators: [...prevState.validators, newValidator],
        }));
    };

    deleteValidator = (idToDelete) => {
        this.setState((prevState) => ({
            validators: prevState.validators.filter(
                (validator) => validator.id !== idToDelete
            ),
        }));
    };

    render() {
        return (
            <main className="main-container">
                <div className="parameters-indicators-validators-container">
                    <div className="parameters-container">
                        <SetParameters setParameters={this.setParameters} />
                        <ParametersList parameters={this.state.parameters} />
                    </div>
                    <div className="indicators-container">
                        <AddIndicators addIndicator={this.addIndicator} />
                        <IndicatorsList indicators={this.state.indicators} deleteIndicator={this.deleteIndicator} />
                    </div>
                    <div className="validators-container">
                        <AddValidators addValidator={this.addValidator} />
                        <ValidatorsList validators={this.state.validators} deleteValidator={this.deleteValidator} />
                    </div>
                </div>
            </main>
        );
    }
}

export default Config;