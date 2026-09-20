import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudFog, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw 
} from 'lucide-react';
import { fetchWeatherData } from '../../utils/weatherService';

const WeatherWidget = ({ location = 'Sigiriya', name = '' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [showForecast, setShowForecast] = useState(false);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchWeatherData(location || name);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, [location, name]);

  const renderIcon = (iconName, size = 24, className = "") => {
    switch (iconName) {
      case 'Sun': return <Sun size={size} className={`text-amber-400 ${className}`} />;
      case 'CloudSun': return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
      case 'Cloud': return <Cloud size={size} className={`text-gray-300 ${className}`} />;
      case 'CloudDrizzle': return <CloudDrizzle size={size} className={`text-sky-300 ${className}`} />;
      case 'CloudRain': return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
      case 'CloudLightning': return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
      case 'CloudFog': return <CloudFog size={size} className={`text-gray-400 ${className}`} />;
      default: return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a1f] p-6 rounded-3xl border border-white/10 text-white animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-[#FF8C00]" size={20} />
          <span className="text-gray-300 text-sm">Loading live Sri Lanka weather & safety advisory...</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, forecast, advisory } = weather;
  const tempDisplay = unit === 'C' ? `${current.tempC}°C` : `${current.tempF}°F`;

  // Badge Color Styles
  const getBadgeStyle = (type) => {
    if (type === 'warning') {
      return {
        bg: 'bg-red-500/10 border-red-500/30 text-red-400',
        title: 'text-red-400',
        icon: <AlertTriangle size={18} className="text-red-400 shrink-0" />
      };
    } else if (type === 'peak') {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        title: 'text-emerald-400',
        icon: <Sparkles size={18} className="text-emerald-400 shrink-0" />
      };
    } else {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        title: 'text-amber-400',
        icon: <Info size={18} className="text-amber-400 shrink-0" />
      };
    }
  };

  const badgeStyle = getBadgeStyle(advisory?.type);

  return (
    <div className="bg-[#1a1a1f] rounded-2xl border border-white/10 p-4 sm:p-5 text-white shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sunset-orange bg-sunset-orange/10 px-2.5 py-0.5 rounded-full border border-sunset-orange/20">
              Live Weather
            </span>
            <span className="text-xs text-gray-400">Asia/Colombo</span>
          </div>
          <h4 className="text-lg font-bold text-white mt-1">{weather.locationName || location}</h4>
        </div>

        {/* C/F Unit Switcher */}
        <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10 text-xs">
          <button
            onClick={() => setUnit('C')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              unit === 'C' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              unit === 'F' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            {renderIcon(current.icon, 38)}
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{tempDisplay}</div>
            <div className="text-sm text-gray-300 font-medium">{current.label}</div>
          </div>
        </div>

        <div className="text-right space-y-1 text-xs text-gray-400">
          <div className="flex items-center justify-end gap-1.5">
            <Droplets size={14} className="text-sky-400" />
            <span>Humidity: <strong className="text-white">{current.humidity}%</strong></span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Wind size={14} className="text-teal-400" />
            <span>Wind: <strong className="text-white">{current.windKm} km/h</strong></span>
          </div>
        </div>
      </div>

      {/* Sri Lanka Monsoon & Safety Advisory Banner */}
      {advisory && (
        <div className={`p-4 rounded-2xl border ${badgeStyle.bg} mb-4 transition-all`}>
          <div className="flex items-center gap-2 mb-1.5">
            {badgeStyle.icon}
            <span className="font-bold text-xs uppercase tracking-wider">{advisory.badge}</span>
          </div>
          <h5 className={`font-bold text-sm mb-1 ${badgeStyle.title}`}>{advisory.title}</h5>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">{advisory.description}</p>
          
          {advisory.tips && advisory.tips.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tourist Safety Tips:</span>
              <ul className="text-xs text-gray-300 space-y-1">
                {advisory.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sunset-orange font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3-Day Forecast Toggle */}
      <button
        onClick={() => setShowForecast(!showForecast)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all border border-white/5"
      >
        <span>3-Day Weather Forecast</span>
        {showForecast ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* 3-Day Forecast Strip */}
      {showForecast && forecast && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/10">
          {forecast.map((dayItem, idx) => (
            <div key={idx} className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
              <div className="text-[11px] text-gray-400 font-medium mb-1">{dayItem.day}</div>
              <div className="flex justify-center mb-1">
                {renderIcon(dayItem.icon, 20)}
              </div>
              <div className="text-xs font-bold text-white">
                {unit === 'C' ? `${dayItem.maxTemp}°` : `${Math.round((dayItem.maxTemp * 9)/5 + 32)}°`}
                <span className="text-gray-400 font-normal text-[10px] ml-1">
                  {unit === 'C' ? `${dayItem.minTemp}°` : `${Math.round((dayItem.minTemp * 9)/5 + 32)}°`}
                </span>
              </div>
              <div className="text-[10px] text-sky-400 mt-1 flex items-center justify-center gap-0.5">
                <Droplets size={10} />
                <span>{dayItem.precipProb}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
