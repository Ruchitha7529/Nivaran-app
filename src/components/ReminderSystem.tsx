import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Notifications as NotificationIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  LocalHospital as DoctorIcon,
  Assignment as ActivityIcon
} from '@mui/icons-material';

interface Reminder {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'activity' | 'medication';
  scheduledTime: Date;
  isActive: boolean;
}

interface ReminderNotificationProps {
  reminder: Reminder;
  onDismiss: (id: string) => void;
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({ reminder, onDismiss }) => {
  const getIcon = () => {
    switch (reminder.type) {
      case 'appointment': return DoctorIcon;
      case 'activity': return ActivityIcon;
      default: return ScheduleIcon;
    }
  };

  const getColor = () => {
    switch (reminder.type) {
      case 'appointment': return 'from-red-500 to-red-600';
      case 'activity': return 'from-blue-500 to-blue-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const IconComponent = getIcon();
  const colorClass = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 max-w-sm"
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center`}>
          <IconComponent className="text-white text-sm" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{reminder.title}</h4>
          <p className="text-sm text-gray-600">{reminder.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {reminder.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => onDismiss(reminder.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseIcon className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
};

const ReminderSystem: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<Reminder[]>([]);

  useEffect(() => {
    // Initialize sample reminders
    const sampleReminders: Reminder[] = [
      {
        id: '1',
        title: 'Doctor Appointment',
        message: 'Appointment with Dr. Sarah Johnson in 15 minutes',
        type: 'appointment',
        scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        isActive: true
      },
      {
        id: '2',
        title: 'Morning Meditation',
        message: 'Time for your daily meditation session',
        type: 'activity',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        isActive: true
      },
      {
        id: '3',
        title: 'Therapy Session',
        message: 'Individual counseling session starts soon',
        type: 'activity',
        scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        isActive: true
      }
    ];

    setReminders(sampleReminders);
  }, []);

  useEffect(() => {
    // Check for due reminders every minute
    const interval = setInterval(() => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.scheduledTime <= now) {
          // Show notification
          setActiveNotifications(prev => {
            if (!prev.find(n => n.id === reminder.id)) {
              return [...prev, reminder];
            }
            return prev;
          });

          // Request browser notification permission and show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(reminder.title, {
              body: reminder.message,
              icon: '/favicon.ico',
              tag: reminder.id
            });
          } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification(reminder.title, {
                  body: reminder.message,
                  icon: '/favicon.ico',
                  tag: reminder.id
                });
              }
            });
          }

          // Mark reminder as inactive
          setReminders(prev => prev.map(r => 
            r.id === reminder.id ? { ...r, isActive: false } : r
          ));
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const dismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addReminder = (title: string, message: string, type: 'appointment' | 'activity' | 'medication', minutesFromNow: number) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title,
      message,
      type,
      scheduledTime: new Date(Date.now() + minutesFromNow * 60 * 1000),
      isActive: true
    };

    setReminders(prev => [...prev, newReminder]);
    
    // Log the reminder creation
    console.log(`🔔 Reminder set: ${title} in ${minutesFromNow} minutes`);
  };

  // Expose addReminder function globally for other components to use
  useEffect(() => {
    (window as any).addReminder = addReminder;
    return () => {
      delete (window as any).addReminder;
    };
  }, []);

  return (
    <>
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {activeNotifications.map(notification => (
            <ReminderNotification
              key={notification.id}
              reminder={notification}
              onDismiss={dismissNotification}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Reminder Status Indicator (optional) */}
      {reminders.filter(r => r.isActive).length > 0 && (
        <div className="fixed bottom-4 right-4 z-40">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <NotificationIcon className="text-sm" />
              <span className="text-sm font-medium">
                {reminders.filter(r => r.isActive).length} active reminder{reminders.filter(r => r.isActive).length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ReminderSystem;
