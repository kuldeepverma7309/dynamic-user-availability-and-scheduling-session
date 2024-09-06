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
const { sendSessionEmail } = require('./config/nodemailer');

// Load environment variables
dotenv.config();


const app = express();
const httpServer = createServer(app); 

// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
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
app.use(errorHandler); 

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for session updates
  socket.on('session_update', (sessionData) => {
    io.emit('session_update', sessionData); 
    // Send email regarding session update
    const { email, status, title } = sessionData;
    let subject, text;
    console.log("status: ", status);
    switch (status) {
      case 'scheduled':
        subject = 'Session Scheduled';
        text = `Your session "${title}" has been scheduled.`;
        break;
      case 'updated':
        subject = 'Session Updated';
        text = `Your session "${title}" has been updated.`;
        break;
      case 'canceled':
        subject = 'Session Canceled';
        text = `Your session "${title}" has been canceled.`;
        break;
      default:
        subject = 'Session Notification';
        text = `Your session "${title}" has a new update.`;
    }
    email?.forEach((email)=>sendSessionEmail(email, subject, text));
    
  });

  // Listen for notification updates
  socket.on('notification', (notificationData) => {
    io.emit('notification', notificationData); 
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
