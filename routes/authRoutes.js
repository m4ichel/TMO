// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to show the login page
router.get('/login', authController.showLoginPage);

// Route to process the login form
router.post('/login', authController.loginProcess);

// Route to show the register page
router.get('/register', authController.showRegisterPage);

// Route to process the registration form
router.post('/register', authController.registerProcess);

// Route to handle logout
router.get('/logout', authController.logout);

module.exports = router;
