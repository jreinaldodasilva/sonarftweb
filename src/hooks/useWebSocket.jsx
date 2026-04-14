import { useState, useEffect } from "react";

const useWebSocket = (url, autoReconnect = true) => {
    const [socket, setSocket] = useState(null);
    const [wsOpen, setWsOpen] = useState(false);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log("WebSocket is connected");
                setWsOpen(true);
                setSocket(ws);
            };

            ws.onclose = () => {
                console.log("WebSocket is closed");
                setWsOpen(false);
                setSocket(null);

                // Auto-reconnect
                if (autoReconnect) {
                    console.log("WebSocket is reconnecting...");
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

    useEffect(() => {
        if (socket) {
            switch (socket.readyState) {
                case WebSocket.CONNECTING:
                    console.log("WebSocket is connecting...");
                    break;
                case WebSocket.OPEN:
                    console.log("WebSocket is open and ready to communicate.");
                    break;
                case WebSocket.CLOSING:
                    console.log("WebSocket is closing...");
                    break;
                case WebSocket.CLOSED:
                    console.log("WebSocket is closed.");
                    break;
                default:
                    console.log("WebSocket is in an unknown state.");
                    break;
            }
        }
    }, [socket]);

    return { socket, wsOpen };
};

export default useWebSocket;
