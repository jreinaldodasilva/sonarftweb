import { useState, useEffect } from "react";

const useWebSocket = (url, autoReconnect = true) => {
    const [socket, setSocket] = useState(null);
    const [wsOpen, setWsOpen] = useState(false);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                setWsOpen(true);
                setSocket(ws);
            };

            ws.onclose = () => {
                setWsOpen(false);
                setSocket(null);

                if (autoReconnect) {
                    connect();
                }
            };
        };

        connect();

        return () => {
            setWsOpen(false);
            setSocket((currentSocket) => {
                if (currentSocket) currentSocket.close();
                return null;
            });
        };
    }, [url, autoReconnect]);

    return { socket, wsOpen };
};

export default useWebSocket;
