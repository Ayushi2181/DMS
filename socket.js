const { Server } = require('socket.io');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('A user connected');

            // Join a community chat room
            socket.on('join_community', (communityId) => {
                socket.join(`community_${communityId}`);
                console.log(`User joined community_${communityId}`);
            });

            // Leave a community chat room
            socket.on('leave_community', (communityId) => {
                socket.leave(`community_${communityId}`);
                console.log(`User left community_${communityId}`);
            });

            // Handle new messages
            socket.on('new_message', (message) => {
                io.to(`community_${message.CommunityID}`).emit('message_received', message);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
}; 