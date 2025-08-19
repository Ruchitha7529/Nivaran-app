import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { quizQuestions, QuizQuestion } from '../data/staticData';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setRiskLevel } = useAuth();
  const navigate = useNavigate();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
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

    quizQuestions.forEach(question => {
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
    
    // Navigate to appropriate dashboard based on risk level
    navigate(`/dashboard/${riskLevel}`);
    
    setIsSubmitting(false);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyzing Your Responses</h2>
          <p className="text-gray-600">Please wait while we assess your risk level...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Assessment Quiz</h1>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {isSelected && (
                        <CheckCircleIcon className="text-blue-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: currentQuestionIndex > 0 ? 1.02 : 1 }}
            whileTap={{ scale: currentQuestionIndex > 0 ? 0.98 : 1 }}
            disabled={currentQuestionIndex === 0}
            onClick={handlePrevious}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-200
              flex items-center space-x-2
              ${currentQuestionIndex > 0
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ArrowBackIcon />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: hasAnswered ? 1.02 : 1 }}
            whileTap={{ scale: hasAnswered ? 0.98 : 1 }}
            disabled={!hasAnswered}
            onClick={handleNext}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-200
              flex items-center space-x-2
              ${hasAnswered
                ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span>{isLastQuestion ? 'Submit' : 'Next'}</span>
            <ArrowForwardIcon />
          </motion.button>
        </div>

        {/* Quiz Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            This assessment helps us understand your current situation and provide personalized support.
            All responses are confidential.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
