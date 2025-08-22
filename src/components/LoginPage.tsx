import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Person as PersonIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import UserLoginForm from './UserLoginForm';
import MentorLoginForm from './MentorLoginForm';

const LoginPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<'user' | 'mentor' | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleUserTypeSelect = (userType: 'user' | 'mentor') => {
    setSelectedUserType(userType);
    setShowLoginForm(true);
  };

  const handleBackToSelection = () => {
    setShowLoginForm(false);
    setSelectedUserType(null);
  };

  // Show appropriate login form
  if (showLoginForm && selectedUserType === 'user') {
    return <UserLoginForm onBack={handleBackToSelection} />;
  }

  if (showLoginForm && selectedUserType === 'mentor') {
    return <MentorLoginForm onBack={handleBackToSelection} />;
  }

  const userTypeOptions = [
    {
      type: 'user' as const,
      title: 'User',
      description: 'I need support and guidance for my recovery journey',
      icon: PersonIcon,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },

    {
      type: 'mentor' as const,
      title: 'Mentor',
      description: 'I want to help and monitor patient progress',
      icon: PsychologyIcon,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full"
        />
      </div>

      {/* Centered Layout Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full relative z-10"
      >
        {/* Enhanced Logo and Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 0px rgba(255,255,255,0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-3xl font-bold"
            >
              N
            </motion.span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            Welcome to Nivaran
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Your journey to recovery starts here. Choose your role to continue with personalized support.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center items-center space-x-6 mt-6"
          >
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              24/7 Support
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Secure & Private
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              Expert Guidance
            </div>
          </motion.div>
        </div>

        {/* User Type Selection */}
        <div className="space-y-6 mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-2xl font-bold text-gray-800 text-center mb-8"
          >
            Choose your role
          </motion.h2>

          {userTypeOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isSelected = selectedUserType === option.type;

            return (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-purple-300' : ''
                }`}
                onClick={() => handleUserTypeSelect(option.type)}
              >
                <div className={`
                  bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 transition-all duration-300
                  ${isSelected
                    ? 'border-purple-500 shadow-2xl bg-gradient-to-r from-purple-50 to-pink-50'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }
                `}>
                  <div className="flex items-center space-x-6">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color}
                        flex items-center justify-center transition-all duration-300 shadow-lg
                        ${isSelected ? `bg-gradient-to-r ${option.hoverColor} shadow-xl` : ''}
                      `}
                    >
                      <IconComponent className="text-white text-2xl" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {option.type === 'user' ? 'Get personalized support' : 'Monitor patient progress'}
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Click on your role above to proceed with detailed registration or login
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h4 className="text-lg font-bold text-blue-800">New to Nivaran?</h4>
            </div>
            <p className="text-blue-700 font-medium mb-4">
              You'll be able to create an account after selecting your role.
              Our secure registration process ensures your privacy and safety.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Quick Setup
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Secure Process
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                Immediate Access
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            By continuing, you agree to our
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"> Terms of Service</span> and
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"> Privacy Policy</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
