import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sampleChatMessages, ChatMessage } from '../data/staticData';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, riskLevel } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponses = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase();
    
    // Crisis responses for high-risk users
    if (riskLevel === 'high') {
      if (message.includes('crisis') || message.includes('emergency') || message.includes('help')) {
        return [
          "I understand you're in crisis. Please know that help is available 24/7.",
          "Have you contacted the crisis helpline at 1-800-273-8255? They have trained counselors ready to help.",
          "If you're in immediate danger, please call 911 or go to your nearest emergency room."
        ];
      }
      if (message.includes('suicidal') || message.includes('hurt myself')) {
        return [
          "I'm very concerned about you. Please reach out for immediate help.",
          "Crisis Text Line: Text HOME to 741741",
          "National Suicide Prevention Lifeline: 988",
          "You are not alone, and your life has value."
        ];
      }
    }

    // General supportive responses
    if (message.includes('craving') || message.includes('urge')) {
      return [
        "Cravings are temporary and will pass. You're stronger than this urge.",
        "Try the HALT technique: Are you Hungry, Angry, Lonely, or Tired? Address these basic needs first.",
        "Remember your reasons for recovery. What motivated you to start this journey?"
      ];
    }
    
    if (message.includes('anxious') || message.includes('anxiety')) {
      return [
        "Anxiety is common in recovery. Let's try some breathing exercises together.",
        "Take 4 deep breaths: In for 4 counts, hold for 4, out for 4, hold for 4.",
        "Grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste."
      ];
    }
    
    if (message.includes('progress') || message.includes('doing')) {
      return [
        "Every day in recovery is progress, even the difficult ones.",
        "Recovery isn't linear - setbacks are part of the journey, not failures.",
        "You're here talking to me, which shows you're committed to your recovery. That's huge!"
      ];
    }
    
    if (message.includes('lonely') || message.includes('alone')) {
      return [
        "You're not alone in this journey. I'm here, and so is your support network.",
        "Consider reaching out to a friend, family member, or support group today.",
        "Loneliness is temporary. Your recovery community is always here for you."
      ];
    }

    // Default responses
    const defaultResponses = [
      "I hear you. Can you tell me more about how you're feeling right now?",
      "That sounds challenging. What coping strategies have you tried before?",
      "Thank you for sharing that with me. How can I best support you today?",
      "I'm here to listen and help. What would be most helpful for you right now?",
      "Recovery is a journey with ups and downs. How are you taking care of yourself today?"
    ];
    
    return [defaultResponses[Math.floor(Math.random() * defaultResponses.length)]];
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

    const botResponses = getBotResponses(inputMessage);
    
    for (let i = 0; i < botResponses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const botMessage: ChatMessage = {
        id: Date.now() + i,
        sender: 'bot',
        message: botResponses[i],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    }

    setIsTyping(false);
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
