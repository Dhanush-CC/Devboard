import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePage.tsx';
import Login from './pages/LoginPage.tsx';

function App() {
  return (
    <BrowserRouter>
      {/* We apply base background colors here so the whole screen spans */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* We will add the Dashboard route here later */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;