import { useState, useEffect, useRef } from "react";

const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 30000;

const useWebSocket = (url, autoReconnect = true) => {
    const [socket, setSocket] = useState(null);
    const [wsOpen, setWsOpen] = useState(false);
    const [wsError, setWsError] = useState(null);

    // Ref flags survive re-renders and closure captures without causing re-renders.
    const shouldReconnect = useRef(true);
    const attemptRef = useRef(0);

    useEffect(() => {
        shouldReconnect.current = true;
        attemptRef.current = 0;

        const connect = () => {
            if (!shouldReconnect.current) return;

            const ws = new WebSocket(url);

            ws.onopen = () => {
                attemptRef.current = 0;
                setWsError(null);
                setWsOpen(true);
                setSocket(ws);
            };

            ws.onerror = () => {
                setWsError("WebSocket connection error — check server status");
            };

            ws.onclose = () => {
                setWsOpen(false);
                setSocket(null);

                if (autoReconnect && shouldReconnect.current) {
                    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s cap
                    const delay = Math.min(
                        BACKOFF_BASE_MS * Math.pow(2, attemptRef.current),
                        BACKOFF_MAX_MS
                    );
                    attemptRef.current += 1;
                    setTimeout(connect, delay);
                }
            };
        };

        connect();

        return () => {
            shouldReconnect.current = false;
            setSocket((currentSocket) => {
                if (currentSocket) currentSocket.close();
                return null;
            });
            setWsOpen(false);
        };
    }, [url, autoReconnect]);

    return { socket, wsOpen, wsError };
};

export default useWebSocket;
