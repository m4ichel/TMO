const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'public/uploads/profiles';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('profileImage');

// Show login page
const showLoginPage = (req, res) => {
  res.render('pages/login', { error: null });
};

// Process login form
const loginProcess = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('pages/login', { error: 'Please enter both username and password.' });
  }

  try {
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.render('pages/login', { error: 'Invalid username or password.' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      // Set user session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.profileImage = user.profile_image;
      return res.redirect('/home');
    } else {
      return res.render('pages/login', { error: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.render('pages/login', { error: 'An error occurred. Please try again.' });
  }
};

// Show register page
const showRegisterPage = (req, res) => {
  res.render('pages/register', { error: null });
};

// Process registration form
const registerProcess = async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.render('pages/register', { error: 'File upload error: ' + err.message });
    } else if (err) {
      // An unknown error occurred when uploading
      return res.render('pages/register', { error: err.message });
    }
    
    const { username, email, password, confirmPassword } = req.body;
    
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.render('pages/register', { error: 'Please fill in all required fields.' });
    }
    
    if (password !== confirmPassword) {
      return res.render('pages/register', { error: 'Passwords do not match.' });
    }
    
    try {
      // Check if username already exists
      const existingUser = await userModel.getUserByUsername(username);
      if (existingUser) {
        return res.render('pages/register', { error: 'Username already taken.' });
      }
      
      // Check if email already exists
      const existingEmail = await userModel.getUserByEmail(email);
      if (existingEmail) {
        return res.render('pages/register', { error: 'Email already in use.' });
      }
      
      // Get profile image path if uploaded
      let profileImagePath = null;
      if (req.file) {
        profileImagePath = '/uploads/profiles/' + req.file.filename;
      } else {
        profileImagePath = '/images/default-profile.png';
      }
      
      // Create new user
      const newUser = await userModel.createUser(username, email, password, profileImagePath);
      
      // Set user session
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.profileImage = newUser.profile_image;
      
      // Redirect to home page
      return res.redirect('/home');
    } catch (error) {
      console.error('Registration error:', error);
      return res.render('pages/register', { error: 'An error occurred. Please try again.' });
    }
  });
};

// Handle logout
const logout = (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};

module.exports = {
  showLoginPage,
  loginProcess,
  showRegisterPage,
  registerProcess,
  logout
}
