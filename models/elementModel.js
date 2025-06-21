// models/elementModel.js

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all elements by area ID
const getElementsByArea = async (area_id) => {
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
const createElement = async ({ type_id, area_id, title, details, deadline, position_x = 0, position_y = 0 }) => {
    const id = uuidv4();
    const created_at = new Date();
    const result = await db.query(
        `INSERT INTO elements (id, type_id, area_id, title, details, deadline, created_at, position_x, position_y)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
        [id, type_id, area_id, title, details, deadline, created_at, position_x, position_y]
    );
    return result.rows[0];
};

// Update an existing element
const updateElement = async (id, { title, details, deadline, finished_at, position_x, position_y }) => {
    // Build the SET clause dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    // Only include fields that are provided in the request
    if (title !== undefined) {
        updates.push(`title = $${paramIndex++}`);
        values.push(title);
    }
    
    if (details !== undefined) {
        updates.push(`details = $${paramIndex++}`);
        values.push(details);
    }
    
    if (deadline !== undefined) {
        updates.push(`deadline = $${paramIndex++}`);
        values.push(deadline);
    }
    
    if (finished_at !== undefined) {
        updates.push(`finished_at = $${paramIndex++}`);
        values.push(finished_at);
    }
    
    if (position_x !== undefined) {
        updates.push(`position_x = $${paramIndex++}`);
        values.push(position_x);
    }
    
    if (position_y !== undefined) {
        updates.push(`position_y = $${paramIndex++}`);
        values.push(position_y);
    }
    
    // If no updates were provided, return null
    if (updates.length === 0) {
        return null;
    }
    
    // Add the ID to the values array
    values.push(id);
    
    // Build and execute the query
    const query = `
        UPDATE elements
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
};

// Delete an element by ID
const deleteElement = async (id) => {
    const result = await db.query('DELETE FROM elements WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getElementsByArea,
    getElementById,
    createElement,
    updateElement,
    deleteElement
};
