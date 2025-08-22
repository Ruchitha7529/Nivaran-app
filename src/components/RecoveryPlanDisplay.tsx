import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RecoveryPlan } from '../services/RecoveryPlanService';
import {
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface RecoveryPlanDisplayProps {
  recoveryPlan: RecoveryPlan;
  className?: string;
}

const RecoveryPlanDisplay: React.FC<RecoveryPlanDisplayProps> = ({
  recoveryPlan,
  className = ""
}) => {
  const navigate = useNavigate();
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelGradient = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'high': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-gradient-to-r ${getRiskLevelGradient(recoveryPlan.riskLevel)} rounded-2xl flex items-center justify-center mr-4`}>
            <AssignmentIcon className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Your Recovery Plan</h2>
            <p className="text-gray-600 text-sm">
              Created: {recoveryPlan.createdDate} • Phase: {recoveryPlan.phase}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskLevelColor(recoveryPlan.riskLevel)}`}>
          {recoveryPlan.riskLevel.toUpperCase()} RISK
        </div>
      </div>

      {/* Goals and Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Goals */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center">
            <TrendingUpIcon className="mr-2" />
            Recovery Goals
          </h3>
          <ul className="space-y-2">
            {recoveryPlan.goals.slice(0, 3).map((goal, index) => (
              <li key={index} className="text-blue-700 text-sm flex items-start">
                <CheckCircleIcon className="mr-2 mt-0.5 text-xs flex-shrink-0" />
                <span>{goal.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activities */}
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center">
            <FavoriteIcon className="mr-2" />
            Daily Activities
          </h3>
          <ul className="space-y-2">
            {recoveryPlan.activities.slice(0, 3).map((activity, index) => (
              <li key={index} className="text-purple-700 text-sm flex items-start">
                <SecurityIcon className="mr-2 mt-0.5 text-xs flex-shrink-0" />
                <span>{activity.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Progress Metrics */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <h3 className="font-bold text-indigo-800 mb-3">Progress Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600">
              {recoveryPlan.progressMetrics.sobrietyDays}
            </div>
            <div className="text-xs text-gray-600">Sobriety Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {recoveryPlan.progressMetrics.moodRating}/10
            </div>
            <div className="text-xs text-gray-600">Mood Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-pink-600">
              {recoveryPlan.progressMetrics.energyLevel}/10
            </div>
            <div className="text-xs text-gray-600">Energy Level</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {recoveryPlan.phase.charAt(0).toUpperCase() + recoveryPlan.phase.slice(1)}
            </div>
            <div className="text-xs text-gray-600">Current Phase</div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts for High Risk */}
      {recoveryPlan.riskLevel === 'high' && recoveryPlan.emergencyContacts.length > 0 && (
        <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-3 flex items-center">
            <SecurityIcon className="mr-2" />
            Emergency Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recoveryPlan.emergencyContacts.slice(0, 4).map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-2 border border-red-200">
                <div className="text-red-700 font-medium text-xs">{contact.name}</div>
                <div className="text-red-600 text-xs">{contact.phone}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-red-100 rounded-lg">
            <p className="text-red-800 text-xs font-medium">
              🚨 Emergency contacts have been notified. Immediate support is available.
            </p>
          </div>
        </div>
      )}

      {/* View Full Plan Button */}
      <div className="mt-6 text-center">
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2">
            Get detailed activities, progress tracking, and personalized guidance
          </p>
        </div>
        <button
          onClick={() => navigate('/recovery-plan')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          📋 View Full Recovery Plan
        </button>
      </div>
    </motion.div>
  );
};

export default RecoveryPlanDisplay;
