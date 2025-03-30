// src/pages/dashboard/BugDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CompanyLayout from '../../components/layout/CompanyLayout';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const BugDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [userHasSubmitted, setUserHasSubmitted] = useState(false);
  
  const isCompany = user?.role === 'company';
  const isOwner = isCompany && bug?.companyId?._id === user?._id;
  
  // Fetch bug details
  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bugs/${id}`);
        setBug(response.data);
        
        // If this is the company that owns the bug, fetch submissions too
        if (isCompany && response.data.companyId._id === user?._id) {
          setLoadingSubmissions(true);
          try {
            const submissionsResponse = await api.get(`/submissions/bug/${id}`);
            setSubmissions(submissionsResponse.data);
          } catch (error) {
            console.error('Error fetching submissions:', error);
          } finally {
            setLoadingSubmissions(false);
          }
        }
        
        // If this is a researcher, check if they've already submitted
        if (!isCompany) {
          try {
            const researcherSubmissionsResponse = await api.get('/submissions/researcher');
            const hasSubmitted = researcherSubmissionsResponse.data.some(
              submission => submission.bugId._id === id
            );
            setUserHasSubmitted(hasSubmitted);
          } catch (error) {
            console.error('Error checking researcher submissions:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching bug details:', error);
        toast.error('Failed to load bug details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBugDetails();
    }
  }, [id, user, isCompany, navigate]);
  
  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-600/80';
      case 'medium':
        return 'bg-yellow-600/80';
      case 'high':
        return 'bg-orange-600/80';
      case 'critical':
        return 'bg-red-600/80';
      default:
        return 'bg-gray-600/80';
    }
  };

  const handleReviewSubmission = async (submissionId, status) => {
    try {
      const confirmMessage = status === 'approved' 
        ? 'Are you sure you want to approve this submission? This will process payment to the researcher and close the bug.'
        : 'Are you sure you want to reject this submission? This will allow other researchers to continue working on this bug.';
      
      if (!window.confirm(confirmMessage)) {
        return; // User cancelled the action
      }
      
      const response = await api.put(`/submissions/${submissionId}/review`, {
        status,
        feedback: status === 'rejected' ? 'Submission rejected by company.' : 'Submission approved by company.'
      });
      
      // Update the local state to reflect the change
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
          sub._id === submissionId ? { ...sub, status } : sub
        )
      );
      
      // If the submission was approved, also update the bug status
      if (status === 'approved') {
        setBug(prevBug => ({ ...prevBug, status: 'closed' }));
        toast.success('Submission approved and payment processed!');
      } else {
        toast.success('Submission rejected.');
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      toast.error(error.response?.data?.message || 'Failed to review submission. Please try again.');
    }
  };
  
  // Get status message for researchers
  const getBugStatusMessage = () => {
    if (!bug) return null;
    
    if (bug.status === 'closed') {
      return {
        icon: <FaCheckCircle className="text-green-500 mr-2" />,
        message: "This bug has been fixed and is now closed.",
        color: "border-green-600"
      };
    } else if (bug.status === 'in_progress') {
      return {
        icon: <FaExclamationTriangle className="text-yellow-500 mr-2" />,
        message: "This bug is currently being reviewed by the company.",
        color: "border-yellow-600"
      };
    } else {
      return {
        icon: <FaExclamationTriangle className="text-blue-500 mr-2" />,
        message: "This bug is open for submissions.",
        color: "border-blue-600"
      };
    }
  };
  
  if (loading) {
    const loadingContent = (
      <div className="flex justify-center items-center py-20">
        <div className="loader"></div>
      </div>
    );
    
    return isCompany ? (
      <CompanyLayout>{loadingContent}</CompanyLayout>
    ) : (
      <ResearcherLayout>{loadingContent}</ResearcherLayout>
    );
  }
  
  if (!bug) return null;

  const statusInfo = getBugStatusMessage();
  
  // Main content to display - shared between layouts
  const bugDetailContent = (
    <>
      {/* Back button and controls */}
      <div className="flex justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 flex items-center transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        {isOwner && (
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 flex items-center transition-colors">
              <FaEdit className="mr-2" /> Edit Status
            </button>
          </div>
        )}
      </div>
      
      {/* Bug detail card */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-white">{bug.title}</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full text-white ${getSeverityColor(bug.severity)}`}>
              {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 p-3 rounded border border-gray-700">
              <div className="text-sm text-gray-400">Status</div>
              <div className="font-medium text-white capitalize">{bug.status}</div>
            </div>
            <div className="bg-black/30 p-3 rounded border border-gray-700">
              <div className="text-sm text-gray-400">Reward</div>
              <div className="font-medium text-emerald-400">${bug.reward.toFixed(2)}</div>
            </div>
            <div className="bg-black/30 p-3 rounded border border-gray-700">
              <div className="text-sm text-gray-400">Posted</div>
              <div className="font-medium text-white">{formatDate(bug.createdAt)}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white mb-2">Description</h2>
            <div className="bg-black/30 p-4 rounded border border-gray-700 text-gray-300 whitespace-pre-line">
              {bug.description}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-white mb-2">Company</h2>
            <div className="bg-black/30 p-4 rounded border border-gray-700">
              <div className="font-medium text-white">{bug.companyId?.name || 'Unknown'}</div>
              <div className="text-gray-400">{bug.companyId?.email || ''}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Researcher actions */}
      {!isCompany && (
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden p-6">
          <h2 className="text-lg font-medium text-white mb-4">Submission Status</h2>
          
          <div className={`p-4 rounded-md border ${statusInfo.color} bg-gray-800/50 flex items-center mb-6`}>
            {statusInfo.icon}
            <span className="text-gray-200">{statusInfo.message}</span>
          </div>
          
          {userHasSubmitted ? (
            <div className="bg-black/30 p-4 rounded-md border border-gray-700">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p className="text-white">You have already submitted a fix for this bug.</p>
              </div>
              <Link 
                to="/dashboard/researcher/submissions"
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-white inline-flex items-center transition-colors"
              >
                View My Submissions
              </Link>
            </div>
          ) : bug.status === 'open' ? (
            <div>
              <p className="text-gray-300 mb-4">
                If you have a solution for this bug, you can submit a fix and potentially earn the reward.
              </p>
              <Link 
                to={`/dashboard/researcher/submissions/create?bugId=${bug._id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md inline-flex items-center transition-colors"
              >
                Submit Fix
              </Link>
            </div>
          ) : (
            <div className="bg-black/30 p-4 rounded-md border border-gray-700">
              <div className="flex items-center">
                <FaTimesCircle className="text-red-500 mr-2" />
                <p className="text-white">This bug is no longer accepting submissions.</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Company submissions view */}
      {isOwner && (
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Submissions</h2>
            
            {loadingSubmissions ? (
              <div className="flex justify-center py-8">
                <div className="loader"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-black/30 p-8 rounded border border-gray-700 text-center">
                <FaExclamationTriangle className="mx-auto text-2xl text-gray-500 mb-3" />
                <p className="text-gray-400">No submissions received yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map(submission => (
                  <div key={submission._id} className="bg-black/30 p-5 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">
                          Submitted by {submission.researcherId?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {formatDate(submission.createdAt)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        submission.status === 'approved' ? 'bg-emerald-600/80 text-white' : 
                        submission.status === 'rejected' ? 'bg-red-600/80 text-white' : 
                        'bg-yellow-600/80 text-white'
                      }`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-300">Fix Description</h3>
                      <p className="mt-1 text-gray-300 bg-black/20 p-3 rounded-md border border-gray-800">
                        {submission.fixDescription}
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-300">Proof of Fix</h3>
                      <a 
                        href={submission.proofOfFix} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline mt-1 inline-block"
                      >
                        View Proof
                      </a>
                    </div>
                    
                    {submission.status === 'pending' && (
                      <div className="mt-5 pt-4 border-t border-gray-700 flex justify-end space-x-3">
                        <button 
                          className="px-3 py-1.5 border border-red-700/50 bg-red-900/20 text-red-400 hover:bg-red-800/30 text-sm rounded-md transition-colors"
                          onClick={() => handleReviewSubmission(submission._id, 'rejected')}
                        >
                          <FaTimesCircle className="inline mr-1" /> Reject
                        </button>
                        <button 
                          className="px-3 py-1.5 border border-emerald-700/50 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800/30 text-sm rounded-md transition-colors"
                          onClick={() => handleReviewSubmission(submission._id, 'approved')}
                        >
                          <FaCheckCircle className="inline mr-1" /> Approve & Pay
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
  
  // Render with the appropriate layout based on user role
  return isCompany ? (
    <CompanyLayout>{bugDetailContent}</CompanyLayout>
  ) : (
    <ResearcherLayout>{bugDetailContent}</ResearcherLayout>
  );
};

export default BugDetail;