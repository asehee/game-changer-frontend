import { useState, useEffect } from 'react';
import { Code, DollarSign, Users, TrendingUp, Upload, BarChart3, PieChart, Calendar, Plus } from 'lucide-react';

const DeveloperDashboard = () => {
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [uploadedGames, setUploadedGames] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);

  useEffect(() => {
    const mockProfile = {
      nickname: 'GameMaster Dev',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEA1',
      totalRevenue: '$12,345.67',
      totalGames: 8,
      totalPlayers: '3.2K',
      joinDate: '2023-06-15'
    };

    const mockGames = [
      { 
        id: 1, 
        title: 'Cyber Warriors', 
        status: 'Active',
        players: 1523, 
        totalRevenue: '$4,567.89',
        dailyRevenue: '$123.45',
        rating: 4.8,
        uploadDate: '2024-01-20'
      },
      { 
        id: 2, 
        title: 'Space Odyssey', 
        status: 'Active',
        players: 892, 
        totalRevenue: '$2,345.67',
        dailyRevenue: '$67.89',
        rating: 4.6,
        uploadDate: '2024-02-15'
      },
      { 
        id: 3, 
        title: 'Fantasy Quest', 
        status: 'Active',
        players: 2456, 
        totalRevenue: '$5,432.10',
        dailyRevenue: '$234.56',
        rating: 4.9,
        uploadDate: '2023-12-10'
      },
      { 
        id: 4, 
        title: 'Racing Thunder', 
        status: 'Under Review',
        players: 0, 
        totalRevenue: '$0.00',
        dailyRevenue: '$0.00',
        rating: 0,
        uploadDate: '2024-03-01'
      },
    ];

    const mockRevenue = {
      today: '$456.78',
      thisWeek: '$2,345.67',
      thisMonth: '$8,901.23',
      growth: '+23.5%'
    };

    setDeveloperProfile(mockProfile);
    setUploadedGames(mockGames);
    setRevenueStats(mockRevenue);
  }, []);

  if (!developerProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Code className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{developerProfile.nickname}</h1>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <span className="font-mono text-sm">{developerProfile.walletAddress}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Developer since {developerProfile.joinDate}
                </span>
              </div>
            </div>
          </div>
          
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Upload New Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-400 font-medium">{revenueStats?.growth}</span>
          </div>
          <div className="text-2xl font-bold text-white">{developerProfile.totalRevenue}</div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">{developerProfile.totalGames}</div>
          <div className="text-sm text-gray-400">Published Games</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">{developerProfile.totalPlayers}</div>
          <div className="text-sm text-gray-400">Total Players</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-white">{revenueStats?.today}</div>
          <div className="text-sm text-gray-400">Today's Revenue</div>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Revenue Overview</h2>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition">Day</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Week</button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition">Month</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">
              <PieChart className="w-16 h-16 mx-auto mb-4" />
              <p>Revenue chart would be displayed here</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-white">My Published Games</h2>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-sm">
                <th className="text-left p-4">Game</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Players</th>
                <th className="text-left p-4">Total Revenue</th>
                <th className="text-left p-4">Daily Revenue</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedGames.map(game => (
                <tr key={game.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${game.id}/40/40`} 
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{game.title}</div>
                        <div className="text-xs text-gray-400">Uploaded {game.uploadDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {game.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{game.players.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-green-400 font-medium">{game.totalRevenue}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300">{game.dailyRevenue}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-300">{game.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300 transition text-sm">
                        Edit
                      </button>
                      <button className="text-gray-400 hover:text-gray-300 transition text-sm">
                        Stats
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600 hover:border-gray-500 transition cursor-pointer">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Upload a New Game</h3>
            <p className="text-sm text-gray-400 mb-4">Share your creation with the community</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg transition">
              Choose File
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperDashboard;