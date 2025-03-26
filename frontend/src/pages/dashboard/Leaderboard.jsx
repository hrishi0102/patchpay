// src/pages/dashboard/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { FaTrophy, FaAward, FaMedal } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { leaderboardService } from '../../services/leaderboard.service';
import { useAuth } from '../../context/AuthContext';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('earnings');
  const [topEarners, setTopEarners] = useState([]);
  const [topSuccessRates, setTopSuccessRates] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isResearcher = user?.role === 'researcher';

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
        
        // Fetch personal rank if user is a researcher
        if (isResearcher) {
          try {
            const rankData = await leaderboardService.getMyRank();
            setMyRank(rankData);
          } catch (error) {
            console.error('Error fetching personal rank:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        toast.error('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [isResearcher]);
  
  // Function to render medal based on position
  const renderRankMedal = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy className="text-yellow-500" />;
      case 1:
        return <FaMedal className="text-gray-400" />;
      case 2:
        return <FaMedal className="text-amber-600" />;
      default:
        return <span className="font-medium">{position + 1}</span>;
    }
  };
  
  // Determine list based on active tab
  const activeList = activeTab === 'earnings' ? topEarners : topSuccessRates;
  
  return (
    <DashboardLayout userRole={user?.role}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Researcher Leaderboard</h1>
      </div>
      
      {/* Personal Stats Section - Only for researchers */}
      {isResearcher && myRank && (
        <div className="card mb-6 bg-gradient-to-r from-gray-800 to-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-primary">${myRank.researcher.totalEarnings.toFixed(2)}</p>
              <p className="text-sm mt-2 text-gray-400">
                Rank #{myRank.ranks.byEarnings}
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-primary">
                {myRank.researcher.successRate ? myRank.researcher.successRate.toFixed(1) + '%' : 'N/A'}
              </p>
              <p className="text-sm mt-2 text-gray-400">
                {myRank.ranks.bySuccessRate ? `Rank #${myRank.ranks.bySuccessRate}` : 'Need 3+ submissions'}
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Submissions</p>
              <p className="text-2xl font-bold text-primary">
                {myRank.researcher.successfulSubmissions} / {myRank.researcher.totalSubmissions}
              </p>
              <p className="text-sm mt-2 text-gray-400">Successful / Total</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="card mb-6">
        <div className="border-b border-gray-700 mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`py-3 px-6 focus:outline-none ${
                activeTab === 'earnings'
                  ? 'border-b-2 border-primary text-white font-medium'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Top Earners
            </button>
            <button
              onClick={() => setActiveTab('success')}
              className={`py-3 px-6 focus:outline-none ${
                activeTab === 'success'
                  ? 'border-b-2 border-primary text-white font-medium'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Highest Success Rate
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard data...</p>
          </div>
        ) : activeList.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 pl-4">#</th>
                  <th className="pb-3">Researcher</th>
                  <th className="pb-3">{activeTab === 'earnings' ? 'Total Earnings' : 'Success Rate'}</th>
                  <th className="pb-3">Submissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {activeList.map((researcher, index) => (
                  <tr key={researcher._id} className={`hover:bg-gray-800/50 ${
                    isResearcher && researcher._id === user._id ? 'bg-primary/10 border-l-2 border-primary' : ''
                  }`}>
                    <td className="py-3 pl-4 flex justify-center items-center">
                      {renderRankMedal(index)}
                    </td>
                    <td className="py-3 font-medium text-white">{researcher.name}</td>
                    <td className="py-3 text-primary font-medium">
                      {activeTab === 'earnings' 
                        ? `$${researcher.totalEarnings.toFixed(2)}` 
                        : `${researcher.successRate.toFixed(1)}%`}
                    </td>
                    <td className="py-3">
                      {researcher.successfulSubmissions} / {researcher.totalSubmissions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;