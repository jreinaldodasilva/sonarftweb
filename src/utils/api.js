import { HTTP } from "./constants.js";
import parameterOptions from "./parameterOptions.json";
import indicatorOptions from "./indicatorOptions.json";

export const getBotIds = async (clientId) => {
    const response = await fetch(HTTP + `/botids/${clientId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    const data = await response.json();
    console.log("Botids:", data);
    return data.botids;
};

export const getOrders = async (botId) => {
    const response = await fetch(HTTP + `/bot/${botId}/orders`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    if (!response.ok) return null;

    const orderdata = await response.json();
    console.log("Order data:", orderdata);
    return orderdata;
};

export const getTrades = async (botId) => {
    const response = await fetch(HTTP + `/bot/${botId}/trades`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    if (!response.ok) return null;

    const tradedata = await response.json();
    console.log("Trade data:", tradedata);
    return tradedata;
};

//Parameters
export const getDefaultParameters = async () => {
    try {
        const response = await fetch(HTTP + `/default_parameters`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        console.log("Falling back to local JSON.");
        return parameterOptions; // Return local JSON if fetch fails
    }
};

export const getParameters = async (clientId) => {
    try {
        const response = await fetch(HTTP + `/bot/get_parameters/${clientId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        throw e; // You could also return null or some default values
    }
};

export const updateParameters = async (clientId, newParameters) => {
    try {
        const response = await fetch(HTTP + `/bot/set_parameters/${clientId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newParameters),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        throw e;
    }
};

//Indicators
export const getDefaultIndicators = async () => {
    try {
        const response = await fetch(HTTP + `/default_indicators`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        console.log("Falling back to local JSON.");
        return indicatorOptions; // Return local JSON if fetch fails
    }
};

export const getIndicators = async (clientId) => {
    try {
        const response = await fetch(HTTP + `/bot/get_indicators/${clientId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })         
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        throw e; // You could also return null or some default values
    }
};

export const updateIndicators = async (clientId, newIndicators) => {
    try {
        const response = await fetch(HTTP + `/bot/set_indicators/${clientId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newIndicators),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(
            "There was a problem with your fetch operation: " + e.message
        );
        throw e;
    }
};
