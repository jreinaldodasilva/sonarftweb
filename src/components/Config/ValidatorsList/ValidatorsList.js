import React from "react";
import Validator from "../Validators/Validators";
import "./validatorslist.css";

function ValidatorsList(props) {
    return (
        <div className="validatorList">
            <ul>
                {props.validators.map((validator, index) => (
                    <Validator
                        key={index}
                        index={index}
                        validator={validator}
                        deleteValidator={props.deleteValidator}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ValidatorsList;
