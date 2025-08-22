import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../NotificationCenter';
import DoctorSelection from '../DoctorSelection';
import { recoveryPlanService, RecoveryPlan, RecoveryActivity } from '../../services/RecoveryPlanService';
import { messagingService } from '../../services/MessagingService';
import EmergencyTestButton from '../EmergencyTestButton';
import RecoveryPlanDisplay from '../RecoveryPlanDisplay';
import {
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Psychology as PsychologyIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  LocalHospital as DoctorIcon
} from '@mui/icons-material';

const SafeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [todayActivities, setTodayActivities] = useState<RecoveryActivity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      // Load recovery plan
      let plan = recoveryPlanService.getRecoveryPlan(user.id);
      console.log('Loading recovery plan for user:', user.id, 'Plan found:', plan);

      // If no plan exists, create a default one
      if (!plan) {
        console.log('No plan found, creating default safe plan');
        plan = recoveryPlanService.createRecoveryPlan(user.id, 'safe');
        console.log('Created default recovery plan:', plan);
      }

      setRecoveryPlan(plan);

      if (plan) {
        // Get today's activities
        const activities = plan.activities.filter(activity =>
          activity.type === 'daily' ||
          activity.frequency.toLowerCase().includes('daily')
        );
        setTodayActivities(activities);

        // Load completed activities from localStorage
        const completed = localStorage.getItem(`completed_activities_${user.id}`);
        if (completed) {
          setCompletedActivities(JSON.parse(completed));
        }
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDoctorSelected = (doctor: any) => {
    setSelectedDoctor(doctor);
    // You could also save this to the patient's profile
    console.log('Doctor selected:', doctor);
  };

  const handleActivityComplete = (activityId: string) => {
    if (!user) return;

    const newCompleted = [...completedActivities, activityId];
    setCompletedActivities(newCompleted);
    localStorage.setItem(`completed_activities_${user.id}`, JSON.stringify(newCompleted));

    // Update the activity in the recovery plan
    if (recoveryPlan) {
      const updatedPlan = {
        ...recoveryPlan,
        activities: recoveryPlan.activities.map(activity =>
          activity.id === activityId
            ? { ...activity, isCompleted: true, completedDate: new Date().toISOString() }
            : activity
        )
      };
      setRecoveryPlan(updatedPlan);
      recoveryPlanService.updateRecoveryPlan(user.id, updatedPlan);
    }

    // Notify doctor if one is selected
    if (selectedDoctor) {
      const activity = todayActivities.find(a => a.id === activityId);
      if (activity) {
        messagingService.sendMessage({
          senderId: user.id,
          senderName: user.name,
          senderType: 'patient',
          recipientId: selectedDoctor.id,
          recipientType: 'doctor',
          subject: 'Activity Completed',
          content: `I have completed the activity: "${activity.title}". This was a ${activity.difficulty} level ${activity.category} activity.`,
          messageType: 'general'
        });
      }
    }
  };

  const getActivityProgress = () => {
    if (todayActivities.length === 0) return 0;
    const completed = todayActivities.filter(activity =>
      completedActivities.includes(activity.id)
    ).length;
    return Math.round((completed / todayActivities.length) * 100);
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
    },
    {
      title: 'Select Your Doctor',
      description: 'Choose a healthcare professional to guide your recovery journey and provide expert support',
      icon: DoctorIcon,
      color: 'from-purple-500 to-pink-600',
      action: () => setShowDoctorSelection(true),
      buttonText: selectedDoctor ? `Dr. ${selectedDoctor.name}` : 'Choose Doctor'
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 relative overflow-hidden">
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
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full"
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
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-full"
        />
      </div>

      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <PsychologyIcon className="text-white text-2xl" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                  Welcome back, {user?.name}! 🌟
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 flex items-center"
                >
                  <FavoriteIcon className="mr-1 text-green-400 text-sm" />
                  You're doing amazing on your recovery journey • {currentTime.toLocaleTimeString()}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <SecurityIcon className="text-green-600 text-sm" />
                <span className="text-sm font-medium text-green-700">Safe Zone</span>
              </motion.div>
              <NotificationCenter />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all duration-200"
              >
                <LogoutIcon className="text-sm" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Enhanced Risk Level Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 text-green-800 rounded-2xl shadow-lg border border-green-200"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <CheckCircleIcon className="text-2xl" />
            </motion.div>
            <div className="text-left">
              <div className="font-bold text-lg">Safe Risk Level</div>
              <div className="text-sm opacity-80">You're in a stable recovery phase</div>
            </div>
            <div className="ml-4 flex space-x-1">
              {[1,2,3,4,5].map((star) => (
                <StarIcon key={star} className="text-yellow-400 text-lg" />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(parseInt(stat.value) * 8, 100)}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          stat.color.includes('green') ? 'from-green-400 to-emerald-600' :
                          stat.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                          'from-purple-400 to-purple-600'
                        }`}
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ml-6 ${
                      stat.color.includes('green') ? 'bg-gradient-to-r from-green-100 to-emerald-200' :
                      stat.color.includes('blue') ? 'bg-gradient-to-r from-blue-100 to-blue-200' :
                      'bg-gradient-to-r from-purple-100 to-purple-200'
                    }`}
                  >
                    <IconComponent className={`text-3xl ${stat.color}`} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Main Action Cards - Horizontal Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                >
                  <IconComponent className="text-white text-2xl" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{card.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={card.action}
                  className={`w-full py-3 px-4 bg-gradient-to-r ${card.color} text-white rounded-2xl font-bold text-sm transition-all duration-300 hover:shadow-xl flex items-center justify-center space-x-2`}
                >
                  <span>{card.buttonText}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Today's Activities Section */}
        {todayActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Today's Activities</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Progress: {getActivityProgress()}%
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${getActivityProgress()}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayActivities.map((activity, index) => {
                const isCompleted = completedActivities.includes(activity.id);
                const categoryColors = {
                  mental_health: 'from-purple-500 to-pink-500',
                  physical_health: 'from-green-500 to-blue-500',
                  social: 'from-yellow-500 to-orange-500',
                  educational: 'from-blue-500 to-indigo-500',
                  spiritual: 'from-indigo-500 to-purple-500',
                  medical: 'from-red-500 to-pink-500'
                };

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${categoryColors[activity.category]} flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">
                          {activity.category.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {isCompleted && (
                        <CheckCircleIcon className="text-green-500" />
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{activity.duration}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        activity.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        activity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {activity.difficulty}
                      </span>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleActivityComplete(activity.id)}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300"
                      >
                        Complete Activity (+{activity.points} pts)
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-center text-green-600 font-medium text-sm">
                        ✅ Completed! +{activity.points} points
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {selectedDoctor && (
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <DoctorIcon className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Your doctor Dr. {selectedDoctor.name} will be notified when you complete activities
                    </p>
                    <p className="text-xs text-blue-600">
                      Keep up the great work! Your progress is being monitored.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Recovery Plan Section */}
        {recoveryPlan && (
          <RecoveryPlanDisplay
            recoveryPlan={recoveryPlan}
            className="mb-10"
          />
        )}

        {/* Enhanced Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-3xl p-10 text-white text-center shadow-2xl mb-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-6"
          >
            🌟
          </motion.div>
          <h2 className="text-3xl font-bold mb-6">You're Absolutely Crushing It!</h2>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
            Your assessment shows you're in a safe zone and thriving in your recovery journey.
            Keep up the incredible work with your recovery activities and remember -
            we're here to support you every step of the way!
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex justify-center items-center space-x-6 mt-8"
          >
            <div className="flex items-center text-white/80">
              <TrophyIcon className="mr-2" />
              <span className="font-semibold">Achievement Unlocked</span>
            </div>
            <div className="flex items-center text-white/80">
              <ScheduleIcon className="mr-2" />
              <span className="font-semibold">Consistent Progress</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
              <StarIcon className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Daily Tips for Continued Success</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🧘', title: 'Mindfulness', tip: 'Practice mindfulness for 10 minutes each morning to center yourself', color: 'from-green-400 to-green-600' },
              { icon: '🤝', title: 'Connection', tip: 'Stay connected with your support network and share your progress', color: 'from-blue-400 to-blue-600' },
              { icon: '🎉', title: 'Celebration', tip: 'Celebrate small victories and acknowledge your growth', color: 'from-purple-400 to-purple-600' }
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{tip.icon}</div>
                  <h4 className="font-bold text-gray-800 text-lg">{tip.title}</h4>
                </div>
                <p className="text-gray-600 text-center leading-relaxed">{tip.tip}</p>
                <div className={`w-full h-1 bg-gradient-to-r ${tip.color} rounded-full mt-4`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Doctor Selection Modal */}
      <DoctorSelection
        isOpen={showDoctorSelection}
        onClose={() => setShowDoctorSelection(false)}
        onDoctorSelected={handleDoctorSelected}
      />

      {/* Emergency Test Button (for testing purposes) */}
      <EmergencyTestButton />
    </div>
  );
};

export default SafeDashboard;
