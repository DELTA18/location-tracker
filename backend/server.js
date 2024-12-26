require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const http = require('http');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);

// Database Connection
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Update with frontend URL
    methods: ['GET', 'POST'],
  },
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Export Socket.IO instance
module.exports = io;

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
