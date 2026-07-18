import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, Users, BookMarked, MapPin, Building2, Link as LinkIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileData {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  location: string;
  company: string;
  blog: string;
  html_url: string;
}

interface RepoData {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { username } = useParams<{ username: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [repos, setRepos] = useState<RepoData[]>([]);
  
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [hasRequestedAi, setHasRequestedAi] = useState(false);

  useEffect(() => {
    const fetchGitHubData = async () => {
      setLoading(true);
      setError('');
      // Reset AI states on new user search
      setAiInsight('');
      setHasRequestedAi(false);
      
      try {
        const res = await api.get(`/github/${username}`);
        const { profileData, languagesData, reposData } = res.data.data;
        
        setProfile(profileData);
        setLanguages(languagesData);
        setRepos(reposData.slice(0, 6)); 

      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  const handleGenerateAi = async () => {
    setHasRequestedAi(true);
    setAiLoading(true);
    try {
      const res = await api.post('/ai/insight', { profileData: profile, languagesData: languages });
      setAiInsight(res.data.insight);
    } catch (err) {
      setAiInsight("AI insight generation failed or is unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // Calculate percentages for the chart
  const totalBytes = languages.reduce((sum, lang) => sum + lang.value, 0);
  const chartData = languages.slice(0, 5).map(lang => ({
    ...lang,
    percentage: totalBytes > 0 ? ((lang.value / totalBytes) * 100).toFixed(1) : 0
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Fetching and analyzing data from GitHub...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Link to="/" className="text-blue-500 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
          <div className="flex flex-col items-center text-center">
            <img src={profile.avatar_url} alt={profile.login} className="w-32 h-32 rounded-full border-4 border-gray-50 dark:border-gray-700 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name || profile.login}</h1>
            <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mb-4">
              @{profile.login}
            </a>
            {profile.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{profile.bio}</p>}
            
            <div className="flex justify-center gap-6 w-full py-4 border-t border-b border-gray-100 dark:border-gray-700 mb-6">
              <div className="text-center">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">{profile.followers}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3"/> Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">{profile.public_repos}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><BookMarked className="w-3 h-3"/> Repos</span>
              </div>
            </div>

            <div className="w-full space-y-3 text-sm text-gray-600 dark:text-gray-400 text-left">
              {profile.location && <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {profile.location}</p>}
              {profile.company && <p className="flex items-center gap-2"><Building2 className="w-4 h-4"/> {profile.company}</p>}
              {profile.blog && <p className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/> <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="hover:text-blue-500 truncate">{profile.blog}</a></p>}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insight, Charts, and Repos */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Insight Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">AI Engineering Summary</h2>
              </div>
              
              {!hasRequestedAi && !aiInsight && (
                <button 
                  onClick={handleGenerateAi}
                  className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate
                </button>
              )}
            </div>

            {aiLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing repositories and tech stack...
              </div>
            ) : aiInsight ? (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {aiInsight}
              </p>
            ) : !hasRequestedAi && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Click generate to get an AI-powered summary of this developer's technical profile.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Language Distribution</h2>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      {/* Tooltip now correctly shows the calculated percentage */}
                      <Tooltip formatter={(value, name, props) => [`${props.payload.percentage}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {chartData.map((lang, idx) => (
                      <span key={lang.name} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {lang.name} ({lang.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-10">No language data available.</p>
              )}
            </div>

            {/* Recent Repositories */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Repositories</h2>
              <div className="space-y-4">
                {repos.length > 0 ? repos.map(repo => (
                  <div key={repo.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-sm truncate block">
                      {repo.name}
                    </a>
                    {repo.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{repo.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>{repo.language}</span>}
                      <span>⭐ {repo.stargazers_count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-10">No public repositories found.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}