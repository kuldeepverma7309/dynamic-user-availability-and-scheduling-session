const Availability = require('../models/Availability');
const Session = require('../models/Session');

// Add or Update User Availability
exports.addOrUpdateAvailability = async (req, res) => {
  const { slots } = req.body;

  try {
    let availability = await Availability.findOne({ user: req.user.id });

    if (availability) {
      if (typeof slots !== 'undefined') {
        console.log("slots: ", slots);
      } else {
        console.error("slots is undefined");
      }
      availability.slots = slots;
      await availability.save();
    } else {
      availability = await Availability.create({
        user: req.user.id,
        slots
      });
    }
    return res.status(201).json(availability);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Availability by User ID
exports.getAvailabilityByUser = async (req, res) => {
  try {
    console.log(req.params.userId);
    const availability = await Availability.findOne({ user: req.params.userId }).populate('user', 'email');
    console.log(availability);
    if (!availability) {
      return res.status(404).json({ message: 'No availability found for this user' });
    }

    return res.json(availability);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete Availability
exports.deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOneAndDelete({ user: req.user.id });

    if (!availability) {
      return res.status(404).json({ message: 'No availability found to delete' });
    }

    return res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
// Get All Availabilities
exports.getAllAvailabilities = async (req, res) => {
  try {
    const now = new Date(); // Define the current date

    // Find availabilities where the start date of any slot is greater than or equal to now
    const availabilities = await Availability.find({
      user: req.user.id,
      'slots.start': { $gte: now }
    }).populate('user', 'email name');

    if (availabilities.length === 0) {
      return res.status(404).json({ message: 'No availabilities found' });
    }

    return res.json(availabilities);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
// get availability by id
exports.getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id).populate('user', 'email name');
    if (!availability) {
      return res.status(404).json({ message: 'No availability found' });
    }
    return res.json(availability);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// get available slots
exports.getAdminData = async (req, res)=>{
  const admin = req.user.id;
  try {
    const now = new Date();
    const availabilities = await Availability.find({
      'slots.start': { $gte: now }
    }).populate('user');
 
    // Fetch recent sessions
    const recentSessions = await Session.find({
      admin: req.user.id,
      end: { $lte: now },
    })
      .sort({ end: -1 }) // Sort by end date in descending order
      .limit(5)
      .populate('attendees', 'name email')
      .populate('admin', 'name email');

      console.log("recentSessions: ", recentSessions);

    const totalSessions = await Session.countDocuments({admin:req.user.id})

    const availableSlots = availabilities.reduce((acc, availability) => acc + availability.slots.length, 0);
    return res.status(200).json({availabilities,recentSessions,totalSessions,availableSlots});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}