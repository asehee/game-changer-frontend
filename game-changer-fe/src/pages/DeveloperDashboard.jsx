import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useUser } from '../contexts/UserContext';
import { useDeveloperDashboard } from '../hooks/useDeveloperData';
import DeveloperApiService from '../services/developerApi';
import { 
  TrendingUp, 
  Upload, 
  Users, 
  User,
  DollarSign, 
  GamepadIcon, 
  Clock, 
  Star, 
  ArrowLeft,
  Copy,
  Check,
  BarChart3,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DeveloperDashboard = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activatingDeveloper, setActivatingDeveloper] = useState(false);
  const { user, walletAddress, isLoggedIn, isDeveloper, loading, activateDeveloper, refreshUser } = useUser();
  
  const { data: dashboardData, loading: dashboardLoading, error, refetch } = useDeveloperDashboard(walletAddress);

  // 로그인하지 않은 경우 홈페이지로 리디렉션
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      window.location.href = '/';
    }
  }, [loading, isLoggedIn]);

  const handleActivateDeveloper = async () => {
    const confirmed = window.confirm('개발자로 등록하시겠습니까?\n게임을 업로드하고 수익을 관리할 수 있습니다.');
    
    if (!confirmed) return;
    
    try {
      setActivatingDeveloper(true);
      await activateDeveloper();
      
      // 대시보드 데이터도 새로고침
      refetch();
      
      alert('개발자로 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('개발자 활성화 실패:', error);
      alert(`개발자 등록에 실패했습니다: ${error.message}`);
    } finally {
      setActivatingDeveloper(false);
    }
  };

  const startUploading = async () => {
    try {
      const response = await fetch(`http://localhost:3000/developers/start-uploading?wallet=${walletAddress}`);
      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('게임 업로드 시작 실패:', err);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6
    }).format(amount);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">
          {t('loading')}
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return null; // useEffect에서 리디렉션 처리
  }

  // isDeveloper가 false인 경우 개발자 활성화 제안
  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                개발자가 되어보세요
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                당신의 창작물을 세상과 공유하고 수익을 창출해보세요
              </p>
            </div>

            {/* Activation Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center shadow-xl shadow-black/5 border border-white/20 mb-8">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <GamepadIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">개발자로 시작하세요</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  개발자로 등록하시면 게임을 업로드하고<br />
                  수익 관리와 분석 도구를 이용할 수 있습니다
                </p>
              </div>

              <button
                onClick={handleActivateDeveloper}
                disabled={activatingDeveloper}
                className={`inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 ${
                  activatingDeveloper ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-5 h-5" />
                {activatingDeveloper ? '등록 중...' : '개발자로 등록하기'}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">수익 창출</h4>
                <p className="text-sm text-gray-600">시간당 과금으로 안정적인 수익 구조</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">상세 분석</h4>
                <p className="text-sm text-gray-600">플레이어 통계와 수익 분석 도구</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">글로벌 유저</h4>
                <p className="text-sm text-gray-600">전 세계 플레이어들과 연결</p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                게임 개발자가 되어보세요
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                당신의 창작물을 세상과 공유하고 수익을 창출해보세요
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center shadow-xl shadow-black/5 border border-white/20 mb-8">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <GamepadIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">첫 게임을 업로드하세요</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  게임을 업로드하면 자동으로 개발자로 등록되고<br />
                  수익 관리와 분석 도구를 이용할 수 있습니다
                </p>
              </div>

              <button
                onClick={startUploading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                게임 업로드하기
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">수익 창출</h4>
                <p className="text-sm text-gray-600">시간당 과금으로 안정적인 수익 구조</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">상세 분석</h4>
                <p className="text-sm text-gray-600">플레이어 통계와 수익 분석 도구</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-black/5 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">글로벌 유저</h4>
                <p className="text-sm text-gray-600">전 세계 플레이어들과 연결</p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-10">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl shadow-blue-500/25">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              개발자 대시보드
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              게임 수익과 플레이어 통계를 한눈에 확인하세요
            </p>

            {/* Wallet Info */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-lg shadow-black/5 border border-white/20">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/25">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(dashboardData?.overview?.totalRevenue || 0)}
              </h3>
              <p className="text-gray-600 font-medium">총 수익</p>
              <div className="text-sm text-green-600 font-medium mt-2">
                오늘: {formatCurrency(dashboardData?.overview?.todayRevenue || 0)}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <GamepadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {dashboardData?.overview?.totalGames || 0}
              </h3>
              <p className="text-gray-600 font-medium">게임 수</p>
              <div className="text-sm text-blue-600 font-medium mt-2">
                활성: {dashboardData?.overview?.activeGames || 0}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {(dashboardData?.overview?.totalPlayers || 0).toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">총 플레이어</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(dashboardData?.overview?.totalPlayTime || 0)}
              </h3>
              <p className="text-gray-600 font-medium">총 플레이 시간</p>
            </div>
          </div>

          {/* Games and Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* My Games */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/20 h-96">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <GamepadIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">내 게임</h2>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dashboardData?.games?.length > 0 ? (
                  dashboardData.games.map((game) => (
                    <div key={game.id} className="bg-white/60 rounded-2xl p-4 shadow-lg shadow-black/5 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900">{game.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          game.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {game.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">플레이어</div>
                          <div className="font-bold text-gray-900">{game.playerCount}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">평점</div>
                          <div className="font-bold text-gray-900">⭐ {game.rating}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <GamepadIcon className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">아직 업로드된 게임이 없습니다</p>
                    <button
                      onClick={startUploading}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm hover:scale-105 transition-all duration-200"
                    >
                      첫 게임 업로드하기
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/20 h-96">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">최근 세션</h2>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dashboardData?.recentSessions?.length > 0 ? (
                  dashboardData.recentSessions.map((session) => (
                    <div key={session.id} className="bg-white/60 rounded-2xl p-4 shadow-lg shadow-black/5 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{session.gameTitle}</h4>
                          <p className="text-sm text-gray-600">{session.userWallet?.slice(0, 10)}...</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">플레이 시간</div>
                          <div className="font-bold text-gray-900">{formatTime(session.activePlayTime)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">수익</div>
                          <div className="font-bold text-gray-900">{formatCurrency(session.totalCost)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">아직 세션이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;