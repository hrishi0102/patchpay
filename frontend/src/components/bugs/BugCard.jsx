// src/components/bugs/BugCard.jsx
import { FaExclamationTriangle, FaClock, FaTag, FaCheck, FaHourglass, FaLock } from 'react-icons/fa';
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
  
  // Function to get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'open':
        return {
          icon: <FaCheck className="mr-1" />,
          label: 'Open',
          color: 'bg-green-600'
        };
      case 'in_progress':
        return {
          icon: <FaHourglass className="mr-1" />,
          label: 'In Progress',
          color: 'bg-yellow-600'
        };
      case 'closed':
        return {
          icon: <FaLock className="mr-1" />,
          label: 'Closed',
          color: 'bg-gray-600'
        };
      default:
        return {
          icon: <FaCheck className="mr-1" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'bg-blue-600'
        };
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

  const statusInfo = getStatusInfo(bug.status);
  
  return (
    <div className="card hover:border-primary transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-white">
            <Link to={`/dashboard/bugs/${bug._id}`} className="hover:text-primary transition-colors">
              {bug.title}
            </Link>
          </h3>
          <div className="flex flex-wrap mt-2 gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getSeverityColor(bug.severity)}`}>
              {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full text-white flex items-center ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-primary-dark/20 p-3 ml-2 flex flex-col items-center justify-center border border-primary/20 shadow-lg">
          <span className="text-xs text-gray-300">Reward</span>
          <span className="text-xl font-bold text-primary">${bug.reward.toFixed(2)}</span>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3 border-l-2 border-gray-700 pl-3">
        {bug.description}
      </p>
      
      <div className="flex justify-between items-center mt-4 text-sm border-t border-gray-700 pt-4">
        <div className="flex items-center text-gray-400">
          <FaClock className="mr-1" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <FaTag className="mr-1" />
          <span>{bug.companyId?.name || 'Unknown'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link to={`/dashboard/bugs/${bug._id}`} className="btn btn-outline text-sm hover:bg-primary hover:text-white hover:border-primary transition-all">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BugCard;