// models/elementModel.js

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all elements by area ID
const getAllElementsByArea = async (area_id) => {
  const result = await db.query(
    'SELECT * FROM elements WHERE area_id = $1 ORDER BY created_at DESC',
    [area_id]
  );
  return result.rows;
};

// Get element by ID
const getElementById = async (id) => {
    const result = await db.query('SELECT * FROM elements WHERE id = $1', [id]);
    return result.rows[0];
};

// Create a new element
const createElement = async ({ type_id, area_id, title, details, deadline }) => {
    const id = uuidv4();
    const created_at = new Date();
    const result = await db.query(
        `INSERT INTO elements (id, type_id, area_id, title, details, deadline, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
        [id, type_id, area_id, title, details, deadline, created_at]
    );
    return result.rows[0];
};

// Update an existing element
const updateElement = async (id, { title, details, deadline, finished_at }) => {
    const result = await db.query(
        `UPDATE elements
     SET title = $1,
         details = $2,
         deadline = $3,
         finished_at = $4
     WHERE id = $5
     RETURNING *`,
        [title, details, deadline, finished_at, id]
    );
    return result.rows[0];
};

// Delete an element by ID
const deleteElement = async (id) => {
    const result = await db.query('DELETE FROM elements WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllElementsByArea,
    getElementById,
    createElement,
    updateElement,
    deleteElement
};
