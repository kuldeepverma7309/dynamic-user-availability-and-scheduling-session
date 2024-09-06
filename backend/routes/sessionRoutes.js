// src/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { verifyRole } = require('../middleware/authMiddleware');

// Create a new session
router.post('/', verifyRole,sessionController.createSession);

// Get sessions for a user
router.get('/user/:email', sessionController.getUserSessions);

// Get sessions for admin
router.get('/admin/:admin', verifyRole,sessionController.getAdminSessions);
// Get all incompleted sessions
router.get('/incompleted', sessionController.getIncompletedSessions);
// Update an existing session
router.put('/edit/:id',verifyRole, sessionController.updateSession);

// Update session status
router.put('/status/:id',verifyRole, sessionController.updateSessionStatus);

// Get a session by ID
router.get('/get/:id', sessionController.getSessionById);

// Delete a session
router.delete('/:id',verifyRole, sessionController.deleteSession);



module.exports = router;
