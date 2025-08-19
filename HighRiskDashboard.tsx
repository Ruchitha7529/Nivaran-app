import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  LocalHospital as DoctorIcon,
  Emergency as EmergencyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const HighRiskDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);

  useEffect(() => {
    // Simulate sending emergency alert
    const sendEmergencyAlert = () => {
      console.log('🚨 EMERGENCY ALERT SENT 🚨');
      console.log('SMS sent to emergency contact: +1-XXX-XXX-XXXX');
      console.log('Email sent to: emergency@nivaran.com');
      setEmergencyAlertSent(true);
    };

    // Send alert after 2 seconds
    const timer = setTimeout(sendEmergencyAlert, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardCards = [
    {
      title: 'Immediate Medical Support',
      description: 'Connect with doctors immediately for urgent care',
      icon: DoctorIcon,
      color: 'from-red-600 to-red-700',
      action: () => navigate('/doctors'),
      buttonText: 'Find Doctors Now',
      priority: 'urgent'
    },
    {
      title: 'Crisis Chatbot',
      description: 'Get immediate support from our specialized crisis AI',
      icon: ChatIcon,
      color: 'from-purple-600 to-purple-700',
      action: () => navigate('/chatbot'),
      buttonText: 'Get Help Now',
      priority: 'urgent'
    },
    {
      title: 'Recovery Plan',
      description: 'Access your intensive recovery program',
      icon: AssignmentIcon,
      color: 'from-blue-600 to-blue-700',
      action: () => navigate('/recovery-plan'),
      buttonText: 'View Plan',
      priority: 'high'
    }
  ];

  const emergencyContacts = [
    {
      name: 'Crisis Helpline',
      number: '1-800-273-8255',
      description: '24/7 Crisis Support',
      icon: PhoneIcon
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate Emergency',
      icon: EmergencyIcon
    }
  ];

  const stats = [
    {
      label: 'Days in Recovery',
      value: '7',
      icon: TrendingUpIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Progress',
      value: '30%',
      icon: TrendingUpIcon,
      color: 'text-red-600'
    },
    {
      label: 'Urgent Appointments',
      value: '3',
      icon: ScheduleIcon,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Immediate Support Available, {user?.name}</h1>
                <p className="text-sm text-gray-600">We're here to help you through this critical time</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <NotificationsIcon />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Level Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
            <EmergencyIcon className="mr-2" />
            <span className="font-semibold">High Risk Level - Immediate Support Needed</span>
          </div>
        </motion.div>

        {/* Emergency Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg"
        >
          <div className="flex items-start">
            <EmergencyIcon className="text-red-500 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Support Activated</h3>
              {emergencyAlertSent ? (
                <div className="space-y-2">
                  <p className="text-red-700">✅ Emergency notification sent to your support network</p>
                  <p className="text-red-700">✅ SMS alert sent to emergency contact</p>
                  <p className="text-red-700">✅ Email notification sent to crisis team</p>
                </div>
              ) : (
                <p className="text-red-700">Sending emergency notifications to your support network...</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {emergencyContacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                    <a 
                      href={`tel:${contact.number}`}
                      className="text-red-600 font-bold text-lg hover:text-red-700"
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <IconComponent className={`text-3xl ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            const isUrgent = card.priority === 'urgent';
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-lg p-8 ${isUrgent ? 'ring-2 ring-red-300 animate-pulse-slow' : ''}`}
              >
                {isUrgent && (
                  <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mb-4">
                    <span className="font-semibold">URGENT</span>
                  </div>
                )}
                <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={card.action}
                  className={`w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg`}
                >
                  {card.buttonText}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Crisis Support Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">You are not alone - Help is available 24/7 🆘</h2>
          <p className="text-lg opacity-90">
            This is a critical time, but recovery is possible. Our crisis team has been notified and 
            immediate support resources are available. Please reach out for help - you deserve support and care.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HighRiskDashboard;
