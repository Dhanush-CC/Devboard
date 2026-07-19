import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Bookmark, GitMerge, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GithubIcon from './GithubIcon';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // <-- Extract theme state and toggle function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            <GithubIcon className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">DevBoard</span>
          </Link>

          {/* Right side navigation */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button (Visible to everyone) */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/compare" 
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                >
                  <GitMerge className="w-4 h-4" />
                  <span className="hidden sm:inline">Compare</span>
                </Link>

                <Link 
                  to="/saved" 
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors ml-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </Link>
                
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}