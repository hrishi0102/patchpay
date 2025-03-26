// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                PatchPay
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to={user.role === 'company' ? '/dashboard/company' : '/dashboard/researcher'} 
                      className="btn btn-outline">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {user ? (
              <>
                <Link 
                  to={user.role === 'company' ? '/dashboard/company' : '/dashboard/researcher'}
                  className="block px-3 py-2 rounded-md text-white font-medium hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-white font-medium hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;