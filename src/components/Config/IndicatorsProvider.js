import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const IndicatorsContext = createContext();

export const IndicatorsProvider = ({ children }) => {
    const [indicators, setIndicators] = useState([]);

    const addIndicator = (indicatorName, indicatorValue) => {
        const newIndicator = {
            id: uuidv4(),
            title: indicatorName,
            value: indicatorValue,
        };
        setIndicators(prevIndicators => [...prevIndicators, newIndicator]);
    };

    const deleteIndicator = (idToDelete) => {
        setIndicators(prevIndicators => prevIndicators.filter(indicator => indicator.id !== idToDelete));
    };

    return (
        <IndicatorsContext.Provider value={{ indicators, addIndicator, deleteIndicator }}>
            {children}
        </IndicatorsContext.Provider>
    );
};