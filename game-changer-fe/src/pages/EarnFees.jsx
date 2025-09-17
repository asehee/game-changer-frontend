import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Gift, AlertTriangle, PlayCircle, CreditCard } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

const EarnFees = () => {
  const { t } = useTranslation();
  const { user, isConnected, loading } = useUser();
  const videoRef = useRef(null);

  const [status, setStatus] = useState('watching');
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = async () => {
    if (!isConnected || !user?.tempWallet) return;

    setStatus('claiming');
    try {
      const response = await fetch(`${API_URL}/api/users/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: user.wallet }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('rewardFailed'));
      }
      
      setStatus('success');
      alert(t('rewardSent'));

    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t('loading')}</div>;
  }
  
  if (!isConnected || !user) {
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
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center w-full max-w-md">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">{t('walletRequired')}</h1>
            <p className="text-white/80">{t('connectWalletFirst')}</p>
            <p className="mt-4 text-sm text-white/60">{t('clickConnectButton')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user.tempWallet) {
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
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center w-full max-w-md">
            <CreditCard className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">{t('tempWalletRequired')}</h1>
            <p className="text-white/80 mb-4">{t('createTempWalletFirst')}</p>
            <Link to="/">
              <button className="px-6 py-3 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-all duration-200 hover:scale-105">
                {t('goToFirstCharge')}
              </button>
            </Link>
          </div>
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
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center w-full max-w-2xl">
          <div className="flex justify-center mb-4">
            <Gift className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('freeFeeCharge')}</h1>
          <div className="text-white/80 mb-6 space-y-1">
            <p>{t('watchAdReward')}</p>
            <p className="text-sm text-white/60 italic">{t('rewardLimmit')}</p>
          </div>
          <div className="mt-4 min-h-[50px] flex items-center justify-center">
            {status === 'claiming' && <p className="text-blue-400">{t('claimingReward')}</p>}
            {status === 'success' && <p className="text-green-400 font-bold">✅ {t('rewardSuccess')}</p>}
            {status === 'error' && <p className="text-red-400"><AlertTriangle size={16} className="inline mr-2"/> {t('error')}: {errorMessage}</p>}
          </div>
          <div className="relative aspect-video bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
            <video
              ref={videoRef}
              src="/ad.mp4" 
              className="w-full h-full"
              playsInline
              controls
              onEnded={handleVideoEnd}
              onCanPlay={() => setIsVideoLoading(false)}
            />
            {(isVideoLoading || !isPlaying) && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer group"
                onClick={handlePlayClick}
              >
                {isVideoLoading ? (
                  <p className="text-white">{t('videoLoading')}</p>
                ) : (
                  <PlayCircle className="w-20 h-20 text-white text-opacity-70 group-hover:text-opacity-100 group-hover:scale-110 transition-all duration-300" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnFees;
