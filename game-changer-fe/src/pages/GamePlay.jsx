import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Square, Clock, DollarSign, AlertCircle, Maximize2, Volume2, Settings } from 'lucide-react';
import { usePlaySession } from '../hooks/usePlaySession';
import { useTranslation } from '../hooks/useTranslation';
import { useWalletBalance } from '../contexts/WalletBalanceContext';
import DeveloperApiService from '../services/developerApi';

const GamePlay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // 사용자 지갑 주소 가져오기 (userId 대신 walletAddress 사용)
  const walletAddress = localStorage.getItem('connectedWallet');
  
  // 플레이 세션 관리
  const {
    session,
    isPlaying,
    loading: sessionLoading,
    error: sessionError,
    playTime,
    cost: totalCost,
    startPlay,
    stopPlay
  } = usePlaySession(gameId, walletAddress);

  const [gameData, setGameData] = useState(null);
  const { userBalance, hasWallet, loading: balanceLoading, fetchBalance } = useWalletBalance();

  useEffect(() => {
    const gameDatabase = {
      // 모든 게임이 9999포트의 실제 게임을 보여줍니다
      '1': { 
        id: '1',
        title: 'Cyber Warriors (WaveWar)',
        description: 'Epic multiplayer space battle game with real-time combat',
        price: 0.5,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      },
      '2': { 
        id: '2',
        title: 'Space Odyssey (WaveWar)',
        description: 'Explore infinite galaxies in this space simulation',
        price: 0.8,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      },
      '3': { 
        id: '3',
        title: 'Fantasy Quest (WaveWar)',
        description: 'Medieval RPG adventure with magical creatures',
        price: 0.0,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      },
      '4': { 
        id: '4',
        title: 'Racing Thunder (WaveWar)',
        description: 'High-speed racing with blockchain rewards',
        price: 0.3,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      },
      '5': { 
        id: '5',
        title: 'Battle Arena (WaveWar)',
        description: 'Competitive 5v5 MOBA with unique heroes',
        price: 0.0,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      },
      // 기본값도 실제 게임으로 연결
      'default': {
        id: gameId,
        title: 'Game Demo',
        description: '🎮 Interactive space battle game - Use arrow keys to move and space to shoot!',
        price: 0.001,
        gameUrl: 'http://localhost:9999/wavewar',
        isExternal: true
      }
    };
    
    setGameData(gameDatabase[gameId] || gameDatabase['default']);
  }, [gameId]);

  // 사용자 인증 및 계정 생성 확인
  useEffect(() => {
    const setupUser = async () => {
      if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
      }

      // 사용자 계정 확인/생성
      try {
        await DeveloperApiService.findOrCreateUser(userId);
        console.log('User account verified/created successfully');
        
        // 전역 상태의 잔액 조회 함수 사용
        await fetchBalance(userId);
      } catch (error) {
        console.warn('Failed to verify/create user account:', error);
      }
    };

    setupUser();
  }, [userId, navigate]);

  // 캔버스 게임 로직을 별도 useEffect로 분리하고 항상 실행되도록 수정
  useEffect(() => {
    let interval;
    let keyHandler;
    
    // 간단한 캔버스 게임 로직 (데모용)
    if (isPlaying && gameData && !gameData.isExternal) {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let player = { x: 50, y: 50, size: 20 };
        
        const gameLoop = () => {
          // 클리어
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // 플레이어 그리기
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(player.x, player.y, player.size, player.size);
        };
        
        // 키보드 이벤트 핸들러
        keyHandler = (e) => {
          switch(e.key) {
            case 'ArrowUp': 
              player.y = Math.max(0, player.y - 10); 
              break;
            case 'ArrowDown': 
              player.y = Math.min(canvas.height - player.size, player.y + 10); 
              break;
            case 'ArrowLeft': 
              player.x = Math.max(0, player.x - 10); 
              break;
            case 'ArrowRight': 
              player.x = Math.min(canvas.width - player.size, player.x + 10); 
              break;
          }
        };
        
        document.addEventListener('keydown', keyHandler);
        interval = setInterval(gameLoop, 60);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
    };
  }, [isPlaying, gameData]);

  const handleStartGame = useCallback(async () => {
    // 지갑이 설정되지 않았으면 게임 시작 불가
    if (!hasWallet) {
      alert('먼저 상단 메뉴에서 임시 지갑을 생성해주세요.');
      return;
    }
    
    // 잔액이 0이면 충전 필요
    if (userBalance === 0) {
      alert('잔액이 부족합니다. 상단 메뉴에서 충전해주세요.');
      return;
    }

    try {
      console.log('Starting game session...');
      await startPlay();
    } catch (error) {
      console.error('Failed to start game:', error);
      alert(`게임 시작 실패: ${error.message}`);
    }
  }, [startPlay, hasWallet]);

  const handleEndGame = useCallback(async () => {
    try {
      console.log('Ending game session...');
      const result = await stopPlay();
      console.log(`Total play time: ${formatTime(playTime)}`);
      console.log(`Total cost: $${totalCost.toFixed(6)}`);
      
      if (result) {
        alert(`게임이 종료되었습니다!\n플레이 시간: ${formatTime(playTime)}\n총 비용: $${totalCost.toFixed(6)}`);
        
        // 세션 종료 후 잔액 다시 조회
        await fetchBalance(userId);
        
        // 세션 종료 후 개발자 대시보드 데이터 갱신을 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('sessionEnded', {
          detail: { sessionData: result, playTime, totalCost }
        }));
      }
    } catch (error) {
      console.error('Failed to end game:', error);
      alert('게임 종료에 실패했습니다. 다시 시도해주세요.');
      
      // 에러가 발생해도 세션 상태를 정리하고 대시보드 갱신 시도
      try {
        window.dispatchEvent(new CustomEvent('sessionEnded', {
          detail: { error: error.message }
        }));
      } catch (eventError) {
        console.error('Failed to dispatch sessionEnded event:', eventError);
      }
    }
  }, [stopPlay, playTime, totalCost]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const renderGameContent = useCallback(() => {
    if (sessionError) {
      return (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <p className="text-red-600 text-lg mb-2">세션 오류가 발생했습니다</p>
          <p className="text-gray-400 mb-4">{sessionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl"
          >
            새로고침
          </button>
        </div>
      );
    }

    if (!isPlaying) {
      return (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
            <Play className="w-16 h-16 text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-2">Ready to play {gameData?.title}?</p>
          <p className="text-gray-400">Click "Start Game" to begin your adventure</p>
          {sessionLoading && (
            <p className="text-blue-600 mt-4">게임 세션을 준비중입니다...</p>
          )}
        </div>
      );
    }

    // 실제 게임이 실행 중일 때
    if (gameData?.gameUrl && gameData.isExternal) {
      return (
        <iframe
          src={gameData.gameUrl}
          className="rounded-2xl border-0"
          title={gameData.title}
          frameBorder="0"
          allow="gamepad; microphone; camera"
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
          style={{
            width: '1000px',
            height: '600px',
            display: 'block',
            margin: '0 auto',
            border: 'none'
          }}
        />
      );
    }

    // 데모 게임 (캔버스 기반 간단한 게임)
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
        <canvas
          id="gameCanvas"
          className="w-full h-full"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
          Demo Game Running - Use arrow keys to move
        </div>
      </div>
    );
  }, [isPlaying, gameData]);

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-blue-600 transition mb-6 font-medium"
        >
          ← Back to Store
        </button>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg shadow-black/5 border border-white/20">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{gameData.title}</h1>
              <p className="text-gray-600 text-lg">{gameData.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">${gameData.price}/sec</div>
              <div className="text-sm text-gray-500">Pay per second</div>
            </div>
          </div>

          {/* 잔액 표시 또는 충전 안내 */}
          {hasWallet ? (
            <div className="bg-green-50/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-green-700">잔액</div>
                    <div className="text-xl font-bold text-green-800">${(userBalance || 0).toFixed(6)}</div>
                  </div>
                </div>
                {userBalance === 0 && (
                  <div className="text-sm text-orange-600 font-medium">
                    상단 메뉴에서 충전하세요
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-orange-50/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-orange-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-orange-800 mb-1">임시 지갑 생성이 필요합니다</h3>
                  <p className="text-orange-700 text-sm">게임을 플레이하려면 상단 메뉴에서 임시 지갑을 생성해주세요.</p>
                </div>
              </div>
            </div>
          )}

          {isPlaying && (
            <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Play Time</div>
                    <div className="text-2xl font-bold text-gray-900">{formatTime(playTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-2xl font-bold text-gray-900">${totalCost.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!isPlaying ? (
              <button
                onClick={handleStartGame}
                disabled={sessionLoading}
                className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 ${
                  sessionLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Play className="w-6 h-6" />
                {sessionLoading ? '세션 시작 중...' : 'Start Game'}
              </button>
            ) : (
              <button
                onClick={handleEndGame}
                disabled={sessionLoading}
                className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 ${
                  sessionLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Square className="w-6 h-6" />
                {sessionLoading ? '세션 종료 중...' : 'End Game'}
              </button>
            )}
          </div>

          {!isPlaying && (
            <div className="mt-6 p-6 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Click "Start Game" to begin playing and billing</li>
                    <li>You'll be charged ${gameData.price} per second while playing</li>
                    <li>Click "End Game" to stop playing and save your session</li>
                    <li>Your progress is automatically saved</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl relative overflow-hidden shadow-lg shadow-black/5 border border-white/20" style={{height: '70vh', minHeight: '600px'}}>
          {renderGameContent()}

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 rounded-2xl transition shadow-lg">
              <Volume2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 rounded-2xl transition shadow-lg">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 rounded-2xl transition shadow-lg">
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;