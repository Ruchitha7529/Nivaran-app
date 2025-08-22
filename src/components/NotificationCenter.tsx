import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { messagingService, Notification, Message } from '../services/MessagingService';
import { emergencyNotificationService } from '../services/EmergencyNotificationService';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  LocalHospital as DoctorIcon,
  EmojiEvents as AchievementIcon,
  Warning as AlertIcon,
  Circle as CircleIcon,
  Emergency as EmergencyIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon
} from '@mui/icons-material';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const { user, userType } = useAuth();

  useEffect(() => {
    if (user && userType) {
      // Convert userType to messaging service format
      const messagingUserType = userType === 'user' ? 'patient' : userType as 'mentor' | 'doctor';

      // Load initial notifications and messages
      const userNotifications = messagingService.getNotificationsForUser(user.id, messagingUserType);
      const userMessages = messagingService.getMessagesForUser(user.id, messagingUserType);
      setNotifications(userNotifications);
      setMessages(userMessages);

      // Load emergency notifications for mentors/doctors
      if (userType === 'mentor' || userType === 'doctor') {
        const emergencyNotifications = emergencyNotificationService.getAllNotifications();
        setEmergencyAlerts(emergencyNotifications);

        // Add emergency notifications to regular notifications
        const emergencyAsNotifications: Notification[] = emergencyNotifications.map(emergency => ({
          id: `emergency-${emergency.id}`,
          userId: user.id,
          userType: messagingUserType as 'mentor' | 'patient' | 'doctor',
          type: 'emergency',
          title: `🚨 Emergency Alert: ${emergency.userName}`,
          message: `High-risk user detected. Status: ${emergency.status}. Time: ${new Date(emergency.timestamp).toLocaleString()}`,
          timestamp: emergency.timestamp,
          isRead: false,
          priority: 'high' as const
        }));

        setNotifications(prev => [...emergencyAsNotifications, ...prev]);
      }

      // Subscribe to real-time updates
      const unsubscribeNotifications = messagingService.subscribeToNotifications((updatedNotifications) => {
        const filtered = updatedNotifications.filter(n => n.userId === user.id && n.userType === messagingUserType);
        setNotifications(filtered);
      });

      const unsubscribeMessages = messagingService.subscribeToMessages((updatedMessages) => {
        const filtered = updatedMessages.filter(m =>
          (m.recipientId === user.id && m.recipientType === messagingUserType) ||
          (m.senderId === user.id && m.senderType === messagingUserType)
        );
        setMessages(filtered);
      });

      return () => {
        unsubscribeNotifications();
        unsubscribeMessages();
      };
    }
  }, [user, userType]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return DoctorIcon;
      case 'reminder': return ScheduleIcon;
      case 'achievement': return AchievementIcon;
      case 'alert': return AlertIcon;
      case 'emergency': return EmergencyIcon;
      case 'sms': return SmsIcon;
      case 'phone': return PhoneIcon;
      default: return NotificationsIcon;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'text-blue-500 bg-blue-100';
      case 'reminder': return 'text-yellow-500 bg-yellow-100';
      case 'achievement': return 'text-green-500 bg-green-100';
      case 'alert': return 'text-red-500 bg-red-100';
      case 'emergency': return 'text-red-600 bg-red-200 animate-pulse';
      case 'sms': return 'text-purple-500 bg-purple-100';
      case 'phone': return 'text-indigo-500 bg-indigo-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    messagingService.markNotificationAsRead(notificationId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative"
        >
          <NotificationsIcon />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <NotificationsIcon className="text-6xl mb-4 opacity-50" />
                    <p className="text-lg font-medium">No notifications</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification: Notification) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ backgroundColor: '#f8fafc' }}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 border-b cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                              <IconComponent className="text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <CircleIcon className="text-blue-500 text-xs" />
                                )}
                              </div>
                              <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      notifications.forEach((n: Notification) => {
                        if (!n.isRead) messagingService.markNotificationAsRead(n.id);
                      });
                    }}
                    className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
