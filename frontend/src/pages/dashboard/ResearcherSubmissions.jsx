// src/pages/dashboard/ResearcherSubmissions.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBug, FaExclamationTriangle } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ResearcherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/submissions/researcher');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, []);
  
  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600 text-white';
      case 'rejected':
        return 'bg-red-600 text-white';
      case 'pending':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  return (
    <DashboardLayout userRole="researcher">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Submissions</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="card text-center py-12">
          <FaExclamationTriangle className="mx-auto text-4xl text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">You haven't submitted any bug fixes yet.</p>
          <Link to="/dashboard/researcher/bugs" className="btn btn-primary mt-6 inline-block">
            Browse Bug Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map(submission => (
            <div key={submission._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-medium text-white">
                    <Link 
                      to={`/dashboard/bugs/${submission.bugId._id}`} 
                      className="hover:text-primary"
                    >
                      {submission.bugId.title}
                    </Link>
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Submitted on {formatDate(submission.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)}`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Bug Severity</div>
                  <div className="font-medium text-white capitalize">{submission.bugId.severity}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Reward</div>
                  <div className="font-medium text-white">${submission.bugId.reward.toFixed(2)}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">Bug Status</div>
                  <div className="font-medium text-white capitalize">{submission.bugId.status}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-white mb-2">Your Fix Description</h3>
                <div className="bg-gray-800 p-4 rounded border border-gray-700 text-gray-300">
                  {submission.fixDescription}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-700">
                <div>
                  <a 
                    href={submission.proofOfFix} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Proof of Fix
                  </a>
                </div>
                <Link 
                  to={`/dashboard/bugs/${submission.bugId._id}`}
                  className="btn btn-outline"
                >
                  View Bug Details
                </Link>
              </div>
              
              {submission.status === 'rejected' && submission.feedback && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-md">
                  <h4 className="font-medium text-white mb-1">Rejection Feedback:</h4>
                  <p className="text-gray-300">{submission.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResearcherSubmissions;