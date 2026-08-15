import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "");

const socket = io(socketUrl, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
