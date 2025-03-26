// src/pages/dashboard/Notifications.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBell, FaCircle } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { notificationService } from '../../services/notification.service';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
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
        return <FaBell className="text-blue-500" />;
      case 'submission_received':
        return <FaBell className="text-yellow-500" />;
      case 'submission_approved':
        return <FaBell className="text-green-500" />;
      case 'submission_rejected':
        return <FaBell className="text-red-500" />;
      case 'payment_sent':
        return <FaBell className="text-primary" />;
      case 'payment_received':
        return <FaBell className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
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
  
  return (
    <DashboardLayout userRole={user?.role}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-12">
          <FaBell className="mx-auto text-4xl text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="card">
          <ul className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <li 
                key={notification._id} 
                className={`py-4 flex items-start ${notification.isRead ? 'opacity-70' : ''}`}
              >
                <div className="mr-4 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center">
                      {!notification.isRead && (
                        <FaCircle className="text-primary mr-2 text-xs" />
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;