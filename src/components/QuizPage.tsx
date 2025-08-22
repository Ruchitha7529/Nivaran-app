import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../data/staticData';
import { recoveryPlanService } from '../services/RecoveryPlanService';
import { emergencyNotificationService } from '../services/EmergencyNotificationService';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setRiskLevel, user } = useAuth();
  const { updateUserProfile } = useAppData();
  const navigate = useNavigate();

  // Limit to first 10 questions only
  const limitedQuestions = quizQuestions.slice(0, 10);
  const currentQuestion = limitedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === limitedQuestions.length - 1;
  const hasAnswered = answers[currentQuestion.id] !== undefined;

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateRiskLevel = () => {
    let totalRiskScore = 0;
    let maxPossibleScore = 0;

  limitedQuestions.forEach(question => {
      const answerIndex = answers[question.id];
      if (answerIndex !== undefined) {
        // Higher option index = higher risk for most questions
        const riskScore = (answerIndex / (question.options.length - 1)) * question.riskWeight;
        totalRiskScore += riskScore;
      }
      maxPossibleScore += question.riskWeight;
    });

    const riskPercentage = (totalRiskScore / maxPossibleScore) * 100;

    if (riskPercentage <= 30) return 'safe';
    if (riskPercentage <= 65) return 'medium';
    return 'high';
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const riskLevel = calculateRiskLevel();
    setRiskLevel(riskLevel);

    // Create recovery plan and handle emergency notifications
    if (user) {
      try {
        // Create recovery plan based on risk level
        const recoveryPlan = recoveryPlanService.createRecoveryPlan(
          user.id,
          riskLevel as 'safe' | 'medium' | 'high'
        );
        console.log('Recovery plan created:', recoveryPlan);

        // Send emergency notification for high-risk users
        if (riskLevel === 'high') {
          // Convert answers to array format for emergency notification
          const answersArray = Object.keys(answers).map(key => ({
            questionId: parseInt(key),
            selectedOption: answers[parseInt(key)]
          }));

          // Send real SMS emergency alert (async)
          emergencyNotificationService.sendEmergencyAlert(
            user.id,
            user.name,
            answersArray
          ).then(emergencyAlert => {
            console.log('Emergency alert processed:', emergencyAlert);
          }).catch(error => {
            console.error('Emergency alert failed:', error);
          });

          // No intrusive alert - just console log
          console.log(`🚨 High-risk user detected: ${user.name}. Emergency SMS being sent to registered numbers.`);
        }
      } catch (error) {
        console.error('Error creating recovery plan or sending emergency alert:', error);
      }
    }

    // Update user profile with risk level
    if (user) {
      updateUserProfile(user.id, { riskLevel });
    }

    // Navigate to appropriate dashboard based on risk level
    navigate(`/dashboard/${riskLevel}`);

    setIsSubmitting(false);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / limitedQuestions.length) * 100;

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-t-transparent rounded-full mx-auto mb-6"
            style={{
              background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
              WebkitMask: 'radial-gradient(circle, transparent 50%, black 50%)',
              mask: 'radial-gradient(circle, transparent 50%, black 50%)'
            }}
          />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Analyzing Your Responses
          </h2>
          <p className="text-gray-600 text-lg mb-6">Please wait while we assess your risk level...</p>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-full"
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            >
              Recovery Assessment
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              Help us understand your situation to provide the best support
            </motion.p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{currentQuestionIndex + 1}</span>
              </div>
              <span className="text-lg font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} of {limitedQuestions.length}
              </span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2">
              {limitedQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentQuestionIndex
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mb-10 border border-white/20"
          >
            {/* Question Header */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mb-3">
                  {currentQuestion.question}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircleIcon className="mr-1 text-purple-400" />
                  <span>Choose the option that best describes your situation</span>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`
                      w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                      ${isSelected
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="font-semibold text-lg">{option}</span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircleIcon className="text-white text-sm" />
                        </motion.div>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center"
        >
          <motion.button
            whileHover={{ scale: currentQuestionIndex > 0 ? 1.05 : 1, x: currentQuestionIndex > 0 ? -5 : 0 }}
            whileTap={{ scale: currentQuestionIndex > 0 ? 0.95 : 1 }}
            disabled={currentQuestionIndex === 0}
            onClick={handlePrevious}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
              flex items-center space-x-3 shadow-lg
              ${currentQuestionIndex > 0
                ? 'bg-white/80 backdrop-blur-lg hover:bg-white text-gray-700 hover:shadow-xl border border-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }
            `}
          >
            <ArrowBackIcon className="text-xl" />
            <span>Previous</span>
          </motion.button>

          {/* Question indicator */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full border border-gray-200">
              {currentQuestionIndex + 1} / {limitedQuestions.length}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: hasAnswered ? 1.05 : 1, x: hasAnswered ? 5 : 0 }}
            whileTap={{ scale: hasAnswered ? 0.95 : 1 }}
            disabled={!hasAnswered}
            onClick={handleNext}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
              flex items-center space-x-3 shadow-lg
              ${hasAnswered
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span>{isLastQuestion ? 'Submit Assessment' : 'Next Question'}</span>
            <ArrowForwardIcon className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Enhanced Quiz Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <CheckCircleIcon className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Confidential Assessment</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              This assessment helps us understand your current situation and provide personalized support.
              All responses are completely confidential and secure. Your privacy is our priority.
            </p>
            <div className="flex justify-center items-center space-x-6 mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Secure & Private
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Professional Support
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Personalized Care
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
