// controllers/areaController.js

const areaModel = require('../models/areaModel');
const userModel = require('../models/userModel');
const userAreaModel = require('../models/userAreaModel');
const elementModel = require('../models/elementModel');

const getAllAreas = async (req, res) => {
  try {
    const areas = await areaModel.getAllAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single area by its ID
const getAreaById = async (req, res) => {
  try {
    const areaId = req.params.id;
    const area = await areaModel.getAreaById(areaId);

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
    const newArea = await areaModel.createArea(title, description, owner_id, is_private);
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
    const updatedArea = await areaModel.updateArea(areaId, title, description, is_private);

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
    const deletedArea = await areaModel.deleteArea(areaId);

    if (deletedArea) {
      res.status(200).json({ message: 'Area deleted successfully' });
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    
    // Get area information
    const area = await areaModel.getAreaById(areaId);
    
    if (!area) {
      return res.status(404).send('Area not found');
    }
    
    // Check if user has access to this area
    const hasAccess = await userAreaModel.checkUserAreaAccess(userId, areaId);
    
    if (!hasAccess) {
      return res.status(403).send('You do not have access to this area');
    }
    
    // Get elements for this area
    const elements = await elementModel.getElementsByArea(areaId);
    
    res.render('pages/area', { 
      user: user,
      area: area,
      elements: elements 
    });
  } catch (err) {
    console.error('Error loading area page:', err);
    res.status(500).send('Error loading area page');
  }
};

module.exports = {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  showAreaPage
};
