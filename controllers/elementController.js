// controllers/elementController.js

const elementModel = require('../models/elementModel');

// Get all elements for an area
const getElementsByArea = async (req, res) => {
  try {
    const areaId = req.params.areaId;
    const elements = await elementModel.getElementsByArea(areaId);
    res.status(200).json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single element by ID
const getElementById = async (req, res) => {
  try {
    const elementId = req.params.id;
    const element = await elementModel.getElementById(elementId);
    
    if (element) {
      res.status(200).json(element);
    } else {
      res.status(404).json({ error: 'Element not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new element
const createElement = async (req, res) => {
  try {
    const { type_id, title, details, position_x, position_y } = req.body;
    const area_id = req.params.areaId || req.body.area_id;
    
    console.log('Creating element with data:', { type_id, area_id, title, details, position_x, position_y });
    
    const newElement = await elementModel.createElement({
      type_id,
      area_id,
      title,
      details,
      position_x,
      position_y
    });
    
    console.log('Element created:', newElement);
    res.status(201).json(newElement);
  } catch (error) {
    console.error('Error creating element:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an element
const updateElement = async (req, res) => {
  try {
    const elementId = req.params.id;
    const updatedElement = await elementModel.updateElement(elementId, req.body);
    
    if (updatedElement) {
      res.status(200).json(updatedElement);
    } else {
      res.status(404).json({ error: 'Element not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an element
const deleteElement = async (req, res) => {
  try {
    const elementId = req.params.id;
    const deletedElement = await elementModel.deleteElement(elementId);
    
    if (deletedElement) {
      res.status(200).json({ message: 'Element deleted successfully' });
    } else {
      res.status(404).json({ error: 'Element not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getElementsByArea,
  getElementById,
  createElement,
  updateElement,
  deleteElement
};
