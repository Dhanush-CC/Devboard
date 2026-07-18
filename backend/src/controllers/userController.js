const User = require('../models/User');

const saveProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { savedProfiles: username.toLowerCase() } },
      { returnDocument: 'after' }
    ).select('-password');

    res.json({ message: 'Profile saved successfully', user: updatedUser });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Error saving profile' });
  }
};

const removeProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { savedProfiles: username.toLowerCase() } },
      { returnDocument: 'after' }
    ).select('-password');

    res.json({ message: 'Profile removed successfully', user: updatedUser });
  } catch (error) {
    console.error('Error removing profile:', error);
    res.status(500).json({ message: 'Error removing profile' });
  }
};

module.exports = { saveProfile, removeProfile };