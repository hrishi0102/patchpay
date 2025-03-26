// src/components/layout/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBug, FaUser, FaBell, FaCog, FaSignOutAlt, FaClipboardCheck, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notification.service';

const DashboardLayout = ({ userRole, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  useEffect(() => {
    // Fetch notification count on initial load
    const fetchNotifications = async () => {
      try {
        const notifications = await notificationService.getNotifications();
        const unread = notifications.filter(notif => !notif.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isCompany = userRole === 'company';
  
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full overflow-y-auto">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Bug Bounty</h2>
        </div>
        <nav className="mt-5">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                to={`/dashboard/${userRole}`}
                className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaUser className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to={`/dashboard/${userRole}/bugs`}
                className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaBug className="mr-3" />
                {isCompany ? 'My Bugs' : 'Bug Listings'}
              </Link>
            </li>
            {isCompany ? (
              <li>
                <Link 
                  to="/dashboard/company/api-key"
                  className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FaCog className="mr-3" />
                  API Key Management
                </Link>
              </li>
            ) : (
              <li>
                <Link 
                  to="/dashboard/researcher/submissions"
                  className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FaClipboardCheck className="mr-3" />
                  My Submissions
                </Link>
              </li>
            )}
            <li>
              <Link 
                to={`/dashboard/${userRole}/notifications`}
                className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaBell className="mr-3" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to={`/dashboard/${userRole}/profile`}
                className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaUserCircle className="mr-3" />
                My Profile
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors text-left"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        <header className="bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {isCompany ? 'Company Dashboard' : 'Researcher Dashboard'}
            </h1>
            <div className="flex items-center">
              <Link 
                to={`/dashboard/${userRole}/notifications`}
                className="relative p-2 rounded-full hover:bg-gray-700 mr-4"
              >
                <FaBell className="text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="text-gray-300 hidden md:inline-block">{user?.name}</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
                    <Link 
                      to={`/dashboard/${userRole}/profile`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaUserCircle className="inline mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;