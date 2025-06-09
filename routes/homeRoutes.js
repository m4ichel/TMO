// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route to show the home page
router.get('/home', homeController.showHomePage);

// Route to add a new area in the home page
router.post('/home', homeController.createArea);

module.exports = router;
