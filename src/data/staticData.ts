// Static data for the Nivaran app

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  riskWeight: number; // 1-3 (1=low risk, 2=medium risk, 3=high risk)
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  image: string;
  consultationFee: number;
  nextAvailable: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  riskLevel: 'safe' | 'medium' | 'high';
  lastAssessment: string;
  progress: number;
  currentPlan: string;
}

export interface Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
  prescribedDate: string;
}

export interface RecoveryActivity {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'therapy' | 'exercise' | 'meditation' | 'education';
  completed: boolean;
  scheduledTime?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

// Quiz Questions Data
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How often do you think about using substances?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    riskWeight: 2
  },
  {
    id: 2,
    question: "Have you tried to quit using substances before?",
    options: ["Never used", "Yes, successfully", "Yes, but relapsed", "No, never tried"],
    riskWeight: 2
  },
  {
    id: 3,
    question: "How would you rate your current stress level?",
    options: ["Very low", "Low", "Moderate", "High", "Very high"],
    riskWeight: 1
  },
  {
    id: 4,
    question: "Do you have a support system (family, friends)?",
    options: ["Strong support", "Some support", "Limited support", "No support"],
    riskWeight: 2
  },
  {
    id: 5,
    question: "How often do you experience cravings?",
    options: ["Never", "Rarely", "Weekly", "Daily", "Multiple times daily"],
    riskWeight: 3
  },
  {
    id: 6,
    question: "Have you experienced withdrawal symptoms?",
    options: ["Never", "Mild symptoms", "Moderate symptoms", "Severe symptoms"],
    riskWeight: 3
  },
  {
    id: 7,
    question: "How is your sleep pattern?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
    riskWeight: 1
  },
  {
    id: 8,
    question: "Do you have access to substances currently?",
    options: ["No access", "Limited access", "Easy access", "Very easy access"],
    riskWeight: 3
  },
  {
    id: 9,
    question: "How motivated are you to recover?",
    options: ["Extremely motivated", "Very motivated", "Somewhat motivated", "Not very motivated", "Not motivated"],
    riskWeight: 2
  },
  {
    id: 10,
    question: "Have you been in treatment before?",
    options: ["Never needed", "Yes, completed successfully", "Yes, but didn't complete", "Currently in treatment"],
    riskWeight: 2
  },

];

// Recovery Plan Stages based on Risk Levels
export const recoveryPlanStages = {
  safe: {
    title: "Safe Recovery Plan",
    description: "Maintenance and prevention focused plan",
    stages: [
      {
        id: 1,
        name: "Foundation Building",
        duration: "Weeks 1-2",
        description: "Establish daily routines and healthy habits",
        goals: [
          "Complete daily check-ins",
          "Establish sleep schedule",
          "Begin mindfulness practice",
          "Connect with support network"
        ],
        activities: [
          { name: "Morning meditation", frequency: "Daily", duration: "10 minutes" },
          { name: "Mood tracking", frequency: "Daily", duration: "5 minutes" },
          { name: "Exercise routine", frequency: "3x/week", duration: "30 minutes" },
          { name: "Journal writing", frequency: "Daily", duration: "15 minutes" }
        ],
        milestones: ["7 consecutive days of check-ins", "Established sleep routine"]
      },
      {
        id: 2,
        name: "Skill Development",
        duration: "Weeks 3-6",
        description: "Build coping strategies and life skills",
        goals: [
          "Learn stress management techniques",
          "Develop healthy relationships",
          "Build problem-solving skills",
          "Create long-term goals"
        ],
        activities: [
          { name: "Stress management workshop", frequency: "Weekly", duration: "1 hour" },
          { name: "Social activities", frequency: "2x/week", duration: "2 hours" },
          { name: "Skill-building exercises", frequency: "Daily", duration: "20 minutes" },
          { name: "Goal setting sessions", frequency: "Weekly", duration: "30 minutes" }
        ],
        milestones: ["Completed stress management course", "Established 3 healthy relationships"]
      },
      {
        id: 3,
        name: "Independence & Growth",
        duration: "Weeks 7-12",
        description: "Focus on personal growth and independence",
        goals: [
          "Achieve personal milestones",
          "Maintain healthy lifestyle",
          "Help others in recovery",
          "Plan for future goals"
        ],
        activities: [
          { name: "Mentoring others", frequency: "Weekly", duration: "1 hour" },
          { name: "Personal projects", frequency: "Daily", duration: "1 hour" },
          { name: "Community service", frequency: "Weekly", duration: "2 hours" },
          { name: "Future planning", frequency: "Weekly", duration: "30 minutes" }
        ],
        milestones: ["Mentored 2 people", "Completed personal project", "90 days clean"]
      }
    ]
  },
  medium: {
    title: "Medium Risk Recovery Plan",
    description: "Structured support with professional guidance",
    stages: [
      {
        id: 1,
        name: "Stabilization",
        duration: "Weeks 1-3",
        description: "Focus on immediate safety and stability",
        goals: [
          "Achieve physical stability",
          "Establish safety protocols",
          "Begin therapy sessions",
          "Connect with medical support"
        ],
        activities: [
          { name: "Medical check-ups", frequency: "Weekly", duration: "1 hour" },
          { name: "Therapy sessions", frequency: "2x/week", duration: "1 hour" },
          { name: "Medication management", frequency: "Daily", duration: "As prescribed" },
          { name: "Crisis planning", frequency: "Weekly", duration: "30 minutes" }
        ],
        milestones: ["Medical clearance", "Crisis plan established", "Therapy engagement"]
      },
      {
        id: 2,
        name: "Active Treatment",
        duration: "Weeks 4-8",
        description: "Intensive therapy and skill building",
        goals: [
          "Address underlying issues",
          "Develop coping strategies",
          "Build support network",
          "Learn relapse prevention"
        ],
        activities: [
          { name: "Individual therapy", frequency: "2x/week", duration: "1 hour" },
          { name: "Group therapy", frequency: "Weekly", duration: "1.5 hours" },
          { name: "Family therapy", frequency: "Bi-weekly", duration: "1 hour" },
          { name: "Skill workshops", frequency: "Weekly", duration: "2 hours" }
        ],
        milestones: ["Completed trauma work", "Strong support network", "Relapse prevention plan"]
      },
      {
        id: 3,
        name: "Integration & Maintenance",
        duration: "Weeks 9-16",
        description: "Apply skills and maintain progress",
        goals: [
          "Practice new skills daily",
          "Maintain therapeutic gains",
          "Build independence",
          "Prepare for graduation"
        ],
        activities: [
          { name: "Individual therapy", frequency: "Weekly", duration: "1 hour" },
          { name: "Peer support groups", frequency: "2x/week", duration: "1 hour" },
          { name: "Independent living skills", frequency: "Daily", duration: "30 minutes" },
          { name: "Volunteer work", frequency: "Weekly", duration: "2 hours" }
        ],
        milestones: ["Independent living", "Stable relationships", "120 days clean"]
      }
    ]
  },
  high: {
    title: "High Risk Recovery Plan",
    description: "Intensive support with 24/7 monitoring",
    stages: [
      {
        id: 1,
        name: "Crisis Intervention",
        duration: "Weeks 1-4",
        description: "Immediate safety and medical stabilization",
        goals: [
          "Ensure immediate safety",
          "Medical detoxification",
          "Psychiatric evaluation",
          "24/7 monitoring setup"
        ],
        activities: [
          { name: "Medical monitoring", frequency: "24/7", duration: "Continuous" },
          { name: "Psychiatric evaluation", frequency: "Daily", duration: "1 hour" },
          { name: "Crisis counseling", frequency: "Daily", duration: "30 minutes" },
          { name: "Family notification", frequency: "Daily", duration: "15 minutes" }
        ],
        milestones: ["Medical stability", "Psychiatric clearance", "Safety plan active"]
      },
      {
        id: 2,
        name: "Intensive Treatment",
        duration: "Weeks 5-12",
        description: "Comprehensive treatment with multiple interventions",
        goals: [
          "Address acute symptoms",
          "Intensive therapy program",
          "Medication optimization",
          "Family involvement"
        ],
        activities: [
          { name: "Individual therapy", frequency: "Daily", duration: "1 hour" },
          { name: "Group therapy", frequency: "Daily", duration: "1.5 hours" },
          { name: "Medical management", frequency: "Daily", duration: "30 minutes" },
          { name: "Family sessions", frequency: "2x/week", duration: "1 hour" }
        ],
        milestones: ["Symptom reduction", "Therapy engagement", "Family support active"]
      },
      {
        id: 3,
        name: "Stabilization & Transition",
        duration: "Weeks 13-20",
        description: "Prepare for step-down care and community integration",
        goals: [
          "Maintain stability",
          "Transition planning",
          "Community integration",
          "Long-term support setup"
        ],
        activities: [
          { name: "Individual therapy", frequency: "3x/week", duration: "1 hour" },
          { name: "Life skills training", frequency: "Daily", duration: "2 hours" },
          { name: "Community outings", frequency: "2x/week", duration: "3 hours" },
          { name: "Discharge planning", frequency: "Weekly", duration: "1 hour" }
        ],
        milestones: ["Community integration", "Discharge plan ready", "Support network established"]
      }
    ]
  }
};

// Doctors Data
export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Addiction Medicine",
    experience: 12,
    rating: 4.8,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    consultationFee: 150,
    nextAvailable: "Today 2:00 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Psychiatry",
    experience: 8,
    rating: 4.6,
    availability: 'busy',
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    consultationFee: 200,
    nextAvailable: "Tomorrow 10:00 AM"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Behavioral Therapy",
    experience: 15,
    rating: 4.9,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1594824475317-d8b0b4b5b8b5?w=150&h=150&fit=crop&crop=face",
    consultationFee: 175,
    nextAvailable: "Today 4:30 PM"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Family Medicine",
    experience: 10,
    rating: 4.5,
    availability: 'offline',
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    consultationFee: 120,
    nextAvailable: "Monday 9:00 AM"
  },
  {
    id: 5,
    name: "Dr. Amanda Foster",
    specialization: "Clinical Psychology",
    experience: 18,
    rating: 4.9,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face",
    consultationFee: 180,
    nextAvailable: "Today 3:15 PM"
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialization: "Addiction Medicine",
    experience: 22,
    rating: 4.7,
    availability: 'busy',
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    consultationFee: 220,
    nextAvailable: "Tomorrow 2:30 PM"
  },
  {
    id: 7,
    name: "Dr. Lisa Thompson",
    specialization: "Substance Abuse Counseling",
    experience: 14,
    rating: 4.8,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1594824475317-d8b0b4b5b8b5?w=150&h=150&fit=crop&crop=face",
    consultationFee: 160,
    nextAvailable: "Today 5:00 PM"
  },
  {
    id: 8,
    name: "Dr. David Martinez",
    specialization: "Psychiatry",
    experience: 16,
    rating: 4.6,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    consultationFee: 190,
    nextAvailable: "Today 6:30 PM"
  },
  {
    id: 9,
    name: "Dr. Jennifer Lee",
    specialization: "Behavioral Therapy",
    experience: 11,
    rating: 4.7,
    availability: 'busy',
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    consultationFee: 170,
    nextAvailable: "Tomorrow 11:00 AM"
  },
  {
    id: 10,
    name: "Dr. Christopher Brown",
    specialization: "Family Medicine",
    experience: 13,
    rating: 4.5,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    consultationFee: 140,
    nextAvailable: "Today 7:00 PM"
  },
  {
    id: 11,
    name: "Dr. Maria Gonzalez",
    specialization: "Clinical Psychology",
    experience: 20,
    rating: 4.9,
    availability: 'available',
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face",
    consultationFee: 200,
    nextAvailable: "Tomorrow 9:00 AM"
  },
  {
    id: 12,
    name: "Dr. Kevin O'Connor",
    specialization: "Addiction Medicine",
    experience: 25,
    rating: 4.8,
    availability: 'offline',
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    consultationFee: 250,
    nextAvailable: "Wednesday 10:00 AM"
  }
];

// Sample Patients Data (for Mentor Dashboard)
export const patients: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    age: 28,
    riskLevel: 'medium',
    lastAssessment: "2024-08-15",
    progress: 65,
    currentPlan: "12-week recovery program"
  },
  {
    id: 2,
    name: "Maria Garcia",
    age: 34,
    riskLevel: 'safe',
    lastAssessment: "2024-08-18",
    progress: 85,
    currentPlan: "Maintenance program"
  },
  {
    id: 3,
    name: "David Lee",
    age: 22,
    riskLevel: 'high',
    lastAssessment: "2024-08-19",
    progress: 30,
    currentPlan: "Intensive therapy program"
  }
];

// Sample Prescriptions Data
export const prescriptions: Prescription[] = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    medication: "Naltrexone",
    dosage: "50mg",
    frequency: "Once daily",
    duration: "3 months",
    notes: "Take with food to reduce nausea",
    prescribedDate: "2024-08-10"
  },
  {
    id: 2,
    patientId: 3,
    doctorId: 2,
    medication: "Buprenorphine",
    dosage: "8mg",
    frequency: "Twice daily",
    duration: "6 months",
    notes: "Sublingual administration",
    prescribedDate: "2024-08-15"
  }
];

// Recovery Activities Data
export const recoveryActivities: RecoveryActivity[] = [
  {
    id: 1,
    title: "Morning Meditation",
    description: "Start your day with mindfulness and breathing exercises",
    duration: 15,
    category: 'meditation',
    completed: true,
    scheduledTime: "08:00"
  },
  {
    id: 2,
    title: "Therapy Session",
    description: "Individual counseling session with your therapist",
    duration: 60,
    category: 'therapy',
    completed: false,
    scheduledTime: "14:00"
  },
  {
    id: 3,
    title: "Physical Exercise",
    description: "30-minute cardio workout to boost endorphins",
    duration: 30,
    category: 'exercise',
    completed: false,
    scheduledTime: "17:00"
  },
  {
    id: 4,
    title: "Educational Reading",
    description: "Read chapter 3 of 'Understanding Addiction'",
    duration: 45,
    category: 'education',
    completed: false
  }
];

// Sample Chat Messages
export const sampleChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    message: "Hello! I'm here to support you on your recovery journey. How are you feeling today?",
    timestamp: "2024-08-19T10:00:00Z"
  },
  {
    id: 2,
    sender: 'user',
    message: "I'm feeling a bit anxious today. I had some cravings this morning.",
    timestamp: "2024-08-19T10:05:00Z"
  },
  {
    id: 3,
    sender: 'bot',
    message: "I understand that cravings can be challenging. Remember that they are temporary and will pass. Have you tried any of the coping strategies we discussed?",
    timestamp: "2024-08-19T10:06:00Z"
  }
];
