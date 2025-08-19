import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Person as PersonIcon, 
  Psychology as PsychologyIcon,
  Login as LoginIcon 
} from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<'user' | 'mentor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!selectedUserType) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login(selectedUserType);
    
    if (selectedUserType === 'user') {
      navigate('/quiz');
    } else {
      navigate('/mentor-dashboard');
    }
    
    setIsLoading(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">N</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nivaran</h1>
          <p className="text-gray-600">Your journey to recovery starts here</p>
        </div>

        {/* User Type Selection */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Choose your role
          </h2>
          
          {userTypeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedUserType === option.type;
            
            return (
              <motion.div
                key={option.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedUserType(option.type)}
              >
                <div className={`
                  bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 shadow-xl' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                  }
                `}>
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} 
                      flex items-center justify-center transition-all duration-200
                      ${isSelected ? `bg-gradient-to-r ${option.hoverColor}` : ''}
                    `}>
                      <IconComponent className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: selectedUserType ? 1.02 : 1 }}
          whileTap={{ scale: selectedUserType ? 0.98 : 1 }}
          disabled={!selectedUserType || isLoading}
          onClick={handleLogin}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200
            flex items-center justify-center space-x-2
            ${selectedUserType && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LoginIcon />
              <span>Continue</span>
            </>
          )}
        </motion.button>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
