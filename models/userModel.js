// models/userModel.js

const db = require('../config/db');

// Função para obter todos os usuários
const getAllUsers = async () => {
  try {
    const result = await db.query(
      'SELECT * FROM users'
    );
    return result.rows;
  } catch (error) {
    throw new Error('Error while getting users: ' + error.message);
  }
};

// Função para obter um usuário por ID
const getUserById = async (id) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1', 
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error while getting user: ' + error.message);
  }
};

// Get a user by username
const getUserByUsername = async (username) => {
  try {
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1', 
    [username]
  );
  return result.rows[0];
} catch (error) {
  throw new Error('Error while getting user by username: ' + error.message);
}
};

// Função para criar um novo usuário
const createUser = async (username, password) => {
  try {
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', 
      [username, password]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error while creating user: ' + error.message);
  }
};

// Função para atualizar um usuário por ID
const updateUser = async (id, username, email) => {
  try {
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error while updating user: ' + error.message);
  }
};

// Função para deletar um usuário por ID
const deleteUser = async (id) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING *', 
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error while deleting user: ' + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
};
