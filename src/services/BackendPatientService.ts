// Backend Patient Service
import { apiService, ApiResponse } from './ApiService';

export interface BackendPatient {
  id: string;
  userId: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  riskLevel: 'safe' | 'medium' | 'high';
  emergencyContact: string;
  emergencyPhone: string;
  registrationDate: string;
  lastActive: string;
  lastAssessment: string;
  progressData: {
    sobrietyDays: number;
    moodRating: number;
    stressLevel: number;
    sleepQuality: number;
    energyLevel: number;
    socialConnection: number;
    lastAssessment: string;
    weeklyProgress: number;
    monthlyProgress: number;
    overallProgress: number;
  };
  notes: string[];
  assignedMentor?: string;
  assignedDoctor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  phone: string;
  email?: string;
  emergencyContact: string;
  emergencyPhone: string;
  riskLevel?: 'safe' | 'medium' | 'high';
}

export interface UpdatePatientRequest {
  name?: string;
  age?: number;
  phone?: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  riskLevel?: 'safe' | 'medium' | 'high';
  assignedMentor?: string;
  assignedDoctor?: string;
  isActive?: boolean;
}

export interface PatientProgressUpdate {
  sobrietyDays?: number;
  moodRating?: number;
  stressLevel?: number;
  sleepQuality?: number;
  energyLevel?: number;
  socialConnection?: number;
}

class BackendPatientService {
  // Get all patients (for mentors/doctors)
  async getAllPatients(): Promise<ApiResponse<BackendPatient[]>> {
    return await apiService.get<BackendPatient[]>('/patients');
  }

  // Get patients assigned to current mentor/doctor
  async getAssignedPatients(): Promise<ApiResponse<BackendPatient[]>> {
    return await apiService.get<BackendPatient[]>('/patients/assigned');
  }

  // Get patient by ID
  async getPatientById(patientId: string): Promise<ApiResponse<BackendPatient>> {
    return await apiService.get<BackendPatient>(`/patients/${patientId}`);
  }

  // Get current user's patient profile
  async getCurrentPatientProfile(): Promise<ApiResponse<BackendPatient>> {
    return await apiService.get<BackendPatient>('/patients/me');
  }

  // Create new patient
  async createPatient(patientData: CreatePatientRequest): Promise<ApiResponse<BackendPatient>> {
    return await apiService.post<BackendPatient>('/patients', patientData);
  }

  // Update patient
  async updatePatient(patientId: string, updates: UpdatePatientRequest): Promise<ApiResponse<BackendPatient>> {
    return await apiService.put<BackendPatient>(`/patients/${patientId}`, updates);
  }

  // Update patient progress
  async updatePatientProgress(patientId: string, progress: PatientProgressUpdate): Promise<ApiResponse<BackendPatient>> {
    return await apiService.patch<BackendPatient>(`/patients/${patientId}/progress`, progress);
  }

  // Add note to patient
  async addPatientNote(patientId: string, note: string): Promise<ApiResponse<BackendPatient>> {
    return await apiService.post<BackendPatient>(`/patients/${patientId}/notes`, { note });
  }

  // Delete patient note
  async deletePatientNote(patientId: string, noteIndex: number): Promise<ApiResponse<BackendPatient>> {
    return await apiService.delete<BackendPatient>(`/patients/${patientId}/notes/${noteIndex}`);
  }

  // Assign mentor to patient
  async assignMentor(patientId: string, mentorId: string): Promise<ApiResponse<BackendPatient>> {
    return await apiService.post<BackendPatient>(`/patients/${patientId}/assign-mentor`, { mentorId });
  }

  // Assign doctor to patient
  async assignDoctor(patientId: string, doctorId: string): Promise<ApiResponse<BackendPatient>> {
    return await apiService.post<BackendPatient>(`/patients/${patientId}/assign-doctor`, { doctorId });
  }

  // Get patient statistics
  async getPatientStats(patientId: string): Promise<ApiResponse<{
    totalDays: number;
    sobrietyStreak: number;
    averageMood: number;
    averageStress: number;
    progressTrend: 'improving' | 'stable' | 'declining';
    lastAssessmentDate: string;
    nextAssessmentDue: string;
  }>> {
    return await apiService.get(`/patients/${patientId}/stats`);
  }

  // Get patients by risk level
  async getPatientsByRiskLevel(riskLevel: 'safe' | 'medium' | 'high'): Promise<ApiResponse<BackendPatient[]>> {
    return await apiService.get<BackendPatient[]>(`/patients/risk/${riskLevel}`);
  }

  // Search patients
  async searchPatients(query: string): Promise<ApiResponse<BackendPatient[]>> {
    return await apiService.get<BackendPatient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
  }

  // Get patient activity log
  async getPatientActivity(patientId: string, limit?: number): Promise<ApiResponse<{
    id: string;
    patientId: string;
    type: 'assessment' | 'progress_update' | 'note_added' | 'mentor_assigned' | 'doctor_assigned';
    description: string;
    timestamp: string;
    performedBy: string;
  }[]>> {
    const endpoint = `/patients/${patientId}/activity${limit ? `?limit=${limit}` : ''}`;
    return await apiService.get(endpoint);
  }

  // Deactivate patient
  async deactivatePatient(patientId: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/patients/${patientId}/deactivate`, { reason });
  }

  // Reactivate patient
  async reactivatePatient(patientId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/patients/${patientId}/reactivate`);
  }

  // Export patient data
  async exportPatientData(patientId: string, format: 'json' | 'csv' | 'pdf'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiService.get<{ downloadUrl: string }>(`/patients/${patientId}/export?format=${format}`);
  }

  // Get dashboard summary for mentors/doctors
  async getDashboardSummary(): Promise<ApiResponse<{
    totalPatients: number;
    activePatients: number;
    highRiskPatients: number;
    mediumRiskPatients: number;
    safePatients: number;
    recentAssessments: number;
    pendingActions: number;
  }>> {
    return await apiService.get('/patients/dashboard-summary');
  }
}

export const backendPatientService = new BackendPatientService();
