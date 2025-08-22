export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  riskLevel: 'safe' | 'medium' | 'high';
  registrationDate: string;
  lastActive: string;
  assignedMentor?: string;
  assignedDoctor?: string;
  selectedDoctor?: string;
  currentStatus: 'active' | 'inactive' | 'needs_attention';
  progressData: {
    daysClean: number;
    moodScore: number;
    activitiesCompleted: number;
    lastAssessment: string;
  };
  medicalHistory: {
    substanceType: string;
    duration: string;
    previousTreatments: string[];
    currentMedications: string[];
  };
  recoveryPlan: {
    goals: string[];
    activities: string[];
    milestones: string[];
    nextAppointment?: string;
  };
  notes: {
    id: string;
    date: string;
    author: string;
    content: string;
    type: 'assessment' | 'progress' | 'concern' | 'achievement';
  }[];
}

class PatientService {
  private patients: Patient[] = [];
  private listeners: ((patients: Patient[]) => void)[] = [];

  constructor() {
    this.loadPatientsFromStorage();
    this.initializeSampleData();
  }

  // Load patients from localStorage
  private loadPatientsFromStorage() {
    const stored = localStorage.getItem('nivaran_patients');
    if (stored) {
      this.patients = JSON.parse(stored);
    }
  }

  // Save patients to localStorage
  private savePatientsToStorage() {
    localStorage.setItem('nivaran_patients', JSON.stringify(this.patients));
    this.notifyListeners();
  }

  // Initialize with sample data if no patients exist
  private initializeSampleData() {
    if (this.patients.length === 0) {
      this.patients = [
        {
          id: 'patient-1',
          name: 'John Doe',
          email: 'john@example.com',
          age: 28,
          phone: '+1-555-0123',
          emergencyContact: 'Jane Doe',
          emergencyPhone: '+1-555-0124',
          riskLevel: 'safe',
          registrationDate: '2024-01-15',
          lastActive: new Date().toISOString(),
          assignedMentor: 'mentor-1',
          currentStatus: 'active',
          progressData: {
            daysClean: 45,
            moodScore: 8.5,
            activitiesCompleted: 12,
            lastAssessment: '2024-01-20'
          },
          medicalHistory: {
            substanceType: 'Alcohol',
            duration: '5 years',
            previousTreatments: ['Outpatient counseling', 'Support groups'],
            currentMedications: ['Naltrexone']
          },
          recoveryPlan: {
            goals: ['Maintain sobriety', 'Improve mental health', 'Rebuild relationships'],
            activities: ['Daily meditation', 'Weekly therapy', 'Exercise routine'],
            milestones: ['30 days clean', '90 days clean', '6 months clean'],
            nextAppointment: '2024-02-01'
          },
          notes: [
            {
              id: 'note-1',
              date: '2024-01-20',
              author: 'Dr. Sarah Johnson',
              content: 'Patient showing excellent progress. Mood has improved significantly.',
              type: 'progress'
            }
          ]
        }
      ];
      this.savePatientsToStorage();
    }
  }

  // Add a new patient (when user registers)
  addPatient(patientData: Omit<Patient, 'id' | 'registrationDate' | 'lastActive' | 'notes'>): Patient {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      registrationDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      notes: []
    };

    this.patients.push(newPatient);
    this.savePatientsToStorage();
    return newPatient;
  }

  // Update patient information
  updatePatient(patientId: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.id === patientId);
    if (index === -1) return null;

    this.patients[index] = {
      ...this.patients[index],
      ...updates,
      lastActive: new Date().toISOString()
    };

    this.savePatientsToStorage();
    return this.patients[index];
  }

  // Get all patients (for mentors)
  getAllPatients(): Patient[] {
    return [...this.patients];
  }

  // Get patients by mentor
  getPatientsByMentor(mentorId: string): Patient[] {
    return this.patients.filter(p => p.assignedMentor === mentorId);
  }

  // Get patient by ID
  getPatientById(patientId: string): Patient | null {
    return this.patients.find(p => p.id === patientId) || null;
  }

  // Get patient by email (for user login)
  getPatientByEmail(email: string): Patient | null {
    return this.patients.find(p => p.email === email) || null;
  }

  // Add note to patient
  addPatientNote(patientId: string, note: Omit<Patient['notes'][0], 'id' | 'date'>): boolean {
    const patient = this.getPatientById(patientId);
    if (!patient) return false;

    const newNote = {
      ...note,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    patient.notes.push(newNote);
    this.updatePatient(patientId, { notes: patient.notes });
    return true;
  }

  // Update patient progress
  updatePatientProgress(patientId: string, progressData: Partial<Patient['progressData']>): boolean {
    const patient = this.getPatientById(patientId);
    if (!patient) return false;

    const updatedProgress = {
      ...patient.progressData,
      ...progressData
    };

    this.updatePatient(patientId, { progressData: updatedProgress });
    return true;
  }

  // Subscribe to patient updates
  subscribe(callback: (patients: Patient[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.patients]));
  }

  // Get statistics for dashboard
  getPatientStats(mentorId?: string): {
    total: number;
    active: number;
    needsAttention: number;
    byRiskLevel: { safe: number; medium: number; high: number };
  } {
    const patients = mentorId ? this.getPatientsByMentor(mentorId) : this.getAllPatients();
    
    return {
      total: patients.length,
      active: patients.filter(p => p.currentStatus === 'active').length,
      needsAttention: patients.filter(p => p.currentStatus === 'needs_attention').length,
      byRiskLevel: {
        safe: patients.filter(p => p.riskLevel === 'safe').length,
        medium: patients.filter(p => p.riskLevel === 'medium').length,
        high: patients.filter(p => p.riskLevel === 'high').length
      }
    };
  }
}

// Create singleton instance
export const patientService = new PatientService();
export default patientService;
