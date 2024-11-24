import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AgentList } from './pages/AgentList';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AgentManagementPage } from './pages/AgentManagementPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { SettingsPage } from './pages/SettingsPage';
import { NoticePage } from './pages/NoticePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#111827] text-white">
        <Routes>
          {/* Public login route */}
          <Route path="/magicplayadmin/login" element={<LoginPage />} />
          
          {/* Protected admin routes */}
          <Route path="/magicplayadmin/*" element={
            <ProtectedRoute requireAdmin>
              <div className="min-h-screen bg-[#111827]">
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/agents/:type" element={<AgentManagementPage />} />
                  <Route path="/notices" element={<NoticePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Public routes with main layout */}
          <Route path="/*" element={
            <div className="min-h-screen bg-[#111827]">
              <Navbar />
              <div className="container mx-auto px-4 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/agents/:type" element={<AgentList />} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;