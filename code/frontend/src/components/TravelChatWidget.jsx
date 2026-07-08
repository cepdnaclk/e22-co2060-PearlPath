import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Plane } from 'lucide-react';

const TravelChatWidget = ({ onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Ayubowan! I am Nimal, your Sri Lanka travel guide. How can I help you today?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let replyText;
      if (onSendMessage) {
        // conversationHistory mapping format is done in aiService usually, 
        // we pass the raw messages minus the newly added one as history, plus the new one?
        // Wait, the backend usually needs the current message and history separately, or just a list.
        // As requested: onSendMessage(message, conversationHistory)
        replyText = await onSendMessage(userMessage.content, messages);
      } else {
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 1500));
        replyText = "This is a placeholder reply in demo mode. Connect the onSendMessage prop to talk to Nimal!";
      }

      const botMessage = { role: 'bot', content: replyText, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting right now.", timestamp: new Date() }]);
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

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[32rem] flex flex-col rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FBF6EC' }}>
          {/* Header */}
          <div className="p-4 flex items-center justify-between text-white" style={{ backgroundColor: '#EA580C' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm m-0 leading-tight">Nimal</h3>
                <p className="text-xs text-[#0F172A] m-0">Your Sri Lanka Travel Guide</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'rounded-tr-none text-white' 
                      : 'rounded-tl-none text-gray-800 bg-white border border-gray-100'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: '#0F172A' } : {}}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-gray-100 max-w-[80%] rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about tours, hotels..."
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:border-transparent transition-all"
                style={{ focusRing: '#EA580C' }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-none cursor-pointer"
                style={{ backgroundColor: '#EA580C' }}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
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
          
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          
          {/* Waving human traveler SVG animation */}
          <div className="relative z-10 flex items-center justify-center text-3xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
              {/* Head */}
              <circle cx="12" cy="5" r="2" />
              {/* Body */}
              <line x1="12" y1="7" x2="12" y2="15" />
              {/* Backpack */}
              <rect x="7" y="7" width="4" height="6" rx="1" />
              {/* Left arm */}
              <path d="M12 9 L9 13" />
              {/* Right arm waving */}
              <g className="animate-wave" style={{ transformOrigin: '12px 9px' }}>
                <path d="M12 9 L16 5 L18 5" />
              </g>
              {/* Legs */}
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
