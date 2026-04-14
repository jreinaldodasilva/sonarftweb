import React from "react";

function Indicator(props) {
    return (
        <li>
            {props.indicator.title}: {props.indicator.value}
            <button onClick={() => props.deleteIndicator(props.indicator.id)}>
                Remove
            </button>
        </li>
    );
}

export default Indicator;
