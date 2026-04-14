import React, { createContext, useState } from 'react';

export const ParametersContext = createContext();

export const ParametersProvider = ({ children }) => {
    const [parameters, setParameters] = useState({});

    return (
        <ParametersContext.Provider value={{ parameters, setParameters }}>
            {children}
        </ParametersContext.Provider>
    );
};