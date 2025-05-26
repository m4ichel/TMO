const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.get('/allAreas', areaController.getAllAreas);
router.get('/area', areaController.getAreaById);
router.post('/', areaController.createArea);
router.put('/area/:id', areaController.updateArea);
router.delete('/area/:id', areaController.deleteArea);

module.exports = router;