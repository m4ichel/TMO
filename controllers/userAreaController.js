// controllers/userAreaController.js

const userAreaService = require('../services/userAreaService');

// Add a user to an area
const addUserToArea = async (req, res) => {
  try {
    const { userId, areaId } = req.body;
    const result = await userAreaService.addUserToArea(userId, areaId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users in a specific area
const getUsersByArea = async (req, res) => {
  try {
    const areaId = req.params.areaId;
    const users = await userAreaService.getUsersByArea(areaId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all areas accessible by a specific user (including private ones)
const getAllAreasByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const areas = await userAreaService.getAllAreasByUser(user_id);
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all non-private areas accessible by a specific user
const getPublicAreasByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const areas = await userAreaService.getPublicAreasByUser(userId);
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a user from an area
const removeUserFromArea = async (req, res) => {
  try {
    const { userId, areaId } = req.body;
    const result = await userAreaService.removeUserFromArea(userId, areaId);
    res.status(200).json({ message: 'User removed from area successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addUserToArea,
  getUsersByArea,
  getAllAreasByUser,
  getPublicAreasByUser,
  removeUserFromArea,
};
