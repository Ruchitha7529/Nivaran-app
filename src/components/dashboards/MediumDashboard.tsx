import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../NotificationCenter';
import { recoveryPlanService, RecoveryPlan } from '../../services/RecoveryPlanService';
import RecoveryPlanDisplay from '../RecoveryPlanDisplay';
import {
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  LocalHospital as DoctorIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const MediumDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);

  useEffect(() => {
    if (user) {
      // Load recovery plan
      let plan = recoveryPlanService.getRecoveryPlan(user.id);

      // If no plan exists, create a default one
      if (!plan) {
        plan = recoveryPlanService.createRecoveryPlan(user.id, 'medium');
      }

      setRecoveryPlan(plan);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardCards = [
    {
      title: 'Connect with Doctors',
      description: 'Get professional medical support and guidance',
      icon: DoctorIcon,
      color: 'from-red-500 to-red-600',
      action: () => navigate('/doctors'),
      buttonText: 'Find Doctors',
      priority: 'high'
    },
    {
      title: 'AI Chatbot Support',
      description: 'Get instant support and guidance from our AI assistant',
      icon: ChatIcon,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/chatbot'),
      buttonText: 'Start Chat',
      priority: 'medium'
    },
    {
      title: 'Recovery Plan',
      description: 'Follow your personalized recovery activities and track progress',
      icon: AssignmentIcon,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/recovery-plan'),
      buttonText: 'View Plan',
      priority: 'medium'
    }
  ];

  const stats = [
    {
      label: 'Days in Recovery',
      value: '23',
      icon: TrendingUpIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Progress',
      value: '65%',
      icon: TrendingUpIcon,
      color: 'text-yellow-600'
    },
    {
      label: 'Doctor Consultations',
      value: '2',
      icon: DoctorIcon,
      color: 'text-red-600'
    },
    {
      label: 'Upcoming Appointments',
      value: '1',
      icon: ScheduleIcon,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-gray-600">Let's continue your recovery journey together</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
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
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
            <WarningIcon className="mr-2" />
            <span className="font-semibold">Medium Risk Level</span>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg"
        >
          <div className="flex items-start">
            <WarningIcon className="text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Professional Support Recommended</h3>
              <p className="text-yellow-700">
                Your assessment indicates you would benefit from professional medical support. 
                We strongly recommend connecting with one of our qualified doctors for personalized guidance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            const isHighPriority = card.priority === 'high';
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-lg p-8 ${isHighPriority ? 'ring-2 ring-red-200' : ''}`}
              >
                {isHighPriority && (
                  <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mb-4">
                    <span className="font-semibold">Priority</span>
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

        {/* Recovery Plan Section */}
        {recoveryPlan && (
          <RecoveryPlanDisplay
            recoveryPlan={recoveryPlan}
            className="mb-6"
          />
        )}

        {/* Support Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">You're not alone in this journey 💪</h2>
          <p className="text-lg opacity-90">
            Your assessment shows you need additional support. Our medical professionals and AI assistant 
            are here to help you navigate this challenging time. Take it one day at a time.
          </p>
        </motion.div>

        {/* Action Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Next Steps</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-gray-600">Schedule a consultation with a qualified doctor</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-gray-600">Use the AI chatbot for daily support and guidance</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-gray-600">Follow your personalized recovery plan consistently</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MediumDashboard;
