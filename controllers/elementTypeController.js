// controllers/elementTypeController.js

const elementTypeService = require('../services/elementTypeService.js');

const getAllElementTypes = async (req, res) => {
    try {
        const elementTypes = await elementTypeService.getAllElementTypes()
        res.status(200).json(elementTypes);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllElementTypes
}