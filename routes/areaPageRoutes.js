const express = require('express');
const router = express.Router();
const areaPageController = require('../controllers/areaPageController');

// Route for viewing a specific area
router.get('/area/:id', areaPageController.showAreaPage);

module.exports = router;