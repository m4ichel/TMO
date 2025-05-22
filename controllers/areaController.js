// controllers/areaController.js

const areaService = require('../services/areaService');

// Get all areas for a specific user
const getAreasByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const areas = await areaService.getAreasByUserId(userId);
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single area by its ID
const getAreaById = async (req, res) => {
  try {
    const areaId = req.params.id;
    const area = await areaService.getAreaById(areaId);

    if (area) {
      res.status(200).json(area);
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new area
const createArea = async (req, res) => {
  try {
    const { title, description, owner_id, is_private } = req.body;
    const newArea = await areaService.createArea(title, description, owner_id, is_private);
    res.status(201).json(newArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing area
const updateArea = async (req, res) => {
  try {
    const areaId = req.params.id;
    const { title, description, is_private } = req.body;
    const updatedArea = await areaService.updateArea(areaId, title, description, is_private);

    if (updatedArea) {
      res.status(200).json(updatedArea);
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an area
const deleteArea = async (req, res) => {
  try {
    const areaId = req.params.id;
    const deletedArea = await areaService.deleteArea(areaId);

    if (deletedArea) {
      res.status(200).json({ message: 'Area deleted successfully' });
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAreasByUserId,
  getAreaById,
  createArea,
  updateArea,
  deleteArea
};
