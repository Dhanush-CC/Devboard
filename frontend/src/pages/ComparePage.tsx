import { useState } from 'react';
import { api } from '../services/api';
import { Loader2, Search, Users, BookMarked, GitMerge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Compare() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username1.trim() || !username2.trim()) {
      setError("Please enter both usernames");
      return;
    }

    setLoading(true);
    setError('');
    setData1(null);
    setData2(null);

    try {
      // Fetch both profiles simultaneously for speed
      const [res1, res2] = await Promise.all([
        api.get(`/github/${username1.trim()}`),
        api.get(`/github/${username2.trim()}`)
      ]);

      setData1(res1.data.data);
      setData2(res2.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch one or both profiles. Check the usernames.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the comparison chart
  const chartData = data1 && data2 ? [
    {
      name: 'Followers',
      [data1.profileData.login]: data1.profileData.followers,
      [data2.profileData.login]: data2.profileData.followers,
    },
    {
      name: 'Following',
      [data1.profileData.login]: data1.profileData.following,
      [data2.profileData.login]: data2.profileData.following,
    },
    {
      name: 'Public Repos',
      [data1.profileData.login]: data1.profileData.public_repos,
      [data2.profileData.login]: data2.profileData.public_repos,
    }
  ] : [];

  const renderProfileCard = (data: any) => {
    if (!data) return null;
    const { profileData } = data;
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
        <img src={profileData.avatar_url} alt={profileData.login} className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.name || profileData.login}</h2>
        <a href={profileData.html_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mb-4 text-sm">
          @{profileData.login}
        </a>
        <div className="flex justify-center gap-6 w-full py-4 border-t border-gray-100 dark:border-gray-700 mt-2">
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-900 dark:text-white">{profileData.followers}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1 justify-center"><Users className="w-3 h-3"/> Followers</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-900 dark:text-white">{profileData.public_repos}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1 justify-center"><BookMarked className="w-3 h-3"/> Repos</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
          <GitMerge className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Profiles</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter two GitHub usernames to compare their stats side-by-side.</p>
      </div>

      <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            placeholder="Username 1 (e.g., torvalds)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>
        <span className="text-gray-400 font-bold hidden md:block">VS</span>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            placeholder="Username 2 (e.g., gaearon)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-center rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {data1 && data2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Profile Cards Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderProfileCard(data1)}
            {renderProfileCard(data2)}
          </div>

          {/* Comparison Bar Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Head-to-Head Stats</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend />
                  <Bar dataKey={data1.profileData.login} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={data2.profileData.login} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}