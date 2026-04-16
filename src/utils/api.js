import netlifyIdentity from "netlify-identity-widget";
import { HTTP } from "./constants.js";
import parameterOptions from "./parameterOptions.json";
import indicatorOptions from "./indicatorOptions.json";

// Returns the Netlify Identity JWT for the current user, or null if not authenticated.
export const getAuthToken = () => {
    const user = netlifyIdentity.currentUser();
    return user?.token?.access_token ?? null;
};

// Returns Authorization header object if a token is available, otherwise empty object.
const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const baseHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

export const getBotIds = async (clientId) => {
    try {
        const response = await fetch(HTTP + `/botids/${clientId}`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.botids;
    } catch (e) {
        throw e;
    }
};

export const getOrders = async (botId) => {
    try {
        const response = await fetch(HTTP + `/bot/${botId}/orders`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
};

export const getTrades = async (botId) => {
    try {
        const response = await fetch(HTTP + `/bot/${botId}/trades`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
};

// Parameters
export const getDefaultParameters = async () => {
    try {
        const response = await fetch(HTTP + `/default_parameters`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch {
        return parameterOptions;
    }
};

export const getParameters = async (clientId) => {
    try {
        const response = await fetch(HTTP + `/bot/get_parameters/${clientId}`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};

export const updateParameters = async (clientId, newParameters) => {
    try {
        const response = await fetch(HTTP + `/bot/set_parameters/${clientId}`, {
            method: "POST",
            headers: { ...baseHeaders, ...getAuthHeaders() },
            body: JSON.stringify(newParameters),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};

// Indicators
export const getDefaultIndicators = async () => {
    try {
        const response = await fetch(HTTP + `/default_indicators`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch {
        return indicatorOptions;
    }
};

export const getIndicators = async (clientId) => {
    try {
        const response = await fetch(HTTP + `/bot/get_indicators/${clientId}`, {
            method: "GET",
            headers: { ...baseHeaders, ...getAuthHeaders() },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};

export const updateIndicators = async (clientId, newIndicators) => {
    try {
        const response = await fetch(HTTP + `/bot/set_indicators/${clientId}`, {
            method: "POST",
            headers: { ...baseHeaders, ...getAuthHeaders() },
            body: JSON.stringify(newIndicators),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};
