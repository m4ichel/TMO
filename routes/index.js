const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes'); // Import user-related routes

router.get('/', (req, res) => {
  res.send('API is working');
});

router.use('/', userRoutes); // Mount user routes at the root of /api

const areaRoutes = require('./areaRoutes');
router.use('/areas', areaRoutes);

module.exports = router;