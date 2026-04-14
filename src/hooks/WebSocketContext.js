import React, { createContext, useState, useEffect, useRef, useContext } from "react";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const wsOpen = useRef(false);
    const listeners = useRef({});

    useEffect(() => {
        let ws = new WebSocket("ws://localhost:5000");
        ws.onopen = () => {
            console.log("ws opened");
            wsOpen.current = true;
        };
        ws.onclose = () => {
            console.log("ws closed");
            wsOpen.current = false;
        };
        ws.onmessage = (msg) => {
            const listenersArr = Object.values(listeners.current);
            listenersArr.forEach(listener => listener(msg));
        };
        setWs(ws);
        return () => {
            ws.close();
        };
    }, []);

    const addListener = (id, func) => {
        listeners.current[id] = func;
    };

    const removeListener = (id) => {
        delete listeners.current[id];
    };

    return (
        <WebSocketContext.Provider
            value={{ ws, wsOpen: wsOpen.current, addListener, removeListener }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);

export default WebSocketProvider;
