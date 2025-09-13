import { useState, useEffect } from 'react';
import { Search, TrendingUp, Award, Sparkles, Filter, ChevronRight } from 'lucide-react';
import GameCard from '../components/GameCard';

const GameLobby = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [games, setGames] = useState({
    recommended: [],
    top: [],
    new: []
  });

  useEffect(() => {
    const mockGames = {
      recommended: [
        { id: 1, title: 'Cyber Warriors', description: 'Epic cyberpunk battle royale with stunning graphics and intense gameplay mechanics', playerCount: 15234, totalPlayTime: '125k h', rating: 4.8, price: 0.5, discount: 20 },
        { id: 2, title: 'Space Odyssey', description: 'Explore infinite galaxies in this immersive space simulation adventure', playerCount: 8923, totalPlayTime: '89k h', rating: 4.6, price: 0.8 },
        { id: 3, title: 'Fantasy Quest', description: 'Medieval RPG adventure with magical creatures and epic storylines', playerCount: 12456, totalPlayTime: '156k h', rating: 4.9, price: 0 },
        { id: 4, title: 'Racing Thunder', description: 'High-speed racing with blockchain rewards and competitive multiplayer', playerCount: 6789, totalPlayTime: '67k h', rating: 4.4, price: 0.3 },
      ],
      top: [
        { id: 5, title: 'Battle Arena', description: 'Competitive 5v5 MOBA with unique heroes and strategic gameplay', playerCount: 25678, totalPlayTime: '289k h', rating: 4.7, price: 0 },
        { id: 6, title: 'Puzzle Master', description: 'Mind-bending puzzles that challenge your intellect and creativity', playerCount: 9876, totalPlayTime: '45k h', rating: 4.5, price: 0.2 },
        { id: 7, title: 'Zombie Survival', description: 'Survive the apocalypse in this intense shooter with cooperative gameplay', playerCount: 18234, totalPlayTime: '198k h', rating: 4.6, price: 0.4, discount: 15 },
        { id: 8, title: 'City Builder', description: 'Create and manage your dream metropolis with advanced city planning', playerCount: 7654, totalPlayTime: '87k h', rating: 4.3, price: 0.6 },
      ],
      new: [
        { id: 9, title: 'Neon Nights', description: 'Stylish action game set in neon-lit cyberpunk streets', playerCount: 3456, totalPlayTime: '12k h', rating: 4.4, price: 0.7, discount: 30 },
        { id: 10, title: 'Ocean Explorer', description: 'Dive deep into mysterious underwater worlds and discover ancient secrets', playerCount: 2345, totalPlayTime: '8k h', rating: 4.2, price: 0.5 },
        { id: 11, title: 'Sky Pirates', description: 'Aerial combat with customizable airships and treasure hunting', playerCount: 4567, totalPlayTime: '15k h', rating: 4.6, price: 0.9 },
        { id: 12, title: 'Dungeon Crawler', description: 'Procedurally generated dungeons with epic loot and challenging bosses', playerCount: 5678, totalPlayTime: '23k h', rating: 4.5, price: 0.4 },
      ]
    };
    setGames(mockGames);
  }, []);

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'strategy', name: 'Strategy' },
    { id: 'simulation', name: 'Simulation' },
    { id: 'rpg', name: 'RPG' },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-16 shadow-2xl shadow-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            Welcome to GameChanger
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            🎮 Discover amazing blockchain games with our innovative pay-per-minute model
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search for your next adventure..."
              className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-md rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 placeholder-gray-500 shadow-xl font-medium text-gray-800 hover:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-4 rounded-3xl font-medium transition-all duration-200 whitespace-nowrap shadow-lg backdrop-blur-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90 border border-white/20 shadow-black/5 hover:shadow-xl hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Featured & Recommended</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {games.recommended.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Top Games</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {games.top.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">New & Trending</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {games.new.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameLobby;