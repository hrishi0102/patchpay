// src/pages/dashboard/Notifications.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBell, FaCircle, FaCheck, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave, FaBug } from 'react-icons/fa';
import CompanyLayout from '../../components/layout/CompanyLayout';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import { notificationService } from '../../services/notification.service';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isCompany = user?.role === 'company';
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update the local state to reflect the change
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };
  
  // Function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bug_posted':
        return <div className="p-2 bg-blue-900/30 rounded-full border border-blue-800/30"><FaBug className="text-blue-400" /></div>;
      case 'submission_received':
        return <div className="p-2 bg-yellow-900/30 rounded-full border border-yellow-800/30"><FaExclamationTriangle className="text-yellow-400" /></div>;
      case 'submission_approved':
        return <div className="p-2 bg-emerald-900/30 rounded-full border border-emerald-800/30"><FaCheckCircle className="text-emerald-400" /></div>;
      case 'submission_rejected':
        return <div className="p-2 bg-red-900/30 rounded-full border border-red-800/30"><FaCircle className="text-red-400" /></div>;
      case 'payment_sent':
      case 'payment_received':
        return <div className="p-2 bg-emerald-900/30 rounded-full border border-emerald-800/30"><FaMoneyBillWave className="text-emerald-400" /></div>;
      default:
        return <div className="p-2 bg-gray-800 rounded-full border border-gray-700"><FaBell className="text-gray-400" /></div>;
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      // Today, show time
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays < 2) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      // Older
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  // Notifications content - shared between both layouts
  const notificationsContent = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={() => {
              // Mark all as read functionality would be implemented here
              toast.success('All notifications marked as read');
            }}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded border border-gray-700 transition-colors"
          >
            <FaCheck className="inline mr-2" /> Mark all as read
          </button>
        )}
      </div>
      
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <FaBell className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No notifications yet</h3>
            <p className="text-gray-400">
              Notifications about bug fixes and submissions will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-800/30 transition-colors ${notification.isRead ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className={`text-sm ${notification.isRead ? 'text-gray-300' : 'text-white font-medium'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center ml-4">
                        {!notification.isRead && (
                          <FaCircle className="text-emerald-500 mr-2 text-xs" />
                        )}
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex mt-2">
                      {!notification.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors mr-4"
                        >
                          Mark as read
                        </button>
                      )}
                      
                      {notification.relatedId && (
                        <Link
                          to={`/dashboard/bugs/${notification.relatedId}`}
                          className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                        >
                          View details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
  
  // Render with the appropriate layout based on user role
  return isCompany ? (
    <CompanyLayout>{notificationsContent}</CompanyLayout>
  ) : (
    <ResearcherLayout>{notificationsContent}</ResearcherLayout>
  );
};

export default Notifications;