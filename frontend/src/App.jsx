// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import Sponsor from './pages/Sponsor';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Components & Pages
import ProtectedRoute from './components/auth/ProtectedRoute';
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import ResearcherDashboard from './pages/dashboard/ResearcherDashboard';
import ApiKeyManagement from './pages/dashboard/ApiKeyManagement';
import BugListings from './pages/dashboard/BugListings';
import CreateBug from './pages/dashboard/CreateBug';
import BugDetail from './pages/dashboard/BugDetail';
import CreateSubmission from './pages/dashboard/createSubmission';
import ResearcherSubmissions from './pages/dashboard/ResearcherSubmissions';

// Context
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
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/dashboard/company/api-key" element={<ApiKeyManagement />} />
          <Route path="/dashboard/company/bugs" element={<BugListings />} />
          <Route path="/dashboard/company/bugs/create" element={<CreateBug />} />
          
          {/* Protected researcher routes */}
          <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
          <Route path="/dashboard/researcher/bugs" element={<BugListings />} />
          <Route path="/dashboard/researcher/submissions" element={<ResearcherSubmissions />} />
          <Route path="/dashboard/researcher/submissions/create" element={<CreateSubmission />} />
          
          {/* Shared routes that work for both user types */}
          <Route path="/dashboard/bugs/:id" element={<BugDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;