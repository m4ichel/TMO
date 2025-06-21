const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to show the profile page
router.get('/profile', profileController.showProfilePage);

module.exports = router;