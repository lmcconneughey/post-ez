'use client';

import { useEffect, useState } from 'react';
import { connectSocket } from '../lib/socket';

export default function Socket() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');

    useEffect(() => {
        const socket = connectSocket();
        if (socket.connected) {
            onConnect();
        }
        // test message
        socket.emit('helloFromClient', { message: 'Hey server!' });

        // echoed message from server
        socket.on('chatMessage', (msg) => {
            console.log('Received from server:', msg);
        });

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport('N/A');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('chatMessage');
        };
    }, []);

    return (
        <div>
            <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
            <p>Transport: {transport}</p>
        </div>
    );
}
