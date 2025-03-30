// src/pages/dashboard/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { FaTrophy, FaAward, FaMedal, FaStar, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CompanyLayout from '../../components/layout/CompanyLayout';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import { leaderboardService } from '../../services/leaderboard.service';
import { useAuth } from '../../context/AuthContext';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('earnings');
  const [topEarners, setTopEarners] = useState([]);
  const [topSuccessRates, setTopSuccessRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isCompany = user?.role === 'company';

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch top earners
        const earnersData = await leaderboardService.getTopEarners(20);
        setTopEarners(earnersData);
        
        // Fetch top success rates
        const successRatesData = await leaderboardService.getTopSuccessRates(20);
        setTopSuccessRates(successRatesData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        toast.error('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);
  
  // Function to render medal based on position
  const renderRankMedal = (position) => {
    switch (position) {
      case 0:
        return (
          <div className="p-2 bg-yellow-900/30 rounded-full border border-yellow-800/30">
            <FaTrophy className="text-yellow-400" />
          </div>
        );
      case 1:
        return (
          <div className="p-2 bg-gray-700/50 rounded-full border border-gray-600/50">
            <FaMedal className="text-gray-300" />
          </div>
        );
      case 2:
        return (
          <div className="p-2 bg-amber-900/30 rounded-full border border-amber-800/30">
            <FaMedal className="text-amber-500" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 font-medium text-gray-400">
            {position + 1}
          </div>
        );
    }
  };
  
  // Determine list based on active tab
  const activeList = activeTab === 'earnings' ? topEarners : topSuccessRates;
  
  // Leaderboard content - shared between both layouts
  const leaderboardContent = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Researcher Leaderboard</h1>
      </div>
      
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`py-3 px-6 focus:outline-none flex items-center ${
                activeTab === 'earnings'
                  ? 'border-b-2 border-emerald-500 text-white font-medium'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <FaDollarSign className={`mr-2 ${activeTab === 'earnings' ? 'text-emerald-400' : 'text-gray-500'}`} />
              Top Earners
            </button>
            <button
              onClick={() => setActiveTab('success')}
              className={`py-3 px-6 focus:outline-none flex items-center ${
                activeTab === 'success'
                  ? 'border-b-2 border-emerald-500 text-white font-medium'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <FaChartLine className={`mr-2 ${activeTab === 'success' ? 'text-emerald-400' : 'text-gray-500'}`} />
              Highest Success Rate
            </button>
          </div>
        </div>
        
        {/* Stats Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900/10 to-blue-900/10 border-b border-emerald-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Total Researchers</h3>
              <p className="text-2xl font-bold text-white">{activeList.length || '...'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">{activeTab === 'earnings' ? 'Highest Earnings' : 'Best Success Rate'}</h3>
              <p className="text-2xl font-bold text-emerald-400">
                {activeList.length > 0 ? 
                  (activeTab === 'earnings' ? 
                    `$${activeList[0].totalEarnings.toFixed(2)}` : 
                    `${activeList[0].successRate.toFixed(1)}%`) : 
                  '...'}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Average {activeTab === 'earnings' ? 'Earnings' : 'Success Rate'}</h3>
              <p className="text-2xl font-bold text-white">
                {activeList.length > 0 ? 
                  (activeTab === 'earnings' ? 
                    `$${(activeList.reduce((acc, cur) => acc + cur.totalEarnings, 0) / activeList.length).toFixed(2)}` : 
                    `${(activeList.reduce((acc, cur) => acc + cur.successRate, 0) / activeList.length).toFixed(1)}%`) : 
                  '...'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : activeList.length === 0 ? (
            <div className="text-center py-10 bg-black/20 rounded-lg border border-gray-800">
              <FaStar className="mx-auto text-3xl text-gray-500 mb-3" />
              <p className="text-xl text-gray-400 mb-2">No data available yet</p>
              <p className="text-gray-500">Researchers will appear here once they submit bug fixes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 pl-4">Rank</th>
                    <th className="pb-3">Researcher</th>
                    <th className="pb-3 text-right">{activeTab === 'earnings' ? 'Total Earnings' : 'Success Rate'}</th>
                    <th className="pb-3 text-right">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activeList.map((researcher, index) => (
                    <tr key={researcher._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 pl-4 w-16">
                        {renderRankMedal(index)}
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-white">{researcher.name}</p>
                          <p className="text-xs text-gray-400">
                            {activeTab === 'earnings' ? 
                              `${researcher.successRate.toFixed(1)}% success rate` : 
                              `$${researcher.totalEarnings.toFixed(2)} earned`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-lg font-medium ${index < 3 ? 'text-emerald-400' : 'text-white'}`}>
                          {activeTab === 'earnings' ? 
                            `$${researcher.totalEarnings.toFixed(2)}` : 
                            `${researcher.successRate.toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-sm">
                          {researcher.successfulSubmissions} / {researcher.totalSubmissions}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
  
  // Render with the appropriate layout based on user role
  return isCompany ? (
    <CompanyLayout>{leaderboardContent}</CompanyLayout>
  ) : (
    <ResearcherLayout>{leaderboardContent}</ResearcherLayout>
  );
};

export default Leaderboard;