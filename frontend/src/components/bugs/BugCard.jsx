// src/components/bugs/BugCard.jsx
import { FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BugCard = ({ bug }) => {
  // Function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'high':
        return 'bg-orange-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="card hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">
          <Link to={`/dashboard/bugs/${bug._id}`} className="hover:text-primary">
            {bug.title}
          </Link>
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getSeverityColor(bug.severity)}`}>
          {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3">
        {bug.description}
      </p>
      
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center text-gray-400">
          <FaClock className="mr-1" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary font-medium">${bug.reward.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Posted by: <span className="text-gray-300">{bug.companyId?.name || 'Unknown'}</span>
        </div>
        <Link to={`/dashboard/bugs/${bug._id}`} className="btn btn-outline text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BugCard;