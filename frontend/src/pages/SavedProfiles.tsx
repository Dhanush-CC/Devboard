import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, ArrowRight } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';

export default function SavedProfiles() {
  const { user, isAuthenticated } = useAuth();

  // Protect the route: if not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const savedProfiles = user?.savedProfiles || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-8">
        <Bookmark className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Saved Profiles</h1>
      </div>

      {savedProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No profiles saved yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Search for a developer and click "Save Profile" to bookmark them here.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Go to Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedProfiles.map((username, index) => (
            <Link 
              key={index}
              to={`/user/${username}`}
              className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  <GithubIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">@{username}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}