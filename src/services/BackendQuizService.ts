// Backend Quiz and Assessment Service
import { apiService, ApiResponse } from './ApiService';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'substance_use' | 'mental_health' | 'social_support' | 'lifestyle' | 'triggers';
  weight: number;
  riskFactors: {
    safe: number[];
    medium: number[];
    high: number[];
  };
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  timestamp: string;
}

export interface QuizSubmission {
  userId: string;
  answers: QuizAnswer[];
  completedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  submissionId: string;
  riskLevel: 'safe' | 'medium' | 'high';
  riskScore: number;
  maxScore: number;
  riskPercentage: number;
  categoryScores: {
    substance_use: number;
    mental_health: number;
    social_support: number;
    lifestyle: number;
    triggers: number;
  };
  riskFactors: string[];
  recommendations: string[];
  emergencyTriggered: boolean;
  completedAt: string;
  nextAssessmentDue: string;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  quizResultId: string;
  riskLevel: 'high';
  riskScore: number;
  riskFactors: string[];
  emergencyContacts: string[];
  notificationsSent: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  status: 'pending' | 'sent' | 'acknowledged' | 'resolved';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

class BackendQuizService {
  // Get quiz questions
  async getQuizQuestions(): Promise<ApiResponse<QuizQuestion[]>> {
    return await apiService.get<QuizQuestion[]>('/quiz/questions');
  }

  // Submit quiz answers
  async submitQuiz(submission: QuizSubmission): Promise<ApiResponse<QuizResult>> {
    const response = await apiService.post<QuizResult>('/quiz/submit', submission);
    
    if (response.success && response.data) {
      console.log('✅ Quiz submitted successfully:', response.data);
      
      // If high risk, emergency alert should be triggered
      if (response.data.emergencyTriggered) {
        console.log('🚨 Emergency alert triggered for high-risk user');
      }
    }
    
    return response;
  }

  // Get user's quiz history
  async getQuizHistory(userId?: string): Promise<ApiResponse<QuizResult[]>> {
    const endpoint = userId ? `/quiz/history/${userId}` : '/quiz/history';
    return await apiService.get<QuizResult[]>(endpoint);
  }

  // Get latest quiz result
  async getLatestQuizResult(userId?: string): Promise<ApiResponse<QuizResult>> {
    const endpoint = userId ? `/quiz/latest/${userId}` : '/quiz/latest';
    return await apiService.get<QuizResult>(endpoint);
  }

  // Get quiz result by ID
  async getQuizResult(resultId: string): Promise<ApiResponse<QuizResult>> {
    return await apiService.get<QuizResult>(`/quiz/results/${resultId}`);
  }

  // Get quiz statistics
  async getQuizStatistics(): Promise<ApiResponse<{
    totalSubmissions: number;
    safeUsers: number;
    mediumRiskUsers: number;
    highRiskUsers: number;
    averageRiskScore: number;
    emergencyAlertsTriggered: number;
    lastSubmissionDate: string;
  }>> {
    return await apiService.get('/quiz/statistics');
  }

  // Get emergency alerts (for mentors/doctors)
  async getEmergencyAlerts(status?: 'pending' | 'sent' | 'acknowledged' | 'resolved'): Promise<ApiResponse<EmergencyAlert[]>> {
    const endpoint = status ? `/emergency/alerts?status=${status}` : '/emergency/alerts';
    return await apiService.get<EmergencyAlert[]>(endpoint);
  }

  // Get emergency alert by ID
  async getEmergencyAlert(alertId: string): Promise<ApiResponse<EmergencyAlert>> {
    return await apiService.get<EmergencyAlert>(`/emergency/alerts/${alertId}`);
  }

  // Acknowledge emergency alert
  async acknowledgeEmergencyAlert(alertId: string, notes?: string): Promise<ApiResponse<EmergencyAlert>> {
    return await apiService.post<EmergencyAlert>(`/emergency/alerts/${alertId}/acknowledge`, { notes });
  }

  // Resolve emergency alert
  async resolveEmergencyAlert(alertId: string, notes?: string): Promise<ApiResponse<EmergencyAlert>> {
    return await apiService.post<EmergencyAlert>(`/emergency/alerts/${alertId}/resolve`, { notes });
  }

  // Manually trigger emergency alert (for testing)
  async triggerEmergencyAlert(userId: string, reason: string): Promise<ApiResponse<EmergencyAlert>> {
    return await apiService.post<EmergencyAlert>('/emergency/trigger', { userId, reason });
  }

  // Test emergency notification system
  async testEmergencyNotifications(): Promise<ApiResponse<{
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    message: string;
  }>> {
    return await apiService.post('/emergency/test');
  }

  // Get risk assessment trends
  async getRiskTrends(userId?: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<ApiResponse<{
    dates: string[];
    riskScores: number[];
    riskLevels: ('safe' | 'medium' | 'high')[];
    trend: 'improving' | 'stable' | 'declining';
  }>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (period) params.append('period', period);
    
    const endpoint = `/quiz/trends${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiService.get(endpoint);
  }

  // Update quiz questions (admin only)
  async updateQuizQuestions(questions: QuizQuestion[]): Promise<ApiResponse<QuizQuestion[]>> {
    return await apiService.put<QuizQuestion[]>('/quiz/questions', { questions });
  }

  // Get quiz analytics
  async getQuizAnalytics(): Promise<ApiResponse<{
    questionAnalytics: {
      questionId: string;
      question: string;
      totalResponses: number;
      optionDistribution: number[];
      averageRiskContribution: number;
    }[];
    categoryAnalytics: {
      category: string;
      averageScore: number;
      highRiskPercentage: number;
      commonRiskFactors: string[];
    }[];
    timeAnalytics: {
      averageCompletionTime: number;
      peakSubmissionHours: number[];
      submissionsByDay: { date: string; count: number }[];
    };
  }>> {
    return await apiService.get('/quiz/analytics');
  }

  // Schedule reminder for next assessment
  async scheduleAssessmentReminder(userId: string, reminderDate: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/quiz/schedule-reminder', {
      userId,
      reminderDate
    });
  }

  // Get overdue assessments
  async getOverdueAssessments(): Promise<ApiResponse<{
    userId: string;
    userName: string;
    lastAssessment: string;
    daysSinceLastAssessment: number;
    riskLevel: 'safe' | 'medium' | 'high';
  }[]>> {
    return await apiService.get('/quiz/overdue');
  }
}

export const backendQuizService = new BackendQuizService();
