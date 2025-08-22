import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Login as LoginIcon
} from '@mui/icons-material';

interface UserLoginFormProps {
  onBack: () => void;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    relationshipType: '',
    relationshipName: '',
    relationshipPhone: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { login } = useAuth();
  const { addUserProfile } = useAppData();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.age) {
        newErrors.age = 'Age is required';
      } else if (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
        newErrors.age = 'Please enter a valid age';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.emergencyContact) {
        newErrors.emergencyContact = 'Emergency contact name is required';
      }
      if (!formData.emergencyPhone) {
        newErrors.emergencyPhone = 'Emergency contact phone is required';
      }
      if (!formData.relationshipType) {
        newErrors.relationshipType = 'Relationship type is required';
      }
      if (!formData.relationshipName) {
        newErrors.relationshipName = 'Support person name is required';
      }
      if (!formData.relationshipPhone) {
        newErrors.relationshipPhone = 'Support person phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add user profile if it's a new registration
    if (!isLogin) {
      addUserProfile({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        relationshipType: formData.relationshipType,
        relationshipName: formData.relationshipName,
        relationshipPhone: formData.relationshipPhone,
        riskLevel: null // Will be set after quiz
      });
    }

    login('user', {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email
    });

    navigate('/quiz');
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors mr-3"
          >
            <ArrowBackIcon />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Join Nivaran'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your recovery journey' : 'Start your recovery journey today'}
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
          layout
        >
          <div className="space-y-6">
            {/* Name (Sign up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Additional fields for sign up */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Age and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.age ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                </div>

                {/* Relationship Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Support Person Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship Type
                    </label>
                    <select
                      value={formData.relationshipType}
                      onChange={(e) => handleInputChange('relationshipType', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.relationshipType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select relationship</option>
                      <option value="friend">Friend</option>
                      <option value="spouse">Spouse/Partner</option>
                      <option value="guardian">Guardian</option>
                      <option value="family">Family Member</option>
                      <option value="others">Others</option>
                    </select>
                    {errors.relationshipType && <p className="text-red-500 text-sm mt-1">{errors.relationshipType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Person Name
                    </label>
                    <input
                      type="text"
                      value={formData.relationshipName}
                      onChange={(e) => handleInputChange('relationshipName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.relationshipName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Support person's name"
                    />
                    {errors.relationshipName && <p className="text-red-500 text-sm mt-1">{errors.relationshipName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Person Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.relationshipPhone}
                      onChange={(e) => handleInputChange('relationshipPhone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.relationshipPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Support person's phone"
                    />
                    {errors.relationshipPhone && <p className="text-red-500 text-sm mt-1">{errors.relationshipPhone}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LoginIcon />
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </motion.button>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UserLoginForm;
