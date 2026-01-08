const socketIO = require('socket.io');

let io;

exports.init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    console.log('🔌 Socket.io initialized');

    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.user ? socket.user.id : 'Anon'} (${socket.id})`);

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('Stubborn Client disconnected');
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
