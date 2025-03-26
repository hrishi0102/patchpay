// src/pages/dashboard/BugListings.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaFilter } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BugCard from '../../components/bugs/BugCard';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BugListings = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'open', severity: '' });
  const { user } = useAuth();
  const isCompany = user?.role === 'company';
  
  // Fetch bugs based on user role and filters
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        setLoading(true);
        let response;
        
        // For companies, fetch only their bugs
        if (isCompany) {
          response = await api.get('/bugs/company/list');
        } else {
          // For researchers, use the filters API
          const params = new URLSearchParams();
          
          // Only add status if it's not empty
          if (filter.status) {
            params.append('status', filter.status);
          }
          
          if (filter.severity) {
            params.append('severity', filter.severity);
          }
          
          // Always use the filters endpoint
          response = await api.get(`/bugs/filters${params.toString() ? `?${params.toString()}` : ''}`);
        }
        
        setBugs(response.data);
      } catch (error) {
        console.error('Error fetching bugs:', error);
        toast.error('Failed to fetch bug listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, [filter, isCompany]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <DashboardLayout userRole={user?.role}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          {isCompany ? 'My Bug Listings' : 'Available Bug Bounties'}
        </h1>
        
        {isCompany && (
          <Link to="/dashboard/company/bugs/create" className="btn btn-primary">
            <FaPlus className="mr-2" /> Post New Bug
          </Link>
        )}
      </div>
      
      {/* Filters - only show for researchers */}
      {!isCompany && (
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="input bg-gray-700"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
              <select
                name="severity"
                value={filter.severity}
                onChange={handleFilterChange}
                className="input bg-gray-700"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Bug listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading bug listings...</p>
        </div>
      ) : bugs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-400">No bug listings found.</p>
          {isCompany && (
            <Link to="/dashboard/company/bugs/create" className="btn btn-primary mt-4 inline-block">
              Post Your First Bug
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default BugListings;