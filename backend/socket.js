const socketIo = require('socket.io');

let io;
const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URI, // Frontend URL
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO Event Handling
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for real-time location updates from users
    socket.on('new-location-log', (data) => {
      console.log('Received new location log:', data);
      // Emit the location to all admins
      const sendData = { userId: data.userId, location: data.location, timestamp: new Date() };
      socket.broadcast.emit('send-new-location-log', sendData); // Send to all other connected clients
    });

    socket.on('user-online', (data) => {
      console.log('User online:', data);
      socket.broadcast.emit('user-online', data);
    });

    socket.on('user-offline', (data) => {
      console.log('User offline:', data);
      socket.broadcast.emit('user-offline', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
