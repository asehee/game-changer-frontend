import { useState, useEffect } from 'react';
import { User, Wallet, Clock, Play, XCircle, Calendar, TrendingUp, Award } from 'lucide-react';

const MyPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeGames, setActiveGames] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const mockProfile = {
      nickname: 'CyberHunter',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEA1',
      totalPlayTime: '1,234 hours',
      gamesPlayed: 45,
      joinDate: '2024-01-15'
    };

    const mockActiveGames = [
      { id: 1, title: 'Cyber Warriors', startTime: '2 hours ago', currentCost: '$2.45' },
      { id: 2, title: 'Space Odyssey', startTime: '15 minutes ago', currentCost: '$0.32' },
    ];

    const mockHistory = [
      { id: 1, title: 'Fantasy Quest', totalTime: '124h 30m', lastPlayed: '2 days ago', totalSpent: '$45.20' },
      { id: 2, title: 'Racing Thunder', totalTime: '89h 15m', lastPlayed: '1 week ago', totalSpent: '$28.50' },
      { id: 3, title: 'Battle Arena', totalTime: '234h 45m', lastPlayed: '2 weeks ago', totalSpent: '$0.00' },
      { id: 4, title: 'Puzzle Master', totalTime: '45h 20m', lastPlayed: '1 month ago', totalSpent: '$12.30' },
      { id: 5, title: 'Zombie Survival', totalTime: '167h 10m', lastPlayed: '1 month ago', totalSpent: '$67.80' },
    ];

    setUserProfile(mockProfile);
    setActiveGames(mockActiveGames);
    setGameHistory(mockHistory);
  }, []);

  const handleForceEnd = (gameId) => {
    console.log(`Force ending game ${gameId}`);
    setActiveGames(activeGames.filter(game => game.id !== gameId));
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{userProfile.nickname}</h1>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="font-mono text-sm">{userProfile.walletAddress}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {userProfile.joinDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{userProfile.totalPlayTime}</div>
              <div className="text-sm text-gray-400">Total Play Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{userProfile.gamesPlayed}</div>
              <div className="text-sm text-gray-400">Games Played</div>
            </div>
          </div>
        </div>
      </div>

      {activeGames.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Currently Playing</h2>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <p className="text-sm">You have active game sessions. End them to stop billing.</p>
            </div>
          </div>
          <div className="space-y-4">
            {activeGames.map(game => (
              <div key={game.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{game.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Started {game.startTime}
                      </span>
                      <span className="text-green-400 font-medium">{game.currentCost}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleForceEnd(game.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Force End
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Game History</h2>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-sm">
                <th className="text-left p-4">Game</th>
                <th className="text-left p-4">Total Time</th>
                <th className="text-left p-4">Last Played</th>
                <th className="text-left p-4">Total Spent</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map(game => (
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
                      <span className="text-white font-medium">{game.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{game.totalTime}</td>
                  <td className="p-4 text-gray-400">{game.lastPlayed}</td>
                  <td className="p-4">
                    <span className={`font-medium ${game.totalSpent === '$0.00' ? 'text-gray-400' : 'text-green-400'}`}>
                      {game.totalSpent}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 transition">
                      Play Again
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Steps', desc: 'Play your first game', unlocked: true },
            { name: 'Time Warrior', desc: 'Play for 100 hours', unlocked: true },
            { name: 'Explorer', desc: 'Try 10 different games', unlocked: true },
            { name: 'Dedicated', desc: 'Play for 1000 hours', unlocked: false },
          ].map((achievement, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-lg p-4 border-2 ${
                achievement.unlocked ? 'border-yellow-500/50' : 'border-gray-700 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                achievement.unlocked ? 'bg-yellow-500/20' : 'bg-gray-700'
              }`}>
                <Award className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-500'}`} />
              </div>
              <h3 className="text-white font-medium mb-1">{achievement.name}</h3>
              <p className="text-xs text-gray-400">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyPage;