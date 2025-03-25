// src/pages/dashboard/ResearcherDashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ResearcherDashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Researcher Overview</h2>
        <p className="text-gray-300 mb-4">
          Welcome to your researcher dashboard. Here you can browse bug listings, submit fixes, and track your earnings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">Submissions</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">Approved Fixes</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">$0</div>
            <div className="text-gray-400">Total Earnings</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Recent Bug Listings</h2>
        <p className="text-gray-400">No bug listings available yet.</p>
      </div>
    </div>
  );
};

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'researcher') {
      navigate('/dashboard/company');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <DashboardLayout userRole="researcher">
      <ResearcherDashboardHome />
    </DashboardLayout>
  );
};

export default ResearcherDashboard;