require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./socket'); 

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

initSocket(server);

// Middleware
app.use(cors({ origin: 'https://location-tracker-jqm7.vercel.app', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Hello World!'));
// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
