import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { recoveryActivities } from '../data/staticData';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Schedule as ScheduleIcon,
  SelfImprovement as MeditationIcon,
  Psychology as TherapyIcon,
  FitnessCenter as ExerciseIcon,
  School as EducationIcon,
  TrendingUp as ProgressIcon,
  Alarm as AlarmIcon,
  Add as AddIcon
} from '@mui/icons-material';

const RecoveryPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { riskLevel } = useAuth();
  const [activities, setActivities] = useState(recoveryActivities);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'therapy', 'exercise', 'meditation', 'education'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'therapy': return TherapyIcon;
      case 'exercise': return ExerciseIcon;
      case 'meditation': return MeditationIcon;
      case 'education': return EducationIcon;
      default: return ScheduleIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'therapy': return 'from-purple-500 to-purple-600';
      case 'exercise': return 'from-green-500 to-green-600';
      case 'meditation': return 'from-blue-500 to-blue-600';
      case 'education': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  const completedActivities = activities.filter(activity => activity.completed).length;
  const totalActivities = activities.length;
  const progressPercentage = (completedActivities / totalActivities) * 100;

  const toggleActivityCompletion = (activityId: number) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  const setReminder = (activityId: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      // Simulate setting a reminder
      alert(`Reminder set for "${activity.title}" at ${activity.scheduledTime || 'a custom time'}`);
      console.log(`🔔 Reminder set for: ${activity.title}`);
    }
  };

  const getPriorityMessage = () => {
    switch (riskLevel) {
      case 'high':
        return {
          message: "Your recovery plan is critical for your wellbeing. Please prioritize therapy sessions and reach out for support.",
          color: "bg-red-50 border-red-500 text-red-800"
        };
      case 'medium':
        return {
          message: "Consistency with your recovery activities will help strengthen your progress. Focus on daily habits.",
          color: "bg-yellow-50 border-yellow-500 text-yellow-800"
        };
      case 'safe':
        return {
          message: "Great job maintaining your recovery! Keep up with your activities to stay on track.",
          color: "bg-green-50 border-green-500 text-green-800"
        };
      default:
        return {
          message: "Follow your personalized recovery plan for the best outcomes.",
          color: "bg-blue-50 border-blue-500 text-blue-800"
        };
    }
  };

  const priorityInfo = getPriorityMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Recovery Plan</h1>
                <p className="text-sm text-gray-600">Your personalized path to wellness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Priority Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-l-4 p-6 rounded-r-lg mb-8 ${priorityInfo.color}`}
        >
          <p className="font-medium">{priorityInfo.message}</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Progress Overview</h2>
            <div className="flex items-center space-x-2">
              <ProgressIcon className="text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{completedActivities}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{totalActivities - completedActivities}</p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{totalActivities}</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Activities' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activities List */}
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => {
            const IconComponent = getCategoryIcon(activity.category);
            const categoryColor = getCategoryColor(activity.category);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                  activity.completed ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Category Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="text-white text-xl" />
                    </div>
                    
                    {/* Activity Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {activity.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          activity.category === 'therapy' ? 'bg-purple-100 text-purple-800' :
                          activity.category === 'exercise' ? 'bg-green-100 text-green-800' :
                          activity.category === 'meditation' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.category}
                        </span>
                      </div>
                      
                      <p className={`text-gray-600 mb-3 ${activity.completed ? 'line-through' : ''}`}>
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>⏱️ {activity.duration} minutes</span>
                        {activity.scheduledTime && (
                          <span>🕐 {activity.scheduledTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {activity.scheduledTime && !activity.completed && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setReminder(activity.id)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Set Reminder"
                      >
                        <AlarmIcon />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleActivityCompletion(activity.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        activity.completed
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {activity.completed ? <CheckCircleIcon /> : <UncheckedIcon />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Custom Activity Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <AddIcon />
            <span>Add Custom Activity</span>
          </motion.button>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">💪 Keep Going!</h2>
          <p className="text-lg opacity-90">
            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
          </p>
          <p className="text-sm opacity-75 mt-2">- Recovery Wisdom</p>
        </motion.div>
      </div>
    </div>
  );
};

export default RecoveryPlanPage;
