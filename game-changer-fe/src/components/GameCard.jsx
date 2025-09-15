import { Link } from 'react-router-dom';
import { Play, Users, Clock, Star } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const GameCard = ({ game }) => {
  const { t } = useTranslation();
  return (
    <Link 
      to={`/game/${game.id}`}
      className="group block backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 shadow-lg hover:-translate-y-2 hover:scale-105 border border-white/20 hover:bg-white/20"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.thumbnail || `https://picsum.photos/seed/${game.id}/400/225`} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full backdrop-blur-xl bg-black/60 border border-white/20 hover:bg-black/70 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-black/50">
              <Play className="w-5 h-5" />
              {t('playNow')}
            </button>
          </div>
        </div>
        {game.discount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg shadow-red-500/25 backdrop-blur-sm">
            -{game.discount}% {t('off')}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-white mb-3 group-hover:text-blue-400 transition-colors duration-200">
          {game.title}
        </h3>
        <p className="text-white/60 text-sm mb-5 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-white/40 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 backdrop-blur-xl bg-white/20 px-3 py-1.5 rounded-xl">
              <Users className="w-3 h-3" />
              {game.playerCount || 0}
            </span>
            <span className="flex items-center gap-1 backdrop-blur-xl bg-white/20 px-3 py-1.5 rounded-xl">
              <Clock className="w-3 h-3" />
              {game.totalPlayTime || '0h'}
            </span>
          </div>
          <div className="flex items-center gap-1 backdrop-blur-xl bg-yellow-500/20 px-3 py-1.5 rounded-xl">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-yellow-300 font-medium">{game.rating || '4.5'}</span>
          </div>
        </div>
        
        {game.price !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex items-center gap-2">
              {game.price === 0 ? (
                <span className="text-green-400 font-bold text-lg tracking-tight">{t('freeToPlay')}</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-blue-400 font-bold text-lg tracking-tight">${game.price}{t('perHour')}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-white/40 font-medium">
              {t('payPerSecond')}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;