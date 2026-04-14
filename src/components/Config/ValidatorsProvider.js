import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ValidatorsContext = createContext();

export const ValidatorsProvider = ({ children }) => {
    const [validators, setValidators] = useState([]);

    const addValidator = (validatorName, validatorValue) => {
        const newValidator = {
            id: uuidv4(),
            title: validatorName,
            value: validatorValue,
        };
        setValidators(prevValidators => [...prevValidators, newValidator]);
    };

    const deleteValidator = (idToDelete) => {
        setValidators(prevValidators => prevValidators.filter(validator => validator.id !== idToDelete));
    };

    return (
        <ValidatorsContext.Provider value={{ validators, addValidator, deleteValidator }}>
            {children}
        </ValidatorsContext.Provider>
    );
};