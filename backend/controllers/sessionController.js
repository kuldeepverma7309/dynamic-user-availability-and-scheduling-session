const Session = require('../models/Session');
const { notifySessionUsers } = require('./notificationController');

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { admin, start, end, duration, attendees, title, description } = req.body;
    console.log("admin: ", admin, "start: ", start, "end: ", end, "duration: ", duration, "attendees: ", attendees, "title: ", title, "description: ", description);

    // Check for session conflicts
    const conflictingSession = await Session.findOne({
      admin,
      $or: [
        { start: { $lt: end, $gte: start } },
        { end: { $gt: start, $lte: end } },
      ],
    });

    if (conflictingSession) {
      return res.status(400).json({ message: 'Session time conflicts with an existing session' });
    }

    const newSession = await Session.create({
      admin,
      start,
      end,
      duration,
      attendees,
      title,
      description
    });

    // Emit session update to all connected clients via Socket.IO
    req.io.emit('session_update', newSession);

    // Notify all attendees
    await notifySessionUsers(newSession._id, 'sessionCreated');

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing session
exports.updateSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updatedData = req.body;

    const updatedSession = await Session.findByIdAndUpdate(sessionId, updatedData, { new: true });

    if (!updatedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Emit session update to all connected clients via Socket.IO
    req.io.emit('session_update', updatedSession);

    // Notify all attendees
    await notifySessionUsers(sessionId, 'sessionUpdated');

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await Session.findByIdAndDelete(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Emit session update to all connected clients via Socket.IO
    req.io.emit('session_update', { deleted: true, sessionId });

    // Notify all attendees
    await notifySessionUsers(sessionId, 'sessionDeleted');

    res.status(200).json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sessions for a user
exports.getUserSessions = async (req, res) => {
  const email = req.params.email;
  try {
    const sessions = await Session.find({ 'attendees.email': email }).populate('admin', 'name');
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found' });
    }
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get sessions for admin
exports.getAdminSessions = async (req, res) => {
  const admin = req.params.admin;
  try {
    const sessions = await Session.find({ admin });
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found' });
    }
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get session by id
exports.getSessionById = async (req, res) => {
  const id = req.params.id;
  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
