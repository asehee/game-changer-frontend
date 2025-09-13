import { Link } from 'react-router-dom';
import { Play, Users, Clock, Star } from 'lucide-react';

const GameCard = ({ game }) => {
  return (
    <Link 
      to={`/game/${game.id}`}
      className="group block bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 shadow-lg shadow-black/5 hover:-translate-y-2 hover:scale-105 border border-white/20 hover:bg-white/90"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.thumbnail || `https://picsum.photos/seed/${game.id}/400/225`} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-black/20">
              <Play className="w-5 h-5" />
              Play Now
            </button>
          </div>
        </div>
        {game.discount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg shadow-red-500/25 backdrop-blur-sm">
            -{game.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
          {game.title}
        </h3>
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-gray-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl">
              <Users className="w-3 h-3" />
              {game.playerCount || 0}
            </span>
            <span className="flex items-center gap-1 bg-gray-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl">
              <Clock className="w-3 h-3" />
              {game.totalPlayTime || '0h'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-yellow-700 font-medium">{game.rating || '4.5'}</span>
          </div>
        </div>
        
        {game.price !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
            <div className="flex items-center gap-2">
              {game.price === 0 ? (
                <span className="text-green-600 font-bold text-lg tracking-tight">Free</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-blue-600 font-bold text-lg tracking-tight">${game.price}/hr</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Pay per minute
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;