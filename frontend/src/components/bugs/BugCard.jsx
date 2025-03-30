// src/components/bugs/BugCard.jsx
import { FaExclamationTriangle, FaClock, FaCheck, FaHourglass, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BugCard = ({ bug }) => {
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
  
  // Function to get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'open':
        return {
          icon: <FaCheck className="mr-1" />,
          label: 'Open',
          color: 'bg-emerald-600/80'
        };
      case 'in_progress':
        return {
          icon: <FaHourglass className="mr-1" />,
          label: 'In Progress',
          color: 'bg-yellow-600/80'
        };
      case 'closed':
        return {
          icon: <FaLock className="mr-1" />,
          label: 'Closed',
          color: 'bg-gray-600/80'
        };
      default:
        return {
          icon: <FaCheck className="mr-1" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'bg-blue-600/80'
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
    <div className="group bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden hover:border-emerald-700/50 transition-all duration-300 flex flex-col h-full">
      {/* Card header with severity and reward - fixed height */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-2 h-14">
              <Link to={`/dashboard/bugs/${bug._id}`} className="hover:underline">
                {bug.title}
              </Link>
            </h3>
            <div className="flex flex-wrap mt-3 gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${getSeverityColor(bug.severity)}`}>
                {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white flex items-center ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-emerald-900/20 p-3 ml-3 flex flex-col items-center justify-center border border-emerald-800/20 shadow-sm">
            <span className="text-xs text-gray-400">Reward</span>
            <span className="text-xl font-bold text-emerald-400">${bug.reward.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Card body - fixed height */}
      <div className="p-6 flex-grow">
        <p className="text-gray-400 border-l-2 border-emerald-900/50 pl-3 text-sm h-16 line-clamp-3">
          {bug.description}
        </p>
      </div>
      
      {/* Card footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-800 bg-gray-900/50 mt-auto">
        <div className="flex items-center text-gray-500 text-xs">
          <FaClock className="mr-1" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
        
        <Link 
          to={`/dashboard/bugs/${bug._id}`} 
          className="text-xs px-4 py-2 bg-emerald-900/50 hover:bg-emerald-700 text-emerald-300 hover:text-white rounded border border-emerald-800/30 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BugCard;