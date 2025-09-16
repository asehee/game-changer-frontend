import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, CreditCard } from 'lucide-react';



const ChargeModal = ({ isOpen, onClose, onConfirm, isCharging }) => {
  const MIN_DEPOSIT = 1.801;
  const [isClosing, setIsClosing] = useState(false);
  const [iouAmount, setIouAmount] = useState('10'); // 기본값 10 USD
  const [xrpAmount, setXrpAmount] = useState(MIN_DEPOSIT.toString());   // 기본값 2 XRP (준비금 + 수수료)

  if (!isOpen) return null;


  const handleConfirm = () => {
    setIsClosing(true);
    const iou = parseFloat(iouAmount);
    const xrp = parseFloat(xrpAmount);
    if (isNaN(iou) || iou < 0) {
      alert('0 이상의 숫자여야 합니다.');
      return;
    }
    if (isNaN(xrp) || xrp < MIN_DEPOSIT) {
      alert(`${MIN_DEPOSIT} XRP는 최소 보증금액입니다.`);
      return;
    }
    setIsClosing(false);
    // 통과 시 콜백 실행
    onConfirm(iou, xrp);
  };

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-gray-100 transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-modal-scale'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
  
        {/* ===== 기존 ChargeModal 콘텐츠 넣기 ===== */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">게임 계정 충전</h2>
          <p className="text-sm text-gray-500">
            플레이에 사용할 토큰과 수수료용 XRP를 입금하세요.
          </p>
        </div>
  
        <div className="space-y-6">
          {/* 토큰 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">토큰 (USD)</label>
            <div className="relative">
              <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={iouAmount}
                onChange={(e) => setIouAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white shadow-sm"
                placeholder="예: 100"
              />
            </div>
          </div>
  
          {/* XRP 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">수수료 (XRP)</label>
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>XRP</title><path d="M12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm.23 18.38l-3.6-3.62.9-.9 2.7 2.7 5.8-5.83.9.9-6.7 6.75z"/></svg>
              <input
                type="number"
                value={xrpAmount}
                onChange={(e) => setXrpAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white shadow-sm"
                placeholder="예: 2"
              />
            </div>
          </div>
        </div>
  
        {/* 확인 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={isCharging}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:from-gray-300 disabled:to-gray-400 disabled:hover:scale-100"
          >
            {isCharging ? '충전 중...' : '확인 및 충전 진행'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChargeModal;