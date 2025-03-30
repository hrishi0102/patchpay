// src/components/submissions/SubmissionCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglass, FaCode, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SubmissionCard = ({ submission }) => {
  const [expanded, setExpanded] = useState(false);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status icon and color
  const getStatusInfo = () => {
    // Make sure submission and status exist before accessing them
    if (!submission || typeof submission.status === 'undefined') {
      // Default fallback if status isn't available
      return {
        icon: <FaHourglass className="text-gray-400" />,
        label: 'Unknown',
        color: 'bg-gray-900/20 border-gray-800/30 text-gray-400'
      };
    }
    
    switch (submission.status) {
      case 'approved':
        return {
          icon: <FaCheckCircle className="text-emerald-400" />,
          label: 'Approved',
          color: 'bg-emerald-900/20 border-emerald-800/30 text-emerald-400'
        };
      case 'rejected':
        return {
          icon: <FaTimesCircle className="text-red-400" />,
          label: 'Rejected',
          color: 'bg-red-900/20 border-red-800/30 text-red-400'
        };
      case 'pending':
      default:
        return {
          icon: <FaHourglass className="text-yellow-400" />,
          label: 'Pending Review',
          color: 'bg-yellow-900/20 border-yellow-800/30 text-yellow-400'
        };
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    // Make sure bugId and severity exist before accessing them
    if (!submission || !submission.bugId || typeof submission.bugId.severity === 'undefined') {
      return 'bg-gray-900/20 border-gray-800/30 text-gray-400';
    }
    
    switch (submission.bugId.severity) {
      case 'low':
        return 'bg-blue-900/20 border-blue-800/30 text-blue-400';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-800/30 text-yellow-400';
      case 'high':
        return 'bg-orange-900/20 border-orange-800/30 text-orange-400';
      case 'critical':
        return 'bg-red-900/20 border-red-800/30 text-red-400';
      default:
        return 'bg-gray-900/20 border-gray-800/30 text-gray-400';
    }
  };
  
  // Check if submission is valid before rendering content
  if (!submission || !submission.bugId) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Unable to display this submission. Data is incomplete.</p>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              to={`/dashboard/bugs/${submission.bugId._id}`}
              className="text-xl font-medium text-white hover:text-emerald-400 transition-colors"
            >
              {submission.bugId.title}
            </Link>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <span>Submitted on {formatDate(submission.createdAt)}</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full border ${statusInfo.color} flex items-center`}>
            {statusInfo.icon}
            <span className="ml-2">{statusInfo.label}</span>
          </div>
        </div>
      </div>
      
      {/* Card Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
        <div className="p-4 text-center">
          <p className="text-sm text-gray-400">Severity</p>
          <div className={`inline-block px-3 py-1 mt-1 rounded-full border ${getSeverityColor(submission.bugId.severity)}`}>
            {typeof submission.bugId.severity === 'string' 
              ? submission.bugId.severity.charAt(0).toUpperCase() + submission.bugId.severity.slice(1) 
              : 'Unknown'}
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-gray-400">Reward</p>
          <p className="text-xl font-medium text-emerald-400">
            ${typeof submission.bugId.reward === 'number' 
              ? submission.bugId.reward.toFixed(2) 
              : '0.00'}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-gray-400">Bug Status</p>
          <p className="text-white capitalize">
            {typeof submission.bugId.status === 'string' 
              ? submission.bugId.status 
              : 'Unknown'}
          </p>
        </div>
      </div>
      
      {/* Card Content */}
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white">Fix Description</h3>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          
          <div className={`bg-black/30 p-4 rounded-lg border border-gray-800 text-gray-300 overflow-hidden transition-all duration-200 ${expanded ? 'max-h-96 overflow-y-auto' : 'max-h-24'}`}>
            <p className={expanded ? '' : 'line-clamp-3'}>
              {submission.fixDescription || 'No description provided.'}
            </p>
          </div>
          
          {!expanded && submission.fixDescription && submission.fixDescription.length > 250 && (
            <button 
              onClick={() => setExpanded(true)}
              className="text-sm text-emerald-400 hover:text-emerald-300 mt-2 transition-colors"
            >
              Show more
            </button>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-800 bg-gray-900/50">
        {submission.proofOfFix ? (
          <a 
            href={submission.proofOfFix} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <FaCode className="mr-2" />
            View Proof of Fix
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        ) : (
          <span className="text-gray-500">No proof of fix provided</span>
        )}
        
        <Link 
          to={`/dashboard/bugs/${submission.bugId._id}`}
          className="px-4 py-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 rounded-md border border-emerald-800/30 transition-colors"
        >
          View Bug Details
        </Link>
      </div>
      
      {/* Rejection Feedback */}
      {submission.status === 'rejected' && submission.feedback && (
        <div className="p-6 pt-0">
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
            <h4 className="font-medium text-white mb-1 flex items-center">
              <FaTimesCircle className="text-red-400 mr-2" />
              Rejection Feedback:
            </h4>
            <p className="text-gray-300">{submission.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;