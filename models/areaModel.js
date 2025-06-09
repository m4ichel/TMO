// models/areaModel.js

const db = require('../config/db');

const getAllAreas = async () => {
  try {
    const result = await db.query('SELECT * FROM areas');
    return result.rows;
  } catch (error) {
    throw new Error('Error fetching areas: ' + error.message);
  }
};

// Get a single area by its ID
const getAreaById = async (areaId) => {
  const query = `SELECT * FROM areas WHERE id = $1`;
  const result = await db.query(query, [areaId]);
  return result.rows[0];
};

// Create a new area
const createArea = async (title, description, ownerId, isPrivate = false) => {
  // Start a transaction
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert into areas and get the new area
    const insertAreaText = `
      INSERT INTO areas (title, description, owner_id, is_private)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const areaResult = await client.query(insertAreaText, [title, description, ownerId, isPrivate]);
    const newArea = areaResult.rows[0];

    // Insert into user_area to link area and user
    const insertUserAreaText = `
      INSERT INTO user_area (user_id, area_id)
      VALUES ($1, $2)
    `;
    await client.query(insertUserAreaText, [ownerId, newArea.id]);

    await client.query('COMMIT');
    return newArea;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Update an existing area
const updateArea = async (areaId, title, description, isPrivate) => {
  const query = `
    UPDATE areas
    SET title = $1, description = $2, is_private = $3
    WHERE id = $4
    RETURNING *
  `;
  const result = await db.query(query, [title, description, isPrivate, areaId]);
  return result.rows[0];
};

// Delete an area
const deleteArea = async (areaId) => {
  const query = `DELETE FROM areas WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [areaId]);
  return result.rows[0]; // will be undefined if not found
};

module.exports = {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea
};
