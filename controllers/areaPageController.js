const areaModel = require('../models/areaModel');
const userModel = require('../models/userModel');
const elementModel = require('../models/elementModel');

const showAreaPage = async (req, res) => {
  const areaId = req.params.id;
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
    
    let area = null;
    try {
      area = await areaModel.getAreaById(areaId);
      if (!area) {
        return res.status(404).send('Area not found');
      }
    } catch (areaErr) {
      console.error('Error fetching area:', areaErr);
      return res.status(404).send('Area not found: ' + areaErr.message);
    }
    
    let elements = [];
    try {
      elements = await elementModel.getElementsByArea(areaId);
    } catch (elemErr) {
      console.error('Error fetching elements:', elemErr);
      // Continue with empty elements array
    }
    
    return res.render('pages/area', { 
      user: user,
      area: area,
      elements: elements || [] 
    });
  } catch (err) {
    console.error('Error in showAreaPage:', err);
    return res.status(500).send('Server error: ' + err.message);
  }
};

module.exports = {
  showAreaPage
};
