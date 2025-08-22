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
  Login as LoginIcon,
  Badge as BadgeIcon,
  School as EducationIcon,
  Work as WorkIcon
} from '@mui/icons-material';

interface MentorLoginFormProps {
  onBack: () => void;
}

const MentorLoginForm: React.FC<MentorLoginFormProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialization: '',
    experience: '',
    institution: '',
    phone: '',
    bio: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { login } = useAuth();
  const { addMentor } = useAppData();
  const navigate = useNavigate();

  const specializations = [
    'Addiction Medicine',
    'Psychiatry',
    'Clinical Psychology',
    'Behavioral Therapy',
    'Family Medicine',
    'Social Work',
    'Counseling Psychology',
    'Substance Abuse Counseling'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.licenseNumber) {
        newErrors.licenseNumber = 'License number is required';
      }
      if (!formData.specialization) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Years of experience is required';
      } else if (parseInt(formData.experience) < 0 || parseInt(formData.experience) > 50) {
        newErrors.experience = 'Please enter valid years of experience';
      }
      if (!formData.institution) {
        newErrors.institution = 'Institution/Organization is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call with verification process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add mentor to the system if it's a new registration
    if (!isLogin) {
      addMentor({
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        licenseNumber: formData.licenseNumber,
        institution: formData.institution,
        phone: formData.phone,
        bio: formData.bio,
        consultationFee: 150 + parseInt(formData.experience) * 5 // Fee based on experience
      });
    }

    login('mentor', {
      name: formData.name || 'Dr. ' + formData.email.split('@')[0],
      email: formData.email
    });

    navigate('/mentor-dashboard');
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
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
              {isLogin ? 'Mentor Portal' : 'Join as Mentor'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Access your mentor dashboard' : 'Help others on their recovery journey'}
            </p>
          </div>
        </div>

        {/* Verification Notice */}
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg"
          >
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> All mentor applications are subject to verification of credentials and background checks for patient safety.
            </p>
          </motion.div>
        )}

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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Dr. John Smith"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Email
              </label>
              <div className="relative">
                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="doctor@hospital.com"
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
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Secure password (min 8 characters)"
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* License Number and Specialization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <div className="relative">
                      <BadgeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="License #"
                      />
                    </div>
                    {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.specialization ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                  </div>
                </div>

                {/* Experience and Institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.experience ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Years"
                      min="0"
                      max="50"
                    />
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Professional phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution/Organization
                  </label>
                  <div className="relative">
                    <WorkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Hospital, Clinic, or Organization"
                    />
                  </div>
                  {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio (Optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of your experience and approach to addiction recovery..."
                  />
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
            className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LoginIcon />
                <span>{isLogin ? 'Sign In' : 'Submit Application'}</span>
              </>
            )}
          </motion.button>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {isLogin ? "New mentor? Apply here" : "Already registered? Sign in"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default MentorLoginForm;
