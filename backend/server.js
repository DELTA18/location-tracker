require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Create HTTP server to integrate with Socket.IO
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO Event Handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for real-time location updates from users
  socket.on('new-location-log', (data) => {
    console.log('Received new location log:', data);
    // Emit the location to all admins
    const sendData = { userId: data.userId, location: data.location, timestamp: new Date() };
    socket.broadcast.emit('send-new-location-log', sendData);  // Send to all other connected clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
