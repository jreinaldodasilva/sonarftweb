import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const BotConsole = ({ logs }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <ul>
            <pre className="console">
                {logs.join("\n")}
                <div ref={endRef} />
            </pre>
        </ul>
    );
};

BotConsole.propTypes = {
    logs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BotConsole;
