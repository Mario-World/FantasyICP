import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url: string) => {
    const [data, setData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!url) return;

        ws.current = new WebSocket(url);
        ws.current.onopen = () => setIsConnected(true);
        ws.current.onclose = () => setIsConnected(false);
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setData(message);
        };
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.current?.close();
        };
    }, [url]);

    const sendMessage = (message: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    return { data, isConnected, sendMessage };
}; 