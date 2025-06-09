const userModel = require('../models/userModel');

const showLoginPage = (req, res) => {
  res.render('login', { error: null });
};

const loginProcess = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Please fill in all fields.' });
  }

  try {
    let user = await userModel.getUserByUsername(username);

    if (!user) {
      // User not found: create new one
      user = await userModel.createUser(username, password);
    }

    if (user.password === password) {
      req.session.userId = user.id;
      return res.redirect('/home');
    } else {
      return res.render('login', { error: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error(error);
    return res.render('login', { error: 'An error occurred. Please try again.' });
  }
};

module.exports = {
  showLoginPage,
  loginProcess
}