// services/userAreaService.js

const db = require('../config/db');

const addUserToArea = async (userId, areaId) => {
  const result = await db.query(
    'INSERT INTO user_area (user_id, area_id) VALUES ($1, $2) RETURNING *',
    [userId, areaId]
  );
  return result.rows[0];
};

const getUsersByArea = async (areaId) => {
  const result = await db.query(
    `SELECT u.id, u.username, u.email
     FROM user_area ua
     JOIN users u ON ua.user_id = u.id
     WHERE ua.area_id = $1`,
    [areaId]
  );
  return result.rows;
};

const getAllAreasByUser = async (userId) => {
  const result = await db.query(
    `SELECT a.id, a.title, a.description, a.is_private
     FROM user_area ua
     JOIN areas a ON ua.area_id = a.id
     WHERE ua.user_id = $1`,
    [userId]
  );
  return result.rows;
};

const getPublicAreasByUser = async (userId) => {
  const query = `
    SELECT a.*
    FROM user_area ua
    JOIN areas a ON ua.area_id = a.id
    WHERE ua.user_id = $1 AND a.is_private = false;
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const removeUserFromArea = async (userId, areaId) => {
  const result = await db.query(
    'DELETE FROM user_area WHERE user_id = $1 AND area_id = $2 RETURNING *',
    [userId, areaId]
  );
  return result.rows[0];
};

module.exports = {
  addUserToArea,
  getUsersByArea,
  getAllAreasByUser,
  getPublicAreasByUser,
  removeUserFromArea,
};
