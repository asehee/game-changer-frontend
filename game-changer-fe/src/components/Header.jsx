// External Dependencies
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Wallet, ChevronDown, Gamepad2, 
  Library, Users, TrendingUp, Menu, 
  X, Languages, DollarSign, CreditCard 
} from 'lucide-react';
import { formatAddress } from '../utils';
import { isInstalled, getAddress, getNetwork } from '@gemwallet/api';

// Internal Dependencies
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from '../hooks/useTranslation';

const Header = () => {
  // Hooks
  const navigate = useNavigate();
  const { toggleLanguage, language } = useLanguage();
  const { t } = useTranslation();
  const { 
    user, 
    userBalance, 
    walletAddress, 
    isConnected, 
    isBalanceLoading,
    isCharging,
    connectWallet,
    disconnectWallet,
    getTempBalance, 
    setupFirstCharge,
    nickname
  } = useUser();

  // Local State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGemWalletInstalled, setIsGemWalletInstalled] = useState(null);

  // Effects
  useEffect(() => {
    const checkGemWalletInstallation = () => {
      if (typeof isInstalled !== 'function') {
        console.error(t('gemWalletApiLoadError'));
        setIsGemWalletInstalled(false);
        return;
      }

      isInstalled()
        .then(response => setIsGemWalletInstalled(response.result.isInstalled))
        .catch(error => {
          console.error(t('gemWalletInstallCheckFail'), error);
          setIsGemWalletInstalled(false);
        });
    };

    if (document.readyState === 'complete') {
      checkGemWalletInstallation();
    } else {
      window.addEventListener('load', checkGemWalletInstallation);
      return () => window.removeEventListener('load', checkGemWalletInstallation);
    }
  }, []);

  useEffect(() => {
    const fetchTempBalance = async () => {
      if (!user?.isFirstChargeCompleted || !user?.tempWallet) return;

      try {
        await getTempBalance(user.wallet);
      } catch (error) {
        console.error(t('tempWalletBalanceError') + ': ', error);
      }
    };

    fetchTempBalance();
  }, [user, getTempBalance]);

  // Wallet Button Text Helper
  const getWalletButtonText = () => {
    if (isGemWalletInstalled === null) return t('checkingWallet');
    if (isGemWalletInstalled) return t('connectWallet');
    return t('gemWalletRequired');
  };

  // Event Handlers
  const handleGemWalletConnect = async () => {
    if (!isGemWalletInstalled) {
      alert(t('installGemWallet'));
      window.open('https://gemwallet.app/', '_blank');
      return;
    }

    try {
      const addressResponse = await getAddress();
      if (!addressResponse.result?.address) return;

      const networkResponse = await getNetwork();
      const currentNetwork = networkResponse.result?.network;

      if (currentNetwork?.toUpperCase() !== 'TESTNET') {
        alert(t('wrongNetwork'));
        return;
      }

      await connectWallet(addressResponse.result.address);
    } catch (error) {
      console.error(t('walletConnectionError'), error);
      alert(t('walletConnectionError'));
    }
  };

  const handleFirstCharge = async () => {
    try {
      await setupFirstCharge(walletAddress);
      alert(t('chargeComplete'));
    } catch (error) {
      console.error(t('chargeError') + ': ', error);
      alert(t('chargeError') + ': '+`${error.message}`);
    }
  };

  return (
    <header className="bg-black/50 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                GameChanger
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-2">
              <Link 
                to="/" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/10 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-white hover:text-blue-400 font-medium"
              >
                <Library className="w-4 h-4" />
                {t('store')}
              </Link>
              <Link 
                to="/mypage" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/10 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-white hover:text-blue-400 font-medium"
              >
                <User className="w-4 h-4" />
                {t('library')}
              </Link>
              <Link 
                to="/developer" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/10 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-white hover:text-blue-400 font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                {t('developer')}
              </Link>
              <Link 
                to="/test" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/10 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-white hover:text-blue-400 font-medium"
              >
                {t('tokenFaucet')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            
           {/* isConnected 이후의 렌더링 로직을 명확하게 분리 */}
           {isConnected && user && (
              <div className="hidden md:flex items-center gap-2">
                {user.isFirstChargeCompleted && user.tempWallet ? (
                  // --- Case 1: 첫 충전이 완료된 사용자 ---
                  <>
                    <div className="relative group"> {/* ⬅️ 1. 이 컨테이너에 group 클래스 추가 */}
                      {/* 기본으로 보이는 IOU 잔액 (기존 초록색 스타일 적용) */}
                      <div className="bg-green-100 rounded-2xl px-4 py-2 flex items-center gap-2 border border-green-200 shadow-sm cursor-pointer transition-all duration-200 group-hover:shadow-lg">
                        {isBalanceLoading ? (
                          <span className="text-sm font-medium text-green-800">{t('checkingBalance')}</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <span className="text-lg font-bold text-green-900">
                              {parseFloat(userBalance?.tokenBalance || 0).toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-green-700">USD</span>
                          </div>
                        )}
                      </div>

                      {/* 🔥 마우스를 올렸을 때 '아래'에 보이는 XRP 잔액 (툴팁) */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max bg-gray-800 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      >
                        <div className="flex items-center gap-1.5">
                            {/* XRP 아이콘 SVG */}
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg" className="w-3 h-3 fill-current text-gray-300">
                              <title>XRP</title>
                              <path d="M12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm.23 18.38l-3.6-3.62.9-.9 2.7 2.7 5.8-5.83.9.9-6.7 6.75z"/>
                            </svg>
                            <span>{t('forFee') + parseFloat(userBalance?.xrpBalance || 0).toFixed(6).toString()+" XRP"}</span>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-[4px] border-b-gray-800"></div>
                      </div>

                    </div>
                  </>
                ) : (
                  // --- Case 2: 아직 첫 충전을 안 한 사용자 ---
                  <button
                    onClick={handleFirstCharge}
                    disabled={isCharging}
                    className={`backdrop-blur-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-blue-400/30 text-white px-3 py-2 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-sm ${
                      isCharging ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {isCharging ? t('chargingInProgress') : t('firstChargeButton')}
                  </button>
                )}
              </div>
            )}
            
            <button
              onClick={toggleLanguage}
              className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 border border-gray-600/30 px-3 py-2 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105"
              title={`Switch to ${language === 'ko' ? 'English' : '한국어'}`}
            >
              <Languages className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">
                {language === 'ko' ? 'EN' : '한'}
              </span>
            </button>
            
            {!isConnected ? (
              <button
                onClick={handleGemWalletConnect}
                disabled={isGemWalletInstalled !== true}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
              >
                <Wallet className="w-4 h-4" />
                {getWalletButtonText()}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-white/30 px-4 py-2 rounded-2xl transition-all duration-200 flex items-center gap-3 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 text-sm">{nickname}</div>
                    <div className="text-xs text-gray-500">{formatAddress(walletAddress)}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/30 overflow-hidden z-50">
                    <Link
                      to="/mypage"
                      className="block px-4 py-3 hover:bg-white/50 transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      {t('myProfile')}
                    </Link>
                    <Link
                      to="/developer"
                      className="block px-4 py-3 hover:bg-white/50 transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {t('developerDashboard')}
                    </Link>
                    <hr className="border-white/30 my-1" />
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-red-50/50 transition-all duration-200 text-red-600 font-medium"
                    >
                      {t('disconnect')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button 
              className="md:hidden text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;