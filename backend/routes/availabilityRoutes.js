const express = require('express');
const { addOrUpdateAvailability, getAvailabilityByUser, deleteAvailability, getAllAvailabilities, getAvailabilityById, getAdminData } = require('../controllers/availabilityController');
const { protect, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();
// Add or update availability
router.post('/', protect, addOrUpdateAvailability);
router.get('/getAvailabilityById/:id', protect, getAvailabilityById);
// get all available slots for admin so that he can create sessions
router.get('/get-adminData', verifyRole, getAdminData);
// Get all availabilities
router.get('/getAllAvailabilities', protect,getAllAvailabilities);
// Get availability of a specific user
router.get('/:userId', protect, getAvailabilityByUser);
// Delete availability
router.delete('/delete/:id', protect, deleteAvailability);






module.exports = router;
