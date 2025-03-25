// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Sponsor from './pages/Sponsor';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import ResearcherDashboard from './pages/dashboard/ResearcherDashboard';
import ApiKeyManagement from './pages/dashboard/ApiKeyManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <Routes>
          {/* Public routes with public layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sponsor" element={<Sponsor />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          
          {/* Protected company routes */}
          <Route element={<ProtectedRoute roleRequired="company" />}>
            <Route path="/dashboard/company" element={<CompanyDashboard />} />
            <Route path="/dashboard/company/api-key" element={<ApiKeyManagement />} />
          </Route>
          
          {/* Protected researcher routes */}
          <Route element={<ProtectedRoute roleRequired="researcher" />}>
            <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;