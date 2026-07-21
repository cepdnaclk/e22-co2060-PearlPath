import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, User, MapPin, Calendar, Compass, Star, ChevronRight, HelpCircle } from 'lucide-react';

// Lightweight custom Markdown component to render bold texts, bullet lists, and links properly
const MarkdownText = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        let isBullet = line.startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
        let cleanLine = line;
        if (isBullet) {
          cleanLine = line.replace(/^[•\-*]\s*/, '');
        }

        const boldParts = cleanLine.split('**');
        const elements = boldParts.map((part, pIdx) => {
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let lastIndex = 0;
          let match;
          const lineParts = [];

          while ((match = linkRegex.exec(part)) !== null) {
            if (match.index > lastIndex) {
              lineParts.push(part.substring(lastIndex, match.index));
            }
            const linkText = match[1];
            const linkUrl = match[2];

            lineParts.push(
              <a
                key={match.index}
                href={linkUrl}
                className="underline font-semibold hover:text-orange-500 transition-colors"
                style={{ color: '#EA580C' }}
              >
                {linkText}
              </a>
            );
            lastIndex = linkRegex.lastIndex;
          }

          if (lastIndex < part.length) {
            lineParts.push(part.substring(lastIndex));
          }

          const content = lineParts.length > 0 ? lineParts : part;
          return pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold">{content}</strong> : <React.Fragment key={pIdx}>{content}</React.Fragment>;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-orange-500 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>{elements}</span>
            </div>
          );
        }
        return <p key={idx} className="m-0 leading-normal min-h-[1.2em]">{elements}</p>;
      })}
    </div>
  );
};

const TravelChatWidget = ({ onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Ayubowan! 🌅 I am Traver, your PearlPath travel assistant. Let me help you find the best hotels, tour guides, and activities in Sri Lanka!', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = [
    { label: '🏨 Recommend Hotels', query: 'Recommend approved hotels in Ella' },
    { label: '🗺️ Find Tour Guides', query: 'Find me a tour guide in Galle' },
    { label: '📅 My Bookings', query: 'Check my booking status' },
    { label: 'ℹ️ Website Help', query: 'How do I book hotels or sign up as provider?' },
    { label: '⛰️ Travel Destinations', query: 'What are the main shortcuts to travel tabs?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', content: textToSend.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputValue('');
    setIsTyping(true);

    try {
      let replyData;
      if (onSendMessage) {
        replyData = await onSendMessage(userMessage.content, messages);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        replyData = {
          reply: "Demo Mode: Connect a valid backend to query Sri Lankan tours, hotels, or guides!",
          context: null
        };
      }

      const botMessage = {
        role: 'bot',
        content: replyData.reply,
        context: replyData.context,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting to Traver systems right now. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  const renderContextCarousel = (context) => {
    if (!context || !context.data || context.data.length === 0) return null;

    const navigateTo = (path) => {
      setIsOpen(false);
      navigate(path);
    };

    return (
      <div className="w-full mt-3 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 -mx-4 px-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
          {context.type === 'hotels' && context.data.map((hotel) => (
            <div key={hotel._id} className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <img
                src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                alt={hotel.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-800 line-clamp-1 m-0">{hotel.name}</h4>
                  <div className="flex items-center text-[10px] text-gray-500 mt-1">
                    <MapPin size={10} className="mr-0.5 text-orange-500" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] font-bold text-orange-600">${hotel.pricePerNight}</span>
                    <span className="text-[9px] text-gray-400">/ night</span>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo(`/hotel/${hotel._id}`)}
                  className="w-full mt-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer border-none"
                >
                  View Hotel
                </button>
              </div>
            </div>
          ))}

          {context.type === 'guides' && context.data.map((guide) => (
            <div key={guide._id} className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="p-3 flex flex-col items-center text-center">
                <img
                  src={guide.profilePictureUrl || 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100'}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-100 shadow-sm"
                />
                <h4 className="font-bold text-xs text-gray-800 mt-2 line-clamp-1 m-0">{guide.name}</h4>
                <div className="flex items-center text-[9px] text-gray-400 mt-0.5">
                  <MapPin size={8} className="mr-0.5 text-orange-500" />
                  <span>{guide.location}</span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-normal m-0">{guide.bio}</p>
                <div className="text-[10px] font-bold text-orange-600 mt-1">${guide.pricePerDay || 30}/day</div>
              </div>
              <div className="p-2 border-t border-gray-50">
                <button
                  onClick={() => navigateTo(`/tour-guide/${guide._id}`)}
                  className="w-full py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer border-none"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}

          {context.type === 'tours' && context.data.map((tour) => (
            <div key={tour._id} className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <img
                src={tour.images?.[0] || 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200'}
                alt={tour.title}
                className="w-full h-24 object-cover"
              />
              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-800 line-clamp-1 m-0">{tour.title}</h4>
                  <div className="flex items-center text-[10px] text-gray-500 mt-1">
                    <MapPin size={10} className="mr-0.5 text-orange-500" />
                    <span className="line-clamp-1">{tour.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="font-bold text-orange-600">${tour.price}</span>
                    <span className="text-gray-400">{tour.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo(`/experiences`)}
                  className="w-full mt-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer border-none"
                >
                  View Tour
                </button>
              </div>
            </div>
          ))}

          {context.type === 'bookings' && context.data.map((booking) => (
            <div key={booking._id} className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-mono">#{booking._id.toString().slice(-6)}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase ${
                    booking.bookingStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    booking.bookingStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-gray-800 mt-2 m-0 line-clamp-1">
                  {booking.tour?.title || booking.hotel?.name || 'PearlPath Booking'}
                </h4>
                <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigateTo(`/my-bookings`)}
                className="w-full mt-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer border-none"
              >
                Go to Bookings
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-80 sm:w-[26rem] h-[34rem] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-150/70" style={{ backgroundColor: '#FDFBEE' }}>
          {/* Header */}
          <div className="p-4 flex items-center justify-between text-white bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 relative">
                <Compass size={22} className="text-white animate-spin" style={{ animationDuration: '15s' }} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm m-0 leading-tight">Traver</h3>
                <p className="text-[11px] text-orange-50/90 font-medium m-0 flex items-center gap-1">
                  Sri Lanka Travel Guide
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-orange-100 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full border-none cursor-pointer"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-tr-none text-white'
                      : 'rounded-tl-none text-gray-800 bg-white border border-gray-100/90'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: '#1E293B' } : {}}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <MarkdownText text={msg.content} />
                  )}
                  {msg.role === 'bot' && msg.context && renderContextCarousel(msg.context)}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 mx-1.5 font-medium">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-gray-100 max-w-[40%] rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions list */}
          <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug.query)}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200/80 hover:border-orange-200 rounded-full text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-2xs font-medium"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Traver about hotels, guides or bookings..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 border-none cursor-pointer shadow-sm"
              style={{ backgroundColor: '#EA580C' }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 border-none cursor-pointer group overflow-hidden relative"
          style={{ backgroundColor: '#EA580C' }}
          aria-label="Open chat"
        >
          <style>{`
            @keyframes wave-animation {
              0% { transform: rotate(0.0deg) }
              10% { transform: rotate(14.0deg) }
              20% { transform: rotate(-8.0deg) }
              30% { transform: rotate(14.0deg) }
              40% { transform: rotate(-4.0deg) }
              50% { transform: rotate(10.0deg) }
              60% { transform: rotate(0.0deg) }
              100% { transform: rotate(0.0deg) }
            }
            .animate-wave {
              animation: wave-animation 2.5s infinite;
              transform-origin: 70% 70%;
              display: inline-block;
            }
          `}</style>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="relative z-10 flex items-center justify-center text-3xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
              <circle cx="12" cy="5" r="2" />
              <line x1="12" y1="7" x2="12" y2="15" />
              <rect x="7" y="7" width="4" height="6" rx="1" />
              <path d="M12 9 L9 13" />
              <g className="animate-wave" style={{ transformOrigin: '12px 9px' }}>
                <path d="M12 9 L16 5 L18 5" />
              </g>
              <path d="M12 15 L9 21" />
              <path d="M12 15 L15 21" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default TravelChatWidget;
