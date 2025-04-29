import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const userSocketmap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketmap[receiverId];
};

const io = new Server(server, {
    cors: {
        origin: ['https://linkup-u40u.onrender.com'], // use http unless you’ve set up https locally
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
        userSocketmap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketmap));

    socket.on('disconnect', () => {
        delete userSocketmap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketmap));
    });
});

export { app, io, server };
