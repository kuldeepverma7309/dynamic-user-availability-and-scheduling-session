const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
     return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
   return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

exports.verifyRole = async(req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      let user = await User.findById(decoded.id).select('-password');
      if(user.role === 'admin'){
        // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');
        next();
      }
      else{
        return res.status(401).json({ message: 'Not authorized, not an admin' });
      }
    } catch (error) {
     return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
   return res.status(401).json({ message: 'Not authorized, no token' });
  }
}