import React, { createContext, useState, useEffect, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || 'LKR';
  });

  const exchangeRates = {
    LKR: 1.0,
    USD: 302.50,
    EUR: 328.75,
    GBP: 385.20,
    AUD: 202.10,
    JPY: 1.88
  };

  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const convertPrice = (lkrAmount) => {
    if (!lkrAmount) return 0;
    if (selectedCurrency === 'LKR') return lkrAmount;
    const rate = exchangeRates[selectedCurrency];
    return rate ? lkrAmount / rate : lkrAmount;
  };

  const getCurrencySymbol = (currency = selectedCurrency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'AUD': return 'A$';
      case 'JPY': return '¥';
      case 'LKR': return '₨';
      default: return '₨';
    }
  };

  const formatPrice = (lkrAmount) => {
    const converted = convertPrice(lkrAmount);
    const symbol = getCurrencySymbol();
    
    // Format output with appropriate currency details
    return `${symbol} ${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ${selectedCurrency}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency, 
      setSelectedCurrency, 
      exchangeRates, 
      convertPrice, 
      getCurrencySymbol, 
      formatPrice 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
