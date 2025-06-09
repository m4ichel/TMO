// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to show the login page
router.get('/login', authController.showLoginPage);

// Route to process the data in the login form
router.post('/login', authController.loginProcess);

module.exports = router;
