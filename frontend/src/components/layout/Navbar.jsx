// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoSvg from '../../assets/logo.svg';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Larger logo and brand name */}
          <Link to="/" className="flex items-center space-x-3">
          <img src={logoSvg} alt="PatchPay Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold bg-clip-text text-white">
              PatchPay
            </span>
          </Link>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;