const areaModel = require('../models/areaModel');
const userAreaModel = require('../models/userAreaModel');
const userModel = require('../models/userModel');

const showHomePage = async (req, res) => {
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
    
    // Ensure we have a default profile image if none exists
    if (!user.profile_image) {
      user.profile_image = '/images/default-profile.png';
    }
    
    let areas = [];
    try {
      areas = await userAreaModel.getAllAreasByUser(userId);
    } catch (areaErr) {
      console.error('Error fetching areas:', areaErr);
      // Continue with empty areas array
    }
    
    return res.render('pages/home', { 
      user: user,
      areas: areas || [] 
    });
  } catch (err) {
    console.error('Error in showHomePage:', err);
    return res.status(500).send("Server error: " + err.message);
  }
};

const createArea = async (req, res) => {
  const { title, description, isPrivate } = req.body;
  const ownerId = req.session.userId;

  if (!title || !description) {
    return res.status(400).send("Title and description are required");
  }

  try {
    // Create the area with the current user as owner
    await areaModel.createArea(title, description, ownerId, isPrivate === 'true');
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating area');
  }
};

module.exports = {
  showHomePage,
  createArea
}
