const userModel = require('../models/userModel');
const userAreaModel = require('../models/userAreaModel');

const showProfilePage = async (req, res) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return res.redirect('/login');
  }
  
  try {
    // Get user information
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Get user's public areas
    const publicAreas = await userAreaModel.getPublicAreasByUser(userId);
    
    // Render the profile page with user data and areas
    res.render('pages/profile', { 
      user: user,
      areas: publicAreas,
      createdAt: new Date(user.created_at).toLocaleDateString()
    });
  } catch (err) {
    console.error('Error loading profile page:', err);
    res.status(500).send('Error loading profile page');
  }
};

module.exports = {
  showProfilePage
};
