const areaModel = require('../models/areaModel');
const userAreaModel = require('../models/userAreaModel');

const showHomePage = async (req, res) => {
  const userId = req.session.userId;
  try {
    const areas = await userAreaModel.getAllAreasByUser(userId);
    res.render('home', { areas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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