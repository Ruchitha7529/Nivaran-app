import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { recoveryPlanService, RecoveryPlan } from '../services/RecoveryPlanService';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  TrendingUp as ProgressIcon,
  Schedule as ScheduleIcon,
  Assignment as GoalIcon,
  Favorite as HeartIcon,
  Phone as PhoneIcon,
  LocalHospital as MedicalIcon,
  Psychology as TherapyIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Mood as MoodIcon
} from '@mui/icons-material';

const RecoveryPlanComponent: React.FC = () => {
  const navigate = useNavigate();
  const { user, riskLevel } = useAuth();
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'activities' | 'goals' | 'progress'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecoveryPlan = () => {
      if (user) {
        let plan = recoveryPlanService.getRecoveryPlan(user.id);
        if (!plan) {
          // Create recovery plan if it doesn't exist
          const userRiskLevel = user.riskLevel || riskLevel || 'safe';
          plan = recoveryPlanService.createRecoveryPlan(user.id, userRiskLevel as 'safe' | 'medium' | 'high');
        }
        setRecoveryPlan(plan);
      }
      setLoading(false);
    };

    loadRecoveryPlan();

    // Subscribe to plan updates
    const unsubscribe = recoveryPlanService.subscribe(() => {
      loadRecoveryPlan();
    });

    return unsubscribe;
  }, [user, riskLevel]);

  const handleCompleteActivity = (activityId: string) => {
    if (recoveryPlan) {
      recoveryPlanService.completeActivity(recoveryPlan.id, activityId);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'high': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental_health': return <MoodIcon />;
      case 'physical_health': return <HeartIcon />;
      case 'social': return <TherapyIcon />;
      case 'medical': return <MedicalIcon />;
      default: return <StarIcon />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading Your Recovery Plan...</h2>
        </div>
      </div>
    );
  }

  if (!recoveryPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Recovery Plan Found</h2>
          <p className="text-gray-600">Please complete the assessment to generate your personalized recovery plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Recovery Plan
                </h1>
                <p className="text-gray-600 mt-2">Personalized for {recoveryPlan.riskLevel} risk level</p>
              </div>
            </div>
            <div className={`px-6 py-3 bg-gradient-to-r ${getRiskLevelColor(recoveryPlan.riskLevel)} text-white rounded-2xl shadow-lg`}>
              <span className="font-semibold capitalize">{recoveryPlan.riskLevel} Risk Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: <ProgressIcon /> },
            { id: 'activities', label: 'Activities', icon: <ScheduleIcon /> },
            { id: 'goals', label: 'Goals', icon: <GoalIcon /> },
            { id: 'progress', label: 'Progress', icon: <TrophyIcon /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ProgressIcon className="mr-3 text-blue-500" />
                Progress Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(recoveryPlan.progressMetrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full"
                        style={{ width: `${key === 'sobrietyDays' ? Math.min(value * 3.33, 100) : value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <PhoneIcon className="mr-3 text-red-500" />
                Emergency Contacts
              </h3>
              <div className="space-y-4">
                {recoveryPlan.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                    <div className="font-semibold text-gray-800">{contact.name}</div>
                    <div className="text-red-600 font-mono text-lg">{contact.phone}</div>
                    <div className="text-sm text-gray-600">{contact.relationship}</div>
                    {contact.available24h && (
                      <div className="text-xs text-green-600 font-medium mt-1">24/7 Available</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recoveryPlan.activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      {getCategoryIcon(activity.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.frequency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteActivity(activity.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      activity.isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    {activity.isCompleted ? <CheckCircleIcon /> : <UncheckedIcon />}
                  </button>
                </div>
                
                <p className="text-gray-700 mb-4">{activity.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{activity.duration}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">+{activity.points} pts</span>
                    {activity.streak > 0 && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        🔥 {activity.streak} day streak
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'goals' && (
          <div className="space-y-6">
            {recoveryPlan.goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{goal.title}</h3>
                    <p className="text-gray-600 mb-4">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Target: {goal.targetDate}</span>
                      <span className="capitalize">{goal.category.replace('_', ' ')} term</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{goal.progress}%</div>
                    {goal.isAchieved && (
                      <div className="flex items-center text-green-600">
                        <TrophyIcon className="mr-1" />
                        <span className="font-medium">Achieved!</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Milestones:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {goal.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
                        <CheckCircleIcon className="text-blue-500" />
                        <span className="text-gray-700">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Therapy Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TherapyIcon className="mr-3 text-purple-500" />
                Therapy Sessions
              </h3>
              <div className="space-y-4">
                {recoveryPlan.therapySessions.map((session, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800 capitalize">{session.type} Therapy</span>
                      <span className="text-sm text-purple-600">{session.frequency}</span>
                    </div>
                    <div className="text-gray-700">Therapist: {session.therapistName}</div>
                    {session.nextSession && (
                      <div className="text-sm text-gray-600 mt-1">Next: {session.nextSession}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ScheduleIcon className="mr-3 text-green-500" />
                Weekly Schedule
              </h3>
              <div className="space-y-3">
                {Object.entries(recoveryPlan.weeklySchedule).map(([day, activityIds]) => (
                  <div key={day} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <div className="font-semibold text-gray-800 mb-2">{day}</div>
                    <div className="text-sm text-gray-600">
                      {activityIds.length} activities scheduled
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryPlanComponent;
