const axios = require('axios');
const Cache = require('../models/Cache');

const GITHUB_API_URL = 'https://api.github.com';
const headers = process.env.GITHUB_PAT ? { Authorization: `token ${process.env.GITHUB_PAT}` } : {};

const getGitHubProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Check MongoDB Cache (Expire after 24 hours)
    const cachedData = await Cache.findOne({ username: username.toLowerCase() });
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (cachedData && cachedData.lastFetched > oneDayAgo) {
      console.log(`⚡ Serving ${username} from MongoDB Cache`);
      return res.json({ cached: true, data: cachedData });
    }

    console.log(`🌐 Fetching ${username} from GitHub API`);

    // 2. Fetch Core Data Concurrently
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`${GITHUB_API_URL}/users/${username}`, { headers }),
      axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=15&sort=updated`, { headers }),
      axios.get(`${GITHUB_API_URL}/users/${username}/events?per_page=30`, { headers })
    ]);

    const profileData = profileRes.data;
    const reposData = reposRes.data;
    const eventsData = eventsRes.data;

    // 3. Aggregate Languages for the Pie Chart
    const languageMap = {};
    const languagePromises = reposData
      .filter(repo => repo.language && !repo.fork) // Only non-forked repos that have a language
      .slice(0, 10) // Limit to top 10 recent repos to save API calls
      .map(repo => axios.get(repo.languages_url, { headers }));

    const languageResponses = await Promise.all(languagePromises);
    
    languageResponses.forEach(response => {
      const langs = response.data;
      for (const [key, value] of Object.entries(langs)) {
        languageMap[key] = (languageMap[key] || 0) + value;
      }
    });

    // Format for Recharts [{ name: 'JavaScript', value: 10450 }]
    const languagesData = Object.entries(languageMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const fullData = {
      username: username.toLowerCase(),
      profileData,
      reposData,
      languagesData,
      eventsData,
      lastFetched: new Date()
    };

    // 4. Update or Create Cache in MongoDB
    await Cache.findOneAndUpdate(
      { username: username.toLowerCase() },
      fullData,
      { upsert: true, new: true }
    );

    res.json({ cached: false, data: fullData });

  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    res.status(500).json({ message: 'Error fetching GitHub data' });
  }
};

module.exports = { getGitHubProfile };