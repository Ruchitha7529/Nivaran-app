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
  {
    id: 11,
    question: "How often do you engage in risky behaviors?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
    riskWeight: 3
  },
  {
    id: 12,
    question: "Do you have any mental health concerns?",
    options: ["None", "Mild anxiety/depression", "Moderate concerns", "Severe concerns"],
    riskWeight: 2
  },
  {
    id: 13,
    question: "How stable is your living situation?",
    options: ["Very stable", "Stable", "Somewhat stable", "Unstable", "Very unstable"],
    riskWeight: 2
  },
  {
    id: 14,
    question: "Do you have employment or regular activities?",
    options: ["Full-time work/school", "Part-time work/school", "Irregular work", "Unemployed but seeking", "Not seeking work"],
    riskWeight: 1
  },
  {
    id: 15,
    question: "How would you rate your overall physical health?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
    riskWeight: 1
  },
  {
    id: 16,
    question: "Have you had any recent major life changes?",
    options: ["No major changes", "Minor changes", "Some significant changes", "Major life disruptions"],
    riskWeight: 2
  },
  {
    id: 17,
    question: "How often do you attend support groups or therapy?",
    options: ["Regularly", "Sometimes", "Rarely", "Never"],
    riskWeight: 2
  },
  {
    id: 18,
    question: "Do you have healthy coping mechanisms?",
    options: ["Many healthy coping strategies", "Some strategies", "Few strategies", "No healthy strategies"],
    riskWeight: 2
  }
];

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
