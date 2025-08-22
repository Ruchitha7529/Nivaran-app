export interface RecoveryActivity {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'milestone';
  category: 'mental_health' | 'physical_health' | 'social' | 'educational' | 'spiritual' | 'medical';
  duration: string; // e.g., "15 minutes", "1 hour"
  frequency: string; // e.g., "Daily", "3x per week"
  difficulty: 'easy' | 'medium' | 'hard';
  points: number; // Gamification points
  isCompleted: boolean;
  completedDate?: string;
  streak: number; // Current streak for daily activities
}

export interface RecoveryGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: 'short_term' | 'medium_term' | 'long_term';
  progress: number; // 0-100
  milestones: string[];
  isAchieved: boolean;
  achievedDate?: string;
}

export interface RecoveryPlan {
  id: string;
  patientId: string;
  riskLevel: 'safe' | 'medium' | 'high';
  createdDate: string;
  lastUpdated: string;
  phase: 'initial' | 'stabilization' | 'maintenance' | 'advanced';
  goals: RecoveryGoal[];
  activities: RecoveryActivity[];
  weeklySchedule: {
    [key: string]: string[]; // day -> activity IDs
  };
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
    available24h: boolean;
  }[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
    endDate?: string;
  }[];
  therapySessions: {
    type: 'individual' | 'group' | 'family';
    frequency: string;
    therapistName: string;
    nextSession?: string;
  }[];
  progressMetrics: {
    sobrietyDays: number;
    moodRating: number; // 1-10
    stressLevel: number; // 1-10
    sleepQuality: number; // 1-10
    energyLevel: number; // 1-10
    socialConnection: number; // 1-10
  };
}

class RecoveryPlanService {
  private recoveryPlans: RecoveryPlan[] = [];
  private listeners: ((plans: RecoveryPlan[]) => void)[] = [];

  constructor() {
    this.loadPlansFromStorage();
  }

  private loadPlansFromStorage() {
    const stored = localStorage.getItem('nivaran_recovery_plans');
    if (stored) {
      this.recoveryPlans = JSON.parse(stored);
    }
  }

  private savePlansToStorage() {
    localStorage.setItem('nivaran_recovery_plans', JSON.stringify(this.recoveryPlans));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.recoveryPlans]));
  }

  // Create recovery plan based on risk level
  createRecoveryPlan(patientId: string, riskLevel: 'safe' | 'medium' | 'high'): RecoveryPlan {
    const planId = `plan-${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];

    const plan: RecoveryPlan = {
      id: planId,
      patientId,
      riskLevel,
      createdDate: currentDate,
      lastUpdated: currentDate,
      phase: 'initial',
      goals: this.generateGoalsByRiskLevel(riskLevel),
      activities: this.generateActivitiesByRiskLevel(riskLevel),
      weeklySchedule: this.generateWeeklySchedule(riskLevel),
      emergencyContacts: this.getDefaultEmergencyContacts(),
      medications: [],
      therapySessions: this.getTherapySessionsByRiskLevel(riskLevel),
      progressMetrics: {
        sobrietyDays: 0,
        moodRating: 5,
        stressLevel: 7,
        sleepQuality: 5,
        energyLevel: 5,
        socialConnection: 4
      }
    };

    this.recoveryPlans.push(plan);
    this.savePlansToStorage();
    return plan;
  }

  private generateGoalsByRiskLevel(riskLevel: 'safe' | 'medium' | 'high'): RecoveryGoal[] {
    const baseGoals: RecoveryGoal[] = [
      {
        id: 'goal-1',
        title: 'Maintain Daily Sobriety',
        description: 'Stay substance-free every day',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'short_term',
        progress: 0,
        milestones: ['7 days clean', '14 days clean', '30 days clean'],
        isAchieved: false
      },
      {
        id: 'goal-2',
        title: 'Improve Mental Health',
        description: 'Develop healthy coping mechanisms and emotional regulation',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'medium_term',
        progress: 0,
        milestones: ['Complete mood tracking for 2 weeks', 'Learn 3 coping strategies', 'Practice mindfulness daily'],
        isAchieved: false
      }
    ];

    if (riskLevel === 'high') {
      baseGoals.push({
        id: 'goal-3',
        title: 'Intensive Treatment Completion',
        description: 'Complete intensive outpatient or inpatient treatment program',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'short_term',
        progress: 0,
        milestones: ['Enroll in program', 'Complete first week', 'Complete first month'],
        isAchieved: false
      });
    }

    if (riskLevel === 'medium' || riskLevel === 'high') {
      baseGoals.push({
        id: 'goal-4',
        title: 'Build Support Network',
        description: 'Establish strong connections with family, friends, and support groups',
        targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'medium_term',
        progress: 0,
        milestones: ['Join support group', 'Attend 5 meetings', 'Find accountability partner'],
        isAchieved: false
      });
    }

    return baseGoals;
  }

  private generateActivitiesByRiskLevel(riskLevel: 'safe' | 'medium' | 'high'): RecoveryActivity[] {
    const baseActivities: RecoveryActivity[] = [
      {
        id: 'activity-1',
        title: 'Morning Meditation',
        description: 'Start each day with 10-15 minutes of mindfulness meditation',
        type: 'daily',
        category: 'mental_health',
        duration: '15 minutes',
        frequency: 'Daily',
        difficulty: 'easy',
        points: 10,
        isCompleted: false,
        streak: 0
      },
      {
        id: 'activity-2',
        title: 'Mood Check-in',
        description: 'Rate your mood and energy levels, note any triggers',
        type: 'daily',
        category: 'mental_health',
        duration: '5 minutes',
        frequency: 'Daily',
        difficulty: 'easy',
        points: 5,
        isCompleted: false,
        streak: 0
      },
      {
        id: 'activity-3',
        title: 'Physical Exercise',
        description: 'Engage in 30 minutes of physical activity',
        type: 'daily',
        category: 'physical_health',
        duration: '30 minutes',
        frequency: 'Daily',
        difficulty: 'medium',
        points: 15,
        isCompleted: false,
        streak: 0
      }
    ];

    if (riskLevel === 'medium' || riskLevel === 'high') {
      baseActivities.push(
        {
          id: 'activity-4',
          title: 'Support Group Meeting',
          description: 'Attend AA, NA, or other recovery support group meeting',
          type: 'weekly',
          category: 'social',
          duration: '1 hour',
          frequency: '2-3x per week',
          difficulty: 'medium',
          points: 25,
          isCompleted: false,
          streak: 0
        },
        {
          id: 'activity-5',
          title: 'Therapy Session',
          description: 'Individual or group therapy session',
          type: 'weekly',
          category: 'mental_health',
          duration: '1 hour',
          frequency: 'Weekly',
          difficulty: 'medium',
          points: 30,
          isCompleted: false,
          streak: 0
        }
      );
    }

    if (riskLevel === 'high') {
      baseActivities.push(
        {
          id: 'activity-6',
          title: 'Crisis Prevention Planning',
          description: 'Review and update crisis prevention strategies',
          type: 'weekly',
          category: 'mental_health',
          duration: '30 minutes',
          frequency: 'Weekly',
          difficulty: 'hard',
          points: 20,
          isCompleted: false,
          streak: 0
        },
        {
          id: 'activity-7',
          title: 'Medical Check-up',
          description: 'Regular medical monitoring and medication management',
          type: 'weekly',
          category: 'medical',
          duration: '45 minutes',
          frequency: 'Bi-weekly',
          difficulty: 'easy',
          points: 15,
          isCompleted: false,
          streak: 0
        }
      );
    }

    return baseActivities;
  }

  private generateWeeklySchedule(riskLevel: 'safe' | 'medium' | 'high'): { [key: string]: string[] } {
    const schedule: { [key: string]: string[] } = {
      'Monday': ['activity-1', 'activity-2', 'activity-3'],
      'Tuesday': ['activity-1', 'activity-2', 'activity-3'],
      'Wednesday': ['activity-1', 'activity-2', 'activity-3'],
      'Thursday': ['activity-1', 'activity-2', 'activity-3'],
      'Friday': ['activity-1', 'activity-2', 'activity-3'],
      'Saturday': ['activity-1', 'activity-2', 'activity-3'],
      'Sunday': ['activity-1', 'activity-2', 'activity-3']
    };

    if (riskLevel === 'medium' || riskLevel === 'high') {
      schedule['Monday'].push('activity-4');
      schedule['Wednesday'].push('activity-5');
      schedule['Friday'].push('activity-4');
    }

    if (riskLevel === 'high') {
      schedule['Tuesday'].push('activity-6');
      schedule['Thursday'].push('activity-7');
    }

    return schedule;
  }

  private getDefaultEmergencyContacts() {
    return [
      {
        name: 'Crisis Hotline',
        phone: '988',
        relationship: 'National Suicide Prevention Lifeline',
        available24h: true
      },
      {
        name: 'SAMHSA Helpline',
        phone: '1-800-662-4357',
        relationship: 'Substance Abuse Treatment Locator',
        available24h: true
      }
    ];
  }

  private getTherapySessionsByRiskLevel(riskLevel: 'safe' | 'medium' | 'high') {
    const sessions = [];

    if (riskLevel === 'medium' || riskLevel === 'high') {
      sessions.push({
        type: 'individual' as const,
        frequency: 'Weekly',
        therapistName: 'Dr. Sarah Johnson',
        nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    if (riskLevel === 'high') {
      sessions.push({
        type: 'group' as const,
        frequency: '2x per week',
        therapistName: 'Dr. Michael Chen',
        nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    return sessions;
  }

  // Get recovery plan by patient ID
  getRecoveryPlan(patientId: string): RecoveryPlan | null {
    return this.recoveryPlans.find(plan => plan.patientId === patientId) || null;
  }

  // Update activity completion
  completeActivity(planId: string, activityId: string): boolean {
    const plan = this.recoveryPlans.find(p => p.id === planId);
    if (!plan) return false;

    const activity = plan.activities.find(a => a.id === activityId);
    if (!activity) return false;

    activity.isCompleted = true;
    activity.completedDate = new Date().toISOString().split('T')[0];
    activity.streak += 1;

    plan.lastUpdated = new Date().toISOString().split('T')[0];
    this.savePlansToStorage();
    return true;
  }

  // Update recovery plan
  updateRecoveryPlan(patientId: string, updatedPlan: RecoveryPlan): boolean {
    const index = this.recoveryPlans.findIndex(p => p.patientId === patientId);
    if (index === -1) return false;

    this.recoveryPlans[index] = { ...updatedPlan, lastUpdated: new Date().toISOString().split('T')[0] };
    this.savePlansToStorage();
    return true;
  }

  // Generate personalized recovery plan based on quiz answers
  generatePersonalizedPlan(patientId: string, quizAnswers: any[], riskLevel: 'safe' | 'medium' | 'high'): RecoveryPlan {
    // Use the existing createRecoveryPlan method which works
    return this.createRecoveryPlan(patientId, riskLevel);
  }



  // Update progress metrics
  updateProgressMetrics(planId: string, metrics: Partial<RecoveryPlan['progressMetrics']>): boolean {
    const plan = this.recoveryPlans.find(p => p.id === planId);
    if (!plan) return false;

    plan.progressMetrics = { ...plan.progressMetrics, ...metrics };
    plan.lastUpdated = new Date().toISOString().split('T')[0];
    this.savePlansToStorage();
    return true;
  }

  // Subscribe to plan updates
  subscribe(callback: (plans: RecoveryPlan[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const recoveryPlanService = new RecoveryPlanService();
export default recoveryPlanService;
