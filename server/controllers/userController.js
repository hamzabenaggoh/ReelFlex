const User = require('../models/user');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, preferredInfluencers } = req.body;
  console.log(req.body); 

  const newUser = new User({
    username,
    preferredInfluencers
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePreferredInfluencers = async (req, res) => {
  const { userID, preferredInfluencers } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferredInfluencers = preferredInfluencers;
    await user.save();
    res.status(200).json({ message: 'Preferred influencers updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getUsers, createUser, updatePreferredInfluencers };