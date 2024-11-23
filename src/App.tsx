import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { AgentList } from './pages/AgentList';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NoticePage } from './pages/NoticePage';
import { AgentManagementPage } from './pages/AgentManagementPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#111827]">
        <Routes>
          <Route path="/magicplayadmin/login" element={<LoginPage />} />
          <Route path="/magicplayadmin/*" element={
            <ProtectedRoute requireAdmin>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/notices" element={<NoticePage />} />
                <Route path="/agents/:type" element={<AgentManagementPage />} />
              </Routes>
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <>
              <Navbar />
              <Header />
              <div className="container mx-auto px-4 py-8 relative z-10 -mt-16">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/agents/:type" element={<AgentList />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;