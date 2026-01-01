import { io } from 'socket.io-client';

let socket = null;

export const useSocket = () => {
    if (!socket) {
        const config = useRuntimeConfig();
        // Remove /api from the end of apiBase to get the root URL for socket.io
        const socketUrl = config.public.apiBase.replace('/api', '');

        socket = io(socketUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'] // Force websocket first
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
