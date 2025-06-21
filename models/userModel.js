// models/userModel.js

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Get a user by ID
const getUserById = async (userId) => {
  try {
    // Only select columns that exist in your database
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    
    // Add default profile image to the user object after retrieving from DB
    const user = result.rows[0];
    if (user) {
      // Add profile_image property to the user object
      user.profile_image = '/images/default-profile.png';
    }
    
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const query = 'SELECT id, username, email, password, created_at FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    
    const user = result.rows[0];
    if (user) {
      user.profile_image = '/images/default-profile.png';
    }
    
    return user;
  } catch (error) {
    throw new Error('Error fetching user by username: ' + error.message);
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Create a new user
const createUser = async (username, email, password, profileImage = null) => {
  try {
    // Generate a unique ID
    const id = uuidv4();
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert the new user
    let query, params;
    
    if (profileImage) {
      query = 'INSERT INTO users (id, username, email, password, profile_image, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *';
      params = [id, username, email, hashedPassword, profileImage];
    } else {
      query = 'INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *';
      params = [id, username, email, hashedPassword];
    }
    
    const result = await db.query(query, params);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const query = 'SELECT id, username, email, created_at FROM users';
    const result = await db.query(query);
    
    // Add profile_image to each user
    const users = result.rows;
    users.forEach(user => {
      user.profile_image = '/images/default-profile.png';
    });
    
    return users;
  } catch (error) {
    throw new Error('Error fetching all users: ' + error.message);
  }
};

// Update user
const updateUser = async (id, userData) => {
  try {
    const { username, email, password } = userData;
    let hashedPassword = null;
    
    // Hash the password if provided
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    
    // Build the query dynamically based on provided fields
    let query = 'UPDATE users SET ';
    const values = [];
    const updateFields = [];
    let paramIndex = 1;
    
    if (username) {
      updateFields.push(`username = $${paramIndex}`);
      values.push(username);
      paramIndex++;
    }
    
    if (email) {
      updateFields.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    
    if (hashedPassword) {
      updateFields.push(`password = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }
    
    // Add the WHERE clause
    query += updateFields.join(', ') + ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);
    
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
const deleteUser = async (id) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
