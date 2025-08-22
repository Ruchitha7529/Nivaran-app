import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage } from '../data/staticData';
import { AIChatService, ChatContext } from '../services/aiChatService';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Psychology as TherapyIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, riskLevel } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiService] = useState(new AIChatService());
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation with welcome message
    const initializeChat = async () => {
      const welcomeMessage = await aiService.getWelcomeMessage(riskLevel);
      const initialMessage: ChatMessage = {
        id: 1,
        sender: 'bot',
        message: welcomeMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([initialMessage]);
    };

    initializeChat();
  }, [aiService, riskLevel]);

  const createChatContext = (): ChatContext => {
    return {
      riskLevel,
      conversationHistory: messages.slice(-10).map(msg => ({
        sender: msg.sender,
        message: msg.message
      })),
      timeOfDay: (() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 22) return 'evening';
        return 'night';
      })()
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
      const context = createChatContext();
      const botResponses = await aiService.generateResponse(inputMessage, context);

      for (let i = 0; i < botResponses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const botMessage: ChatMessage = {
          id: Date.now() + i,
          sender: 'bot',
          message: botResponses[i],
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const fallbackMessage: ChatMessage = {
        id: Date.now(),
        sender: 'bot',
        message: "I'm here to support you. Could you tell me more about what you're experiencing?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setIsTyping(false);
  };

  const quickResponses = [
    { text: "I'm feeling anxious", icon: "😰" },
    { text: "I'm having cravings", icon: "⚡" },
    { text: "I need motivation", icon: "💪" },
    { text: "I'm feeling lonely", icon: "😔" },
    { text: "I'm doing well today", icon: "😊" },
    { text: "I need coping strategies", icon: "🧘" }
  ];

  const handleQuickResponse = (responseText: string) => {
    setInputMessage(responseText);
    setShowQuickResponses(false);
    // Auto-send the quick response
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <BotIcon className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">AI Support Assistant</h1>
                  <p className="text-sm text-gray-600">
                    {riskLevel === 'high' ? 'Crisis Support Mode' : 'Always here to help'}
                  </p>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <MoreVertIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <PersonIcon className="text-white text-sm" />
                      ) : (
                        <BotIcon className="text-white text-sm" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm border'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <BotIcon className="text-white text-sm" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Buttons */}
          {showQuickResponses && messages.length <= 2 && (
            <div className="border-t bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-3">Quick responses:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickResponses.map((response, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickResponse(response.text)}
                    className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <span className="text-lg">{response.icon}</span>
                    <span className="text-sm text-gray-700">{response.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="border-t bg-white p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-3 rounded-full transition-all duration-200 ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <SendIcon />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
