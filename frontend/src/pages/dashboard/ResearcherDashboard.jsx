// src/pages/dashboard/ResearcherDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import BugCard from '../../components/bugs/BugCard';
import api from '../../services/api';

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bugs, setBugs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({ 
    status: 'open', 
    severity: '',
    search: '' 
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    } else if (user.role !== 'researcher') {
      navigate('/dashboard/company');
      return;
    }

    const fetchBugs = async () => {
      try {
        setLoading(true);
        // Build query parameters
        const params = new URLSearchParams();
        
        if (filter.status) {
          params.append('status', filter.status);
        }
        
        if (filter.severity) {
          params.append('severity', filter.severity);
        }
        
        const response = await api.get(`/bugs/filters${params.toString() ? `?${params.toString()}` : ''}`);
        setBugs(response.data);
      } catch (error) {
        console.error('Error fetching bugs:', error);
        toast.error('Failed to load bug listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, [user, navigate, filter]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    toast.success('Search functionality would be implemented here');
  };
  
  // Function to filter bugs based on search term
  const filteredBugs = bugs.filter(bug => 
    filter.search ? 
      bug.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      bug.description.toLowerCase().includes(filter.search.toLowerCase())
    : true
  );
  
  if (!user) return null;
  
  return (
    <ResearcherLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Available Bug Bounties</h1>
          
          {/* Search and filter controls */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <input
                type="text"
                name="search"
                placeholder="Search bugs..."
                className="w-full py-2 pl-10 pr-4 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border ${showFilters ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-400' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}
            >
              <FaFilter />
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                          text-gray-100 focus:outline-none focus:ring-2 
                          focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 bg-black/50 rounded-md border border-gray-700 
                          text-gray-100 focus:outline-none focus:ring-2 
                          focus:ring-emerald-500 focus:border-transparent"
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
      </div>
      
      {/* Bug listings grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loader"></div>
        </div>
      ) : filteredBugs.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-3">No bug listings found</h3>
          <p className="text-gray-400 mb-8">
            {filter.status || filter.severity || filter.search ? 
              'Try adjusting your filters to see more results' : 
              'Check back soon for new bug bounties'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </ResearcherLayout>
  );
};

export default ResearcherDashboard;