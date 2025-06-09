// controllers/elementController.js

const elementModel = require('../models/elementModel');

const getAllElementsByArea = async (req, res) => {
  try {
    const { area_id } = req.params;
    const elements = await elementModel.getAllElementsByArea(area_id);
    res.status(200).json(elements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getElementById = async (req, res) => {
    try {
        const element = await elementModel.getElementById(req.params.id);
        if (element) {
            res.status(200).json(element);
        } else {
            res.status(404).json({ error: 'Element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createElement = async (req, res) => {
    try {
        const { type_id, area_id, title, details, deadline } = req.body;
        const newElement = await elementModel.createElement({ type_id, area_id, title, details, deadline });
        res.status(201).json(newElement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateElement = async (req, res) => {
    try {
        const { title, details, deadline, finished_at } = req.body;
        const updatedElement = await elementModel.updateElement(req.params.id, { title, details, deadline, finished_at });
        if (updatedElement) {
            res.status(200).json(updatedElement);
        } else {
            res.status(404).json({ error: 'Element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteElement = async (req, res) => {
    try {
        const deleted = await elementModel.deleteElement(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Element deleted successfully' });
        } else {
            res.status(404).json({ error: 'Element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllElementsByArea,
    getElementById,
    createElement,
    updateElement,
    deleteElement
};
