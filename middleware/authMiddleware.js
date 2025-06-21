const userModel = require('../models/userModel');

const checkAuth = async (req, res, next) => {
  // If user is not logged in, redirect to login page
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  // Add user data to res.locals so it's available in all views
  try {
    const user = await userModel.getUserById(req.session.userId);
    if (user) {
      res.locals.user = user;
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
  }
  
  next();
};

module.exports = {
  checkAuth
};