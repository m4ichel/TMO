const express = require('express');
const router = express.Router();
const elementController = require('../controllers/elementController');

router.post('/area/:areaId', elementController.createElement);
router.get('/area/:areaId', elementController.getAllElementsByArea);
router.get('/:id', elementController.getElementById);
router.put('/:id', elementController.updateElement);
router.delete('/:id', elementController.deleteElement);

module.exports = router;