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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">{t('walletRequired')}</h1>
          <p className="text-gray-600">{t('connectWalletFirst')}</p>
          <p className="mt-4 text-sm">{t('clickConnectButton')}</p>
        </div>
      </div>
    );
  }

  if (!user.tempWallet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-md">
          <CreditCard className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">{t('tempWalletRequired')}</h1>
          <p className="text-gray-600 mb-4">{t('createTempWalletFirst')}</p>
          <Link to="/">
            <button className="px-6 py-3 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700">
              {t('goToFirstCharge')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-2xl">
        <div className="flex justify-center mb-4">
          <Gift className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('freeFeeCharge')}</h1>
        <div className="text-gray-600 mb-6 space-y-1">
          <p>{t('watchAdReward')}</p>
          <p className="text-sm text-gray-500 italic">{t('rewardLimmit')}</p>
        </div>
        <div className="mt-4 min-h-[50px] flex items-center justify-center">
          {status === 'claiming' && <p className="text-blue-600">{t('claimingReward')}</p>}
          {status === 'success' && <p className="text-green-600 font-bold">✅ {t('rewardSuccess')}</p>}
          {status === 'error' && <p className="text-red-600"><AlertTriangle size={16} className="inline mr-2"/> {t('error')}: {errorMessage}</p>}
        </div>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border">
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
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group"
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
  );
};

export default EarnFees;
