import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { messagingService, Message } from '../services/MessagingService';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  LocalHospital as DoctorIcon,
  Psychology as MentorIcon,
  AttachFile as AttachIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

interface MessagingCenterProps {
  recipientId?: string;
  recipientName?: string;
  recipientType?: 'mentor' | 'patient' | 'doctor';
  isOpen: boolean;
  onClose: () => void;
}

const MessagingCenter: React.FC<MessagingCenterProps> = ({
  recipientId,
  recipientName,
  recipientType,
  isOpen,
  onClose
}) => {
  const { user, userType } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [messageType, setMessageType] = useState<'general' | 'treatment_update' | 'activity_assignment' | 'emergency'>('general');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && userType && isOpen) {
      const messagingUserType = userType === 'user' ? 'patient' : userType as 'mentor' | 'doctor';
      const userMessages = messagingService.getMessagesForUser(user.id, messagingUserType);
      
      // Filter messages for specific conversation if recipient is specified
      if (recipientId) {
        const conversationMessages = userMessages.filter(msg => 
          (msg.senderId === user.id && msg.recipientId === recipientId) ||
          (msg.senderId === recipientId && msg.recipientId === user.id)
        );
        setMessages(conversationMessages);
      } else {
        setMessages(userMessages);
      }

      // Subscribe to message updates
      const unsubscribe = messagingService.subscribeToMessages((updatedMessages) => {
        const filtered = updatedMessages.filter(m => 
          (m.recipientId === user.id && m.recipientType === messagingUserType) ||
          (m.senderId === user.id && m.senderType === messagingUserType)
        );
        
        if (recipientId) {
          const conversationMessages = filtered.filter(msg => 
            (msg.senderId === user.id && msg.recipientId === recipientId) ||
            (msg.senderId === recipientId && msg.recipientId === user.id)
          );
          setMessages(conversationMessages);
        } else {
          setMessages(filtered);
        }
      });

      return unsubscribe;
    }
  }, [user, userType, isOpen, recipientId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !userType || !recipientId || !recipientType) return;

    setLoading(true);
    try {
      const messagingUserType = userType === 'user' ? 'patient' : userType as 'mentor' | 'doctor';
      
      await messagingService.sendMessage({
        senderId: user.id,
        senderName: user.name,
        senderType: messagingUserType,
        recipientId,
        recipientType,
        subject: subject || 'Message',
        content: newMessage,
        messageType
      });

      setNewMessage('');
      setSubject('');
      setMessageType('general');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'treatment_update': return <DoctorIcon className="text-blue-500" />;
      case 'activity_assignment': return <PriorityIcon className="text-green-500" />;
      case 'emergency': return <PriorityIcon className="text-red-500" />;
      default: return <MessageIcon className="text-gray-500" />;
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'mentor': return <MentorIcon className="text-purple-500" />;
      case 'doctor': return <DoctorIcon className="text-blue-500" />;
      case 'patient': return <PersonIcon className="text-green-500" />;
      default: return <PersonIcon className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageIcon className="text-2xl" />
              <div>
                <h2 className="text-xl font-bold">
                  {recipientName ? `Chat with ${recipientName}` : 'Messages'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {recipientType && `${recipientType.charAt(0).toUpperCase() + recipientType.slice(1)}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <MessageIcon className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-lg">No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div className={`p-4 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {getUserTypeIcon(message.senderType)}
                          <span className="font-semibold text-sm">{message.senderName}</span>
                          {getMessageTypeIcon(message.messageType)}
                        </div>
                        {message.subject !== 'Message' && (
                          <h4 className="font-semibold mb-2">{message.subject}</h4>
                        )}
                        <p className="leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          {recipientId && (
            <div className="border-t bg-gray-50 p-6">
              <div className="space-y-4">
                {/* Message Type and Subject */}
                <div className="flex space-x-4">
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General Message</option>
                    <option value="treatment_update">Treatment Update</option>
                    <option value="activity_assignment">Activity Assignment</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Subject (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Message Input */}
                <div className="flex space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SendIcon />
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessagingCenter;
