// src/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const {socketMiddleware} = require('./middleware/socketMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const httpServer = createServer(app); // Create HTTP server for Socket.IO

// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow requests from any origin (adjust if necessary)
        methods: ["GET", "POST"]
    }
});

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Middleware to attach io to req
app.use(socketMiddleware(io));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/session', sessionRoutes);


// Error handling middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // General error handler

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id}`);

//   // Listen for session updates
//   socket.on('session_update', (sessionData) => {
//     io.emit('session_update', sessionData); // Emit to all clients
//   });

//   // Listen for notification updates
//   socket.on('notification', (notificationData) => {
//     io.emit('notification', notificationData); // Emit to all clients
//   });

//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// Start server on specified port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
