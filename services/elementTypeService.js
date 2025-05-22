// services/elementTypeService.js

const db = require('../config/db');

// Get all the element types
const getAllElementTypes = async () => {
    const elementTypes = await db.query('SELECT * FROM element_types')
    return elementTypes.rows;
};

module.exports = {
    getAllElementTypes
}