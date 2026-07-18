import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SavedProfiles from './pages/SavedProfiles';
import Compare from './pages/ComparePage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider> {/* <-- Wrap the entire app */}
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user/:username" element={<Dashboard />} />
              <Route path="/saved" element={<SavedProfiles />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;