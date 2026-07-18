import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, PieChart } from 'lucide-react';
import GithubIcon from '../components/GithubIcon'; // <-- Imported our custom icon!

export default function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Redirect to the dynamic user route
      navigate(`/user/${username.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mb-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <GithubIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          Analyze Any GitHub Profile
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Get instant insights, language distributions, and contribution activity wrapped in a beautiful, AI-powered dashboard.
        </p>
      </div>

      {/* Search Form */}
      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-xl relative group"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a GitHub username (e.g., torvalds, gaearon)"
          className="block w-full pl-12 pr-4 py-4 md:text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 shadow-sm transition-all outline-none"
          required
        />
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          Analyze
        </button>
      </form>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl w-full text-center">
        <div className="flex flex-col items-center">
          <PieChart className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Language Breakdown</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize tech stacks across all public repositories.</p>
        </div>
        <div className="flex flex-col items-center">
          <Activity className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Caching</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bypass rate limits with our MongoDB caching engine.</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-3">✨</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate AI summaries of developer profiles.</p>
        </div>
      </div>
    </div>
  );
}