// src/components/layout/DashboardLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaBug, FaUser, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ userRole, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isCompany = userRole === 'company';
  
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
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
            {isCompany && (
              <li>
                <Link 
                  to="/dashboard/company/api-key"
                  className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FaCog className="mr-3" />
                  API Key Management
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
              <span className="text-gray-300 mr-4">{user?.name}</span>
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