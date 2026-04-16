import { useState, useEffect, useCallback } from "react";

const SAVE_FEEDBACK_MS = 3000;

/**
 * Shared hook for checkbox-based configuration panels (Parameters, Indicators).
 *
 * @param {object} config
 * @param {string}   config.storageKey    - localStorage key
 * @param {object}   config.defaultState  - initial state shape (empty category objects)
 * @param {Function} config.fetchFn       - (clientId) => Promise<data>
 * @param {Function} config.defaultFn     - () => Promise<data>
 * @param {Function} config.updateFn      - (clientId, state) => Promise<void>
 * @param {string[]} config.stateKeys     - keys to extract from server/storage response
 * @param {string}   config.clientId      - Netlify user ID
 */
const useConfigCheckboxes = ({
    storageKey,
    defaultState,
    fetchFn,
    defaultFn,
    updateFn,
    stateKeys,
    clientId,
}) => {
    const [config, setConfig] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : defaultState;
        } catch {
            return defaultState;
        }
    });
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const load = async () => {
            // 1. Try server
            try {
                const data = await fetchFn(clientId);
                if (data) {
                    const next = {};
                    stateKeys.forEach((k) => { next[k] = data[k]; });
                    setConfig(next);
                    return;
                }
            } catch {
                // fall through
            }

            // 2. Try localStorage
            try {
                const stored = JSON.parse(localStorage.getItem(storageKey));
                if (stored) {
                    const next = {};
                    stateKeys.forEach((k) => { next[k] = stored[k]; });
                    setConfig(next);
                    return;
                }
            } catch {
                // fall through
            }

            // 3. Fall back to bundled defaults
            try {
                const data = await defaultFn();
                const next = {};
                stateKeys.forEach((k) => { next[k] = data[k]; });
                setConfig(next);
            } catch {
                // All sources failed — state remains as initialised
            }
        };

        load();
    }, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCheckboxChange = useCallback((e, category) => {
        const { name, checked } = e.target;
        setConfig((prev) => {
            const next = {
                ...prev,
                [category]: { ...prev[category], [name]: checked },
            };
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    }, [storageKey]);

    const handleSave = useCallback(async () => {
        setSaveStatus("saving");
        try {
            await updateFn(clientId, config);
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus(null), SAVE_FEEDBACK_MS);
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus(null), SAVE_FEEDBACK_MS);
        }
    }, [clientId, config, updateFn]);

    return { config, saveStatus, handleCheckboxChange, handleSave };
};

export default useConfigCheckboxes;
