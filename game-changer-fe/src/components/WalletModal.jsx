import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Wallet, User, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const WalletModal = ({ isOpen, onClose, onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'success', 'existing'
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    setLoading(true);
    
    try {
      // find-or-create 엔드포인트를 사용하여 안전하게 처리
      const response = await fetch('http://localhost:3000/api/users/find-or-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (response.ok) {
        const user = await response.json();
        setUserData(user);
        
        // 기존 사용자인지 새 사용자인지 확인
        const checkResponse = await fetch(`http://localhost:3000/api/users/wallet/${walletAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (checkResponse.ok) {
          const existingUser = await checkResponse.json();
          const isNewUser = new Date(existingUser.createdAt) > new Date(Date.now() - 5000); // 5초 이내 생성
          setCurrentStep(isNewUser ? 'success' : 'existing');
        } else {
          setCurrentStep('success');
        }
      } else {
        throw new Error('Failed to process wallet');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('지갑 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setWalletAddress('');
      setCurrentStep('input');
      setUserData(null);
      setIsClosing(false);
      onClose();
    }, 200); // 애니메이션 시간과 맞춤
  };

  const handleWalletConnectionSuccess = () => {
    // 지갑 연결 성공 시 부모 컴포넌트에 알림
    if (onWalletConnected) {
      onWalletConnected(walletAddress);
    }
    handleClose();
  };

  const navigateToMyPage = () => {
    localStorage.setItem('connectedWallet', walletAddress);
    localStorage.setItem('userId', userData.id);
    // 지갑 연결 성공 시 부모 컴포넌트에 알림
    if (onWalletConnected) {
      onWalletConnected(walletAddress);
    }
    handleClose();
    // 마이페이지로 이동 (라우터 설정 필요)
    window.location.href = '/mypage';
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-gray-100 transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-modal-scale'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {currentStep === 'input' && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('connectWalletTitle')}</h2>
            </div>

            <p className="text-gray-600 mb-6">
              {t('connectWalletDesc')}
            </p>

            <form onSubmit={handleWalletSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('walletAddressInput')}
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={t('walletAddressPlaceholder')}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !walletAddress.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('connecting')}
                  </div>
                ) : t('connectWalletBtn')}
              </button>
            </form>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{t('userCreated')}</h2>
            <p className="text-gray-600 mb-6">{t('newGameJourney')}</p>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">{t('userId')}</span>
              </div>
              <p className="text-lg font-mono text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">{userData?.id}</p>
            </div>

            <button
              onClick={handleWalletConnectionSuccess}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {t('startGame')}
            </button>
          </div>
        )}

        {currentStep === 'existing' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{t('welcomeBack')}</h2>
            <p className="text-gray-600 mb-6">{t('existingWallet')}</p>
            
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">{t('userId')}</span>
              </div>
              <p className="text-lg font-mono text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">{userData?.id}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={navigateToMyPage}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {t('goToMyPage')}
              </button>
              
              <button
                onClick={handleClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WalletModal;