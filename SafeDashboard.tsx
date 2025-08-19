import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const SafeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardCards = [
    {
      title: 'AI Chatbot Support',
      description: 'Get instant support and guidance from our AI assistant',
      icon: ChatIcon,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/chatbot'),
      buttonText: 'Start Chat'
    },
    {
      title: 'Recovery Plan',
      description: 'View your personalized recovery activities and track progress',
      icon: AssignmentIcon,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/recovery-plan'),
      buttonText: 'View Plan'
    }
  ];

  const stats = [
    {
      label: 'Days Clean',
      value: '45',
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      label: 'Progress',
      value: '85%',
      icon: TrendingUpIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Activities Completed',
      value: '12',
      icon: AssignmentIcon,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-gray-600">You're doing great on your recovery journey</p>
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
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <CheckCircleIcon className="mr-2" />
            <span className="font-semibold">Safe Risk Level</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
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

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">You're on the right track! 🌟</h2>
          <p className="text-lg opacity-90">
            Your assessment shows you're in a safe zone. Keep up the great work with your recovery activities 
            and don't hesitate to reach out for support when needed.
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Tips for Success</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-600">Practice mindfulness for 10 minutes each morning</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-600">Stay connected with your support network</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-600">Celebrate small victories and progress</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SafeDashboard;
