/**
 * Socket.IO client configuration
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const socket = getSocket();
    if (!socket.connected) {
        socket.connect();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect();
    }
};

export const removeAllSocketListeners = () => {
    if (socket) {
        // Only remove our custom game listeners, not internal socket.io ones
        const customEvents = [
            'room_created',
            'room_joined',
            'player_joined',
            'player_left',
            'game_started',
            'role_assigned',
            'clue_submitted',
            'vote_submitted',
            'game_ended',
            'game_reset',
            'error',
            'connected'
        ];

        customEvents.forEach(event => {
            if (socket) {
                socket.off(event);
            }
        });
    }
};
