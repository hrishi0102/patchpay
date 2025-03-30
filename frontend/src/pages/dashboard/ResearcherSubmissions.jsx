// src/pages/dashboard/ResearcherSubmissions.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaExclamationTriangle, FaChartLine, FaFilter } from 'react-icons/fa';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import SubmissionCard from '../../components/submissions/SubmissionCard';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { leaderboardService } from '../../services/leaderboard.service';

const ResearcherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    successRate: 0,
    successfulSubmissions: 0,
    totalSubmissions: 0
  });
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  
  useEffect(() => {
    const fetchSubmissionsAndStats = async () => {
      try {
        setLoading(true);
        
        // Fetch submissions
        const response = await api.get('/submissions/researcher');
        setSubmissions(response.data);
        
        // Fetch researcher stats
        try {
          const rankData = await leaderboardService.getMyRank();
          setUserStats({
            totalEarnings: rankData.researcher.totalEarnings,
            successRate: rankData.researcher.successRate,
            successfulSubmissions: rankData.researcher.successfulSubmissions,
            totalSubmissions: rankData.researcher.totalSubmissions
          });
        } catch (error) {
          console.error('Error fetching researcher stats:', error);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissionsAndStats();
  }, []);
  
  // Filter submissions based on status
  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.status === filter);
  
  return (
    <ResearcherLayout>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">My Submissions</h1>
        
        {/* Filter Controls */}
        <div className="flex items-center bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden divide-x divide-gray-800">
          <button 
            className={`px-4 py-2 text-sm ${filter === 'all' ? 'text-emerald-400 bg-emerald-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'} transition-colors`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'pending' ? 'text-emerald-400 bg-emerald-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'} transition-colors`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'approved' ? 'text-emerald-400 bg-emerald-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'} transition-colors`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`px-4 py-2 text-sm ${filter === 'rejected' ? 'text-emerald-400 bg-emerald-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'} transition-colors`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>
      
      {/* Researcher Stats Section */}
      {!loading && (
        <div className="mb-8 bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaChartLine className="mr-2 text-emerald-400" /> Your Stats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-emerald-400">${userStats.totalEarnings.toFixed(2)}</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-emerald-400">
                {userStats.successRate ? userStats.successRate.toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Successful Fixes</p>
              <p className="text-2xl font-bold text-emerald-400">{userStats.successfulSubmissions}</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Total Submissions</p>
              <p className="text-2xl font-bold text-emerald-400">{userStats.totalSubmissions}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loader"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-10 text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-gray-500 mb-4" />
          <p className="text-xl text-gray-400 mb-6">You haven't submitted any bug fixes yet.</p>
          <Link to="/dashboard/researcher" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center transition-colors">
            Browse Bug Listings
          </Link>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-8 text-center">
          <FaFilter className="mx-auto text-3xl text-gray-500 mb-3" />
          <p className="text-xl text-gray-400 mb-2">No {filter} submissions found</p>
          <p className="text-gray-500 mb-4">Try changing your filter to see other submissions</p>
          <button 
            onClick={() => setFilter('all')} 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md inline-flex items-center transition-colors"
          >
            Show All Submissions
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSubmissions.map(submission => (
            <SubmissionCard key={submission._id} submission={submission} />
          ))}
        </div>
      )}
    </ResearcherLayout>
  );
};

export default ResearcherSubmissions;