const socketIO = require('socket.io');
const logger = require('../utils/logger');

let io;

exports.init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    logger.info('🔌 Socket.io initialized');

    io.on('connection', (socket) => {
        logger.info(`🔌 Client connected: ${socket.user ? socket.user.id : 'Anon'} (${socket.id})`);

        socket.on('join_room', (room) => {
            socket.join(room);
            logger.info(`User ${socket.id} joined room ${room}`);
        });

        socket.on('disconnect', () => {
            logger.info('Stubborn Client disconnected');
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
