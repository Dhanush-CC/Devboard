const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  profileData: { type: Object, required: true },
  reposData: { type: Array, required: true },
  languagesData: { type: Array, required: true },
  eventsData: { type: Array, required: true },
  lastFetched: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cache', cacheSchema);