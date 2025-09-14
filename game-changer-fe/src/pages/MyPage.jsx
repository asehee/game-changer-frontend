import { useState, useEffect } from 'react';
import { User, Wallet, Clock, Play, XCircle, Calendar, TrendingUp, Award, ArrowLeft, Copy, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const MyPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWallet');
        const userId = localStorage.getItem('userId');
        
        if (!walletAddress || !userId) {
          window.location.href = '/';
          return;
        }

        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          const mockProfile = {
            nickname: user.nickname || 'GameChanger User',
            walletAddress: user.wallet, // 백엔드에서는 wallet 필드 사용
            totalPlayTime: '0 hours',
            gamesPlayed: 0,
            joinDate: new Date(user.createdAt).toLocaleDateString('ko-KR'),
            userId: user.id
          };
          setUserProfile(mockProfile);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        alert(t('error'));
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userProfile.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToHome')}
          </button>
          
          <button
            onClick={handleDisconnect}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-2xl transition-all duration-200 font-medium hover:scale-105 shadow-lg shadow-red-500/10"
          >
            {t('disconnectWallet')}
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-16 shadow-2xl shadow-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{t('myPage')}</h1>
                  <p className="text-xl text-gray-300 mb-4 leading-relaxed">{t('gameExploreAndNFT')}</p>
                  <div className="flex items-center gap-2 text-blue-100 mb-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-mono text-lg">{userProfile.walletAddress.slice(0, 20)}...</span>
                    <button
                      onClick={handleCopyAddress}
                      className="text-blue-100 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-blue-200">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('joinDate')}: {userProfile.joinDate}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('userId')}: {userProfile.userId}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-white mb-2">{userProfile.totalPlayTime}</div>
                  <div className="text-sm text-blue-100">{t('totalPlayTime')}</div>
                </div>
                <div className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-white mb-2">{userProfile.gamesPlayed}</div>
                  <div className="text-sm text-blue-100">{t('playedGames')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('userInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">{t('userId')}</span>
                <p className="font-mono text-lg text-gray-900 mt-1">{userProfile.userId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">{t('joinDate')}</span>
                <p className="text-gray-900 mt-1">{userProfile.joinDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('walletInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">{t('walletAddress')}</span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm text-gray-900 truncate">
                    {userProfile.walletAddress}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('gameStats')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">{t('playedGames')}</span>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userProfile.gamesPlayed}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">{t('earnedNFTs')}</span>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game and NFT Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <section className="h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('recentGames')}</h2>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20 h-64 flex flex-col justify-center">
              <p className="text-gray-600 mb-6 text-lg">{t('noGamesPlayed')}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('exploreGames')}
              </button>
            </div>
          </section>

          <section className="h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('ownedNFTs')}</h2>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20 h-64 flex flex-col justify-center">
              <p className="text-gray-600 mb-2 text-lg">{t('noNFTs')}</p>
              <p className="text-sm text-gray-500">
                {t('playGamesEarnNFTs')}
              </p>
            </div>
          </section>
        </div>

        {/* Achievements Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('achievements')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { nameKey: 'firstSteps', descKey: 'firstGamePlay', unlocked: false },
              { nameKey: 'timeWarrior', descKey: 'play100Hours', unlocked: false },
              { nameKey: 'explorer', descKey: 'play10Games', unlocked: false },
              { nameKey: 'dedicated', descKey: 'play1000Hours', unlocked: false },
            ].map((achievement, index) => (
              <div 
                key={index} 
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-black/5 border-2 transition-transform duration-200 hover:scale-105 ${
                  achievement.unlocked ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 opacity-70'
                }`}
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 mx-auto ${
                  achievement.unlocked ? 'bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/25' : 'bg-gray-100'
                }`}>
                  <Award className={`w-8 h-8 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-gray-900 font-bold mb-2 text-center">{t(achievement.nameKey)}</h3>
                <p className="text-sm text-gray-600 text-center">{t(achievement.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPage;