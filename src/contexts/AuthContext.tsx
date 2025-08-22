import React, { createContext, useContext, useState, ReactNode } from 'react';
import { backendAuthService, AuthResponse } from '../services/BackendAuthService';
import { patientService, Patient } from '../services/PatientService';

export type UserType = 'user' | 'mentor' | 'doctor';
export type RiskLevel = 'safe' | 'medium' | 'high' | null;

interface User {
  id: string;
  name: string;
  email?: string;
  type: UserType;
  riskLevel?: RiskLevel;
  age?: number;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  patientId?: string; // Link to patient record for users
}

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  riskLevel: RiskLevel;
  isAuthenticated: boolean;
  login: (userType: UserType, userData?: Partial<User>) => void;
  logout: () => void;
  setRiskLevel: (level: RiskLevel) => void;
  registerPatient: (patientData: Omit<Patient, 'id' | 'registrationDate' | 'lastActive' | 'notes'>) => Patient;
  getCurrentPatient: () => Patient | null;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [riskLevel, setRiskLevelState] = useState<RiskLevel>(null);

  const login = async (type: UserType, userData?: Partial<User>, credentials?: { email?: string; phone?: string; password: string }) => {
    try {
      // If credentials provided, try backend authentication
      if (credentials) {
        const response = await backendAuthService.login({
          ...credentials,
          userType: type
        });

        if (response.success && response.data) {
          const backendUser = response.data.user;
          const newUser: User = {
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            type: backendUser.userType,
            riskLevel: backendUser.riskLevel || null,
          };

          setUser(newUser);
          setUserType(backendUser.userType);
          if (backendUser.riskLevel) {
            setRiskLevelState(backendUser.riskLevel);
          }

          console.log('✅ Backend authentication successful');
          return { success: true, user: newUser };
        } else {
          console.error('❌ Backend authentication failed:', response.error);
          return { success: false, error: response.error };
        }
      } else {
        // Fallback to local authentication (for demo/offline mode)
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: userData?.name || (type === 'user' ? 'User' : type === 'mentor' ? 'Mentor' : 'Doctor'),
          email: userData?.email,
          type,
          riskLevel: userData?.riskLevel || null,
        };

        setUser(newUser);
        setUserType(type);
        if (userData?.riskLevel) {
          setRiskLevelState(userData.riskLevel);
        }

        console.log('✅ Local authentication successful');
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const logout = async () => {
    try {
      // Try backend logout
      await backendAuthService.logout();
    } catch (error) {
      console.error('Backend logout error:', error);
    }

    // Always clear local state
    setUser(null);
    setUserType(null);
    setRiskLevelState(null);

    console.log('✅ User logged out');
  };

  const setRiskLevel = (level: RiskLevel) => {
    setRiskLevelState(level);
    if (user) {
      const updatedUser = { ...user, riskLevel: level };
      setUser(updatedUser);

      // Update patient record if user is a patient
      if (user.patientId && level) {
        patientService.updatePatient(user.patientId, { riskLevel: level });
      }
    }
  };

  const registerPatient = (patientData: Omit<Patient, 'id' | 'registrationDate' | 'lastActive' | 'notes'>): Patient => {
    const newPatient = patientService.addPatient(patientData);

    // Update current user with patient ID if they're a user
    if (user && user.type === 'user') {
      const updatedUser = { ...user, patientId: newPatient.id };
      setUser(updatedUser);
    }

    return newPatient;
  };

  const getCurrentPatient = (): Patient | null => {
    if (!user || user.type !== 'user' || !user.patientId) {
      return null;
    }
    return patientService.getPatientById(user.patientId);
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // If user is a patient, update patient record too
    if (user.type === 'user' && user.patientId) {
      patientService.updatePatient(user.patientId, {
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        phone: updatedUser.phone,
        emergencyContact: updatedUser.emergencyContact,
        emergencyPhone: updatedUser.emergencyPhone,
        riskLevel: updatedUser.riskLevel && updatedUser.riskLevel !== null ? updatedUser.riskLevel : undefined
      });
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    riskLevel,
    isAuthenticated: !!user,
    login,
    logout,
    setRiskLevel,
    registerPatient,
    getCurrentPatient,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
