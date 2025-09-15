import { useState, useEffect } from 'react';
import { User, Wallet, Clock, Play, XCircle, Calendar, TrendingUp, Award, ArrowLeft, Copy, Check } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from '../hooks/useTranslation';

const MyPage = () => {
  const [copied, setCopied] = useState(false);
  const { user, walletAddress, isLoggedIn, nickname, loading, disconnectWallet } = useUser();
  const { t } = useTranslation();

  // 로그인하지 않은 경우 홈페이지로 리디렉션
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      window.location.href = '/';
    }
  }, [loading, isLoggedIn]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    window.location.href = '/';
  };

  if (loading || !isLoggedIn) {
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
    <div className="min-h-screen relative">
      {/* Glassmorphism Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/bg.png')`,
        }}
      />
      <div className="bg-black/30 fixed inset-0" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-white/80 hover:text-white hover:scale-105 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToHome')}
          </button>
          
          <button
            onClick={handleDisconnect}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 px-6 py-2 rounded-2xl transition-all duration-200 font-medium hover:scale-105 backdrop-blur-xl"
          >
            {t('disconnectWallet')}
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-16 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 p-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{t('myPage')}</h1>
                  <p className="text-xl text-white/80 mb-4 leading-relaxed">{t('gameExploreAndNFT')}</p>
                  <div className="flex items-center gap-2 text-white/80 mb-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-mono text-lg">{walletAddress.slice(0, 20)}...</span>
                    <button
                      onClick={handleCopyAddress}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('joinDate')}: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('userId')}: {user.id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-xl border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">0 hours</div>
                  <div className="text-sm text-white/80">{t('totalPlayTime')}</div>
                </div>
                <div className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-xl border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">0</div>
                  <div className="text-sm text-white/80">{t('playedGames')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-blue-400/30">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('userInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-white/60">{t('userId')}</span>
                <p className="font-mono text-lg text-white mt-1">{user?.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-white/60">{t('joinDate')}</span>
                <p className="text-white mt-1">{new Date(user?.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-green-400/30">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('walletInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-white/60">{t('walletAddress')}</span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-sm text-white truncate">
                    {walletAddress}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-purple-400/30">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('gameStats')}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-white/60">{t('playedGames')}</span>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div>
                <span className="text-sm font-medium text-white/60">{t('earnedNFTs')}</span>
                <p className="text-3xl font-bold text-white mt-1">0</p>
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
              <h2 className="text-3xl font-bold text-white tracking-tight">{t('recentGames')}</h2>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 text-center shadow-xl border border-white/20 h-64 flex flex-col justify-center">
              <p className="text-white/60 mb-6 text-lg">{t('noGamesPlayed')}</p>
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
              <h2 className="text-3xl font-bold text-white tracking-tight">{t('ownedNFTs')}</h2>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 text-center shadow-xl border border-white/20 h-64 flex flex-col justify-center">
              <p className="text-white/60 mb-2 text-lg">{t('noNFTs')}</p>
              <p className="text-sm text-white/40">
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
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('achievements')}</h2>
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
                className={`backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 transition-transform duration-200 hover:scale-105 ${
                  achievement.unlocked ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20 bg-white/10 opacity-70'
                }`}
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 mx-auto ${
                  achievement.unlocked ? 'bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/25' : 'bg-white/10 backdrop-blur-xl border border-white/20'
                }`}>
                  <Award className={`w-8 h-8 ${achievement.unlocked ? 'text-white' : 'text-white/40'}`} />
                </div>
                <h3 className="text-white font-bold mb-2 text-center">{t(achievement.nameKey)}</h3>
                <p className="text-sm text-white/60 text-center">{t(achievement.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPage;