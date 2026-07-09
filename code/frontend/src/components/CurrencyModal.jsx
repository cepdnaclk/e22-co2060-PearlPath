import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencyModal = ({ onClose }) => {
  const { selectedCurrency, setSelectedCurrency, exchangeRates } = useCurrency();
  const [inputAmount, setInputAmount] = useState(100);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setInputAmount('');
    } else {
      const parsed = parseFloat(val);
      setInputAmount(isNaN(parsed) ? 0 : parsed);
    }
  };

  // Graceful numeric evaluation
  const amountToConvert = inputAmount === '' ? 0 : inputAmount;
  // If LKR is selected, convert from LKR to USD/others? 
  // Normally the modal converts the entered amount of the SELECTED foreign currency into LKR.
  // E.g. 100 USD = 30,250 LKR.
  // If LKR is selected, then 100 LKR = 100 LKR.
  const rate = exchangeRates[selectedCurrency] || 1;
  const convertedValue = amountToConvert * rate;

  return (
    <div className="absolute right-0 sm:left-0 mt-3 w-72 bg-[#0f0f11]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 transform origin-top-left transition-all animate-slide-up text-left">
      
      {/* Top Input Section */}
      <div className="p-4 border-b border-white/5 bg-[#141418]/60">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Enter Amount to Convert
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputAmount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-[#FF8C00]/80 focus:ring-1 focus:ring-[#FF8C00]/30 transition-all text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FF8C00]">
            {selectedCurrency}
          </span>
        </div>
      </div>

      {/* Middle Currency Selector List */}
      <div className="py-2 divide-y divide-white/5 max-h-60 overflow-y-auto hide-scrollbar">
        {Object.entries(exchangeRates).map(([currency, currentRate]) => {
          const isSelected = selectedCurrency === currency;
          return (
            <div
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`px-4 py-2.5 flex justify-between items-center cursor-pointer transition-all border-l-4 ${
                isSelected 
                  ? 'border-[#FF8C00] bg-[#FF8C00]/10 text-white' 
                  : 'border-transparent text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isSelected ? 'text-[#FF8C00]' : 'text-white'}`}>
                  {currency}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {currency === 'LKR' ? '(Base Currency)' : `(1 ${currency} = ${currentRate.toFixed(2)} LKR)`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-medium">Rate</span>
                <span className="text-xs font-bold text-white">
                  {currency === 'LKR' ? '1.00 LKR' : `${currentRate.toFixed(2)} LKR`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Banner */}
      <div className="p-4 border-t border-white/5 bg-[#141418]/80">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Estimated LKR Equivalent
        </span>
        <div className="text-xl font-extrabold text-[#FF8C00] tracking-tight truncate">
          ₨ {convertedValue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gray-400 font-bold uppercase">LKR</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyModal;

