import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Wallet, ChevronDown, Gamepad2, Library, Users, TrendingUp, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import WalletModal from './WalletModal';

const Header = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [nickname, setNickname] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleLanguage, language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (walletAddress) {
      const randomNicknames = ['SteamPunk', 'NightRider', 'CyberHunter', 'PixelMaster', 'GameChanger'];
      setNickname(randomNicknames[Math.floor(Math.random() * randomNicknames.length)]);
    }
  }, [walletAddress]);

  const connectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
  };

  // localStorage에서 연결된 지갑 정보를 확인
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                GameChanger
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-2">
              <Link 
                to="/" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                <Library className="w-4 h-4" />
                {t('store')}
              </Link>
              <Link 
                to="/mypage" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                <User className="w-4 h-4" />
                {t('library')}
              </Link>
              <Link 
                to="/developer" 
                className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                {t('developer')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-white/30 px-3 py-2 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105"
              title={`Switch to ${language === 'ko' ? 'English' : '한국어'}`}
            >
              <Languages className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'ko' ? 'EN' : '한'}
              </span>
            </button>
            
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
              >
                <Wallet className="w-4 h-4" />
                {t('connectWallet')}
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
                        setWalletAddress(null);
                        setNickname('');
                        setIsDropdownOpen(false);
                        localStorage.removeItem('connectedWallet');
                        localStorage.removeItem('userId');
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

      {/* WalletModal은 이제 Portal을 통해 body에 렌더링됨 */}
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={handleWalletConnected}
      />
    </header>
  );
};

export default Header;