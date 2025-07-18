'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if (!socket) {
        const WS_URL =
            process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
        socket = io(WS_URL, {
            transports: ['websocket'],
        });
    }
    return socket;
};
