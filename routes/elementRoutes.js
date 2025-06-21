const express = require('express');
const router = express.Router();
const elementController = require('../controllers/elementController');

// Get all elements for an area
router.get('/area/:areaId', elementController.getElementsByArea);

// Get a single element
router.get('/:id', elementController.getElementById);

// Create a new element
router.post('/area/:areaId', elementController.createElement);

// Update an element
router.put('/:id', elementController.updateElement);

// Delete an element
router.delete('/:id', elementController.deleteElement);

module.exports = router;
