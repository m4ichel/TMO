const express = require('express');
const router = express.Router();
const userAreaController = require('../controllers/userAreaController');

router.post('/user/:userId/area/:areaId', userAreaController.addUserToArea);
router.get('/area/:areaId', userAreaController.getUsersByArea);
router.get('/user/:userId', userAreaController.getAllAreasByUser);
router.get('/user/:userId', userAreaController.getPublicAreasByUser);
router.delete('/user/:userId/area/:areaId', userAreaController.removeUserFromArea);

module.exports = router;