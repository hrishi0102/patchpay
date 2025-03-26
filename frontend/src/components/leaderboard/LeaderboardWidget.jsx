// src/components/leaderboard/LeaderboardWidget.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { leaderboardService } from '../../services/leaderboard.service';

const LeaderboardWidget = () => {
  const [topResearchers, setTopResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTopResearchers = async () => {
      try {
        setLoading(true);
        const data = await leaderboardService.getTopEarners(5);
        setTopResearchers(data);
      } catch (error) {
        console.error('Error fetching top researchers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopResearchers();
  }, []);
  
  // Function to render medal based on position
  const renderRankMedal = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy className="text-yellow-500 mr-2" />;
      case 1:
        return <FaMedal className="text-gray-400 mr-2" />;
      case 2:
        return <FaMedal className="text-amber-600 mr-2" />;
      default:
        return <span className="font-medium mr-2">{position + 1}.</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-medium text-white mb-4">Top Researchers</h3>
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card p-4">
      <h3 className="text-lg font-medium text-white mb-4">Top Researchers</h3>
      
      {topResearchers.length === 0 ? (
        <p className="text-gray-400 text-center py-2">No data available yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {topResearchers.map((researcher, index) => (
              <li key={researcher._id} className="flex items-center">
                {renderRankMedal(index)}
                <span className="text-white">{researcher.name}</span>
                <span className="ml-auto text-primary font-medium">
                  ${researcher.totalEarnings.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 text-center">
            <Link 
              to="/dashboard/leaderboard" 
              className="text-primary hover:underline text-sm"
            >
              View Full Leaderboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardWidget;