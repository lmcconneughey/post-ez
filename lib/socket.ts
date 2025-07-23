'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if (!socket) {
        const WS_URL =
            process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
        socket = io(WS_URL, {
            // transports: ['websocket'],
        });
        socket.on('connect', () => {
            console.log('CLIENT: Socket.IO connected successfully!');
        });
        socket.on('disconnect', (reason) => {
            console.log('CLIENT: Socket.IO disconnected. Reason:', reason);
        });
        socket.on('connect_error', (error) => {
            console.error('CLIENT: Socket.IO connection error:', error.message);
            // console.error('CLIENT: Socket.IO connection error details:', error.data);
        });
    }
    return socket;
};
