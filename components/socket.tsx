'use client';

import { useEffect, useState } from 'react';
import { connectSocket } from '../lib/socket';
import { useUser } from '@clerk/nextjs';

export default function Socket() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');
    const { user, isLoaded } = useUser();

    // race condition issues with user.username getting to the backend?
    useEffect(() => {
        const socket = connectSocket();
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });

            if (user?.username && isLoaded) {
                console.log('Emitting newUser:', user.username);
                socket.emit('newUser', user.username);
            } else {
                console.warn(
                    'Username or session not ready yet, skipping newUser emit',
                );
            }
            console.log('registering user:', user?.username);
        }
        console.log('socket connected client side:', socket.id);

        function onDisconnect() {
            setIsConnected(false);
            setTransport('N/A');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [user?.username, isLoaded]);

    // fall back to if username is avilabe after socket is connected
    useEffect(() => {
        const socket = connectSocket();

        if (user?.username && isLoaded && socket.connected) {
            console.log('late emit of newUser after user loaded');
            socket.emit('newUser', user.username);
        }
    }, [user?.username, isLoaded]);

    return (
        <div>
            <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
            <p>Transport: {transport}</p>
        </div>
    );
}
