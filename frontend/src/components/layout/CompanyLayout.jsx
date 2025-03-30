// src/components/layout/CompanyLayout.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaKey, FaTrophy, FaBell, FaUserCircle, FaSignOutAlt, FaPlus, FaInbox } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Fetch notification and submission counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      
      try {
        // Fetch unread notifications
        const notificationsResponse = await api.get('/notifications');
        const unreadCount = notificationsResponse.data.filter(n => !n.isRead).length;
        setUnreadNotifications(unreadCount);
        
        // Fetch bugs to check for pending submissions
        const bugsResponse = await api.get('/bugs/company/list');
        const inProgressBugs = bugsResponse.data.filter(bug => bug.status === 'in_progress');
        
        // Count pending submissions
        let pendingCount = 0;
        for (const bug of inProgressBugs) {
          try {
            const submissionsResponse = await api.get(`/submissions/bug/${bug._id}`);
            pendingCount += submissionsResponse.data.filter(
              submission => submission.status === 'pending'
            ).length;
          } catch (error) {
            console.error(`Error fetching submissions for bug ${bug._id}:`, error);
          }
        }
        
        setPendingSubmissions(pendingCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
    
    // Set up refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchCounts, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-emerald-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Company Label */}
            <div className="flex items-center">
              <Link to="/dashboard/company" className="flex items-center">
                <img
                  src="/src/assets/patchpay.png"
                  alt="PatchPay Logo"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-white">PatchPay</span>
              </Link>
              <span className="ml-2 text-xs uppercase tracking-wider text-emerald-500 font-light border-l border-emerald-900/50 pl-2">
                Company
              </span>
            </div>
            
            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Post New Bug Button */}
              <Link 
                to="/dashboard/company/bugs/create" 
                className="mr-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded flex items-center transition-colors"
              >
                <FaPlus className="mr-1" size={12} />
                <span>Post Bug</span>
              </Link>
              
              {/* Pending Submissions Icon */}
              {pendingSubmissions > 0 && (
                <Link
                  to="/dashboard/company"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 relative"
                  title={`${pendingSubmissions} Pending Submission${pendingSubmissions !== 1 ? 's' : ''}`}
                >
                  <FaInbox size={18} />
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs text-black font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {pendingSubmissions > 9 ? '9+' : pendingSubmissions}
                  </span>
                </Link>
              )}
              
              {/* API Key Icon */}
              <Link
                to="/dashboard/company/api-key"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-1"
                title="API Key Management"
              >
                <FaKey size={18} />
              </Link>
              
              {/* Leaderboard Icon */}
              <Link
                to="/dashboard/leaderboard"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-1"
                title="Leaderboard"
              >
                <FaTrophy size={18} />
              </Link>
              
              {/* Notifications Icon */}
              <Link
                to="/dashboard/company/notifications"
                className="text-gray-400 hover:text-emerald-500 transition-colors p-1 relative"
                title="Notifications"
              >
                <FaBell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="text-gray-400 hover:text-emerald-500 transition-colors p-1"
                  title="Profile"
                >
                  <FaUserCircle size={20} />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10 border border-emerald-900/30">
                    <Link
                      to="/dashboard/company/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-emerald-900/20 hover:text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-emerald-900/20 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-black border-t border-emerald-900/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} PatchPay Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyLayout;