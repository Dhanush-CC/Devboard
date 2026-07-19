import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SavedProfiles from './pages/SavedProfiles';
import Compare from './pages/ComparePage';
import ProtectedRoute from './components/ProtectedRoute'; 
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext'; 

// Create a small wrapper for the App content so we can safely use `useAuth` inside it
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Protected Routes: Must be logged in to view */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/user/:username" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><SavedProfiles /></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />

      {/* Public Route: If already logged in, redirect away from login page */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <AppRoutes /> 
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;