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
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import ResearcherDashboard from './pages/dashboard/ResearcherDashboard';
import ApiKeyManagement from './pages/dashboard/ApiKeyManagement';
import BugListings from './pages/dashboard/BugListings';
import CreateBug from './pages/dashboard/CreateBug';
import BugDetail from './pages/dashboard/BugDetail';
import CreateSubmission from './pages/dashboard/CreateSubmission';
import ResearcherSubmissions from './pages/dashboard/ResearcherSubmissions';
import Notifications from './pages/dashboard/Notifications';
import UserProfile from './pages/dashboard/UserProfile';
import Leaderboard from './pages/dashboard/Leaderboard';

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

          <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
          
          {/* Protected company routes */}
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/dashboard/company/api-key" element={<ApiKeyManagement />} />
          <Route path="/dashboard/company/bugs" element={<BugListings />} />
          <Route path="/dashboard/company/bugs/create" element={<CreateBug />} />
          <Route path="/dashboard/company/notifications" element={<Notifications />} />
          <Route path="/dashboard/company/profile" element={<UserProfile />} />
          <Route path="/dashboard/company/leaderboard" element={<Leaderboard />} />
          
          {/* Protected researcher routes */}
          <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
          <Route path="/dashboard/researcher/bugs" element={<BugListings />} />
          <Route path="/dashboard/researcher/submissions" element={<ResearcherSubmissions />} />
          <Route path="/dashboard/researcher/submissions/create" element={<CreateSubmission />} />
          <Route path="/dashboard/researcher/notifications" element={<Notifications />} />
          <Route path="/dashboard/researcher/profile" element={<UserProfile />} />
          <Route path="/dashboard/researcher/leaderboard" element={<Leaderboard />} />
          
          {/* Shared routes that work for both user types */}
          <Route path="/dashboard/bugs/:id" element={<BugDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;