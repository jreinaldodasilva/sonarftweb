import React from "react";
import Indicator from "../Indicators/Indicators";
import "./indicatorslist.css";

function IndicatorsList(props) {
    return (
        <div className='indicatorList'>
            <ul>
                {props.indicators.map((indicator, index) => (
                    <Indicator
                        key={index}
                        index={index}
                        indicator={indicator}
                        deleteIndicator={props.deleteIndicator}
                    />
                ))}
            </ul>
        </div>
    );
}

export default IndicatorsList;
