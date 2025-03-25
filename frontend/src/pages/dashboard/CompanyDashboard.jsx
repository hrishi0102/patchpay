// src/pages/dashboard/CompanyDashboard.jsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaPlus } from 'react-icons/fa';

const CompanyDashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Company Overview</h2>
        <p className="text-gray-300 mb-4">
          Welcome to your company dashboard. Here you can post bug bounties, review submissions, and manage payments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">Active Bugs</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">Pending Submissions</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-white">$0</div>
            <div className="text-gray-400">Balance</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bug Posts</h2>
          <Link to="/dashboard/company/bugs/create" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Post New Bug
          </Link>
        </div>
        <p className="text-gray-400">No bug listings available yet.</p>
      </div>
    </div>
  );
};

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'company') {
      navigate('/dashboard/researcher');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <DashboardLayout userRole="company">
      <CompanyDashboardHome />
    </DashboardLayout>
  );
};

export default CompanyDashboard;