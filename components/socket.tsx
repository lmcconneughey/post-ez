'use client';

import { useEffect, useState } from 'react';
import { connectSocket } from '../lib/socket';
import { useUser } from '@clerk/nextjs';

export default function Socket() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const socket = connectSocket();
        if (socket.connected) {
            onConnect();
        }
        // test message
        // socket.emit('helloFromClient', { message: 'Hey server!' });

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });

            if (user && isLoaded) {
                socket.emit('newUser', user?.username);
            }
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
    }, [user, isLoaded]);

    return (
        <div>
            <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
            <p>Transport: {transport}</p>
        </div>
    );
}
