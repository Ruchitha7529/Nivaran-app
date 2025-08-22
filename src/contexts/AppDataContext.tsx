import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { doctors as initialDoctors, patients as initialPatients, prescriptions as initialPrescriptions } from '../data/staticData';
import { Doctor, Patient, Prescription } from '../data/staticData';

export interface RegisteredMentor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  licenseNumber: string;
  institution: string;
  phone: string;
  bio?: string;
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  consultationFee: number;
  nextAvailable: string;
  image: string;
  registeredAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationshipType?: string;
  relationshipName?: string;
  relationshipPhone?: string;
  riskLevel: 'safe' | 'medium' | 'high' | null;
  assignedMentorId?: number;
  registeredAt: string;
  lastActive: string;
  progressScore: number;
  completedActivities: number;
  totalActivities: number;
  daysInRecovery: number;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: number;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'reminder' | 'achievement' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface AppDataContextType {
  // Doctors and Mentors
  doctors: Doctor[];
  registeredMentors: RegisteredMentor[];
  addMentor: (mentorData: Omit<RegisteredMentor, 'id' | 'rating' | 'availability' | 'nextAvailable' | 'image' | 'registeredAt'>) => void;
  
  // Users and Patients
  userProfiles: UserProfile[];
  patients: Patient[];
  addUserProfile: (userData: Omit<UserProfile, 'id' | 'registeredAt' | 'lastActive' | 'progressScore' | 'completedActivities' | 'totalActivities' | 'daysInRecovery'>) => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  assignMentorToUser: (userId: string, mentorId: number) => void;
  
  // Appointments
  appointments: Appointment[];
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notificationData: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  
  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescriptionData: Omit<Prescription, 'id'>) => void;
  
  // Statistics
  getStatistics: () => {
    totalUsers: number;
    totalMentors: number;
    totalAppointments: number;
    activeUsers: number;
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [registeredMentors, setRegisteredMentors] = useState<RegisteredMentor[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);

  // Generate random avatar for mentors
  const generateAvatar = (name: string): string => {
    const avatars = [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1594824475317-d8b0b4b5b8b5?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face"
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const addMentor = (mentorData: Omit<RegisteredMentor, 'id' | 'rating' | 'availability' | 'nextAvailable' | 'image' | 'registeredAt'>) => {
    const newMentor: RegisteredMentor = {
      ...mentorData,
      id: Date.now(),
      rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
      availability: 'available',
      nextAvailable: 'Today 3:00 PM',
      image: generateAvatar(mentorData.name),
      registeredAt: new Date().toISOString()
    };

    setRegisteredMentors(prev => [...prev, newMentor]);

    // Also add to doctors list for booking
    const doctorEntry: Doctor = {
      id: newMentor.id,
      name: newMentor.name,
      specialization: newMentor.specialization,
      experience: newMentor.experience,
      rating: newMentor.rating,
      availability: newMentor.availability,
      image: newMentor.image,
      consultationFee: newMentor.consultationFee,
      nextAvailable: newMentor.nextAvailable
    };

    setDoctors(prev => [...prev, doctorEntry]);

    // Add welcome notification
    addNotification({
      userId: 'system',
      type: 'achievement',
      title: 'New Mentor Registered!',
      message: `${newMentor.name} has joined as a ${newMentor.specialization} specialist.`,
      read: false
    });
  };

  const addUserProfile = (userData: Omit<UserProfile, 'id' | 'registeredAt' | 'lastActive' | 'progressScore' | 'completedActivities' | 'totalActivities' | 'daysInRecovery'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      progressScore: 0,
      completedActivities: 0,
      totalActivities: 8,
      daysInRecovery: 1
    };

    setUserProfiles(prev => [...prev, newUser]);

    // Add to patients list if risk level is medium or high
    if (userData.riskLevel && (userData.riskLevel === 'medium' || userData.riskLevel === 'high')) {
      const patientEntry: Patient = {
        id: parseInt(newUser.id, 36),
        name: newUser.name,
        age: newUser.age,
        riskLevel: userData.riskLevel,
        lastAssessment: new Date().toISOString().split('T')[0],
        progress: 0,
        currentPlan: `${userData.riskLevel === 'high' ? 'Intensive' : 'Standard'} recovery program`
      };

      setPatients(prev => [...prev, patientEntry]);
    }

    // Auto-assign mentor for medium/high risk users
    if (userData.riskLevel && (userData.riskLevel === 'medium' || userData.riskLevel === 'high') && registeredMentors.length > 0) {
      const availableMentor = registeredMentors.find(m => m.availability === 'available');
      if (availableMentor) {
        assignMentorToUser(newUser.id, availableMentor.id);
      }
    }
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUserProfiles(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates, lastActive: new Date().toISOString() } : user
    ));
  };

  const assignMentorToUser = (userId: string, mentorId: number) => {
    setUserProfiles(prev => prev.map(user => 
      user.id === userId ? { ...user, assignedMentorId: mentorId } : user
    ));

    const mentor = registeredMentors.find(m => m.id === mentorId);
    const user = userProfiles.find(u => u.id === userId);

    if (mentor && user) {
      addNotification({
        userId: userId,
        type: 'appointment',
        title: 'Mentor Assigned!',
        message: `${mentor.name} has been assigned as your mentor. You can now book appointments.`,
        read: false
      });
    }
  };

  const bookAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);

    // Add confirmation notification
    addNotification({
      userId: appointmentData.userId,
      type: 'appointment',
      title: 'Appointment Confirmed!',
      message: `Your appointment on ${appointmentData.date} at ${appointmentData.time} has been confirmed.`,
      read: false
    });
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, ...updates } : apt
    ));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const addPrescription = (prescriptionData: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: Date.now()
    };

    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const getStatistics = () => ({
    totalUsers: userProfiles.length,
    totalMentors: registeredMentors.length,
    totalAppointments: appointments.length,
    activeUsers: userProfiles.filter(u => {
      const lastActive = new Date(u.lastActive);
      const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 7;
    }).length
  });

  const value: AppDataContextType = {
    doctors,
    registeredMentors,
    addMentor,
    userProfiles,
    patients,
    addUserProfile,
    updateUserProfile,
    assignMentorToUser,
    appointments,
    bookAppointment,
    updateAppointment,
    notifications,
    addNotification,
    markNotificationRead,
    prescriptions,
    addPrescription,
    getStatistics
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
