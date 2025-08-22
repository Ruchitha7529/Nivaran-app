import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import NotificationCenter from '../NotificationCenter';
import MessagingCenter from '../MessagingCenter';
import EmergencyDashboard from '../EmergencyDashboard';
import { patientService, Patient } from '../../services/PatientService';
import { messagingService } from '../../services/MessagingService';
import { recoveryPlanService } from '../../services/RecoveryPlanService';
import { recoveryPlanStages } from '../../data/staticData';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Medication as MedicationIcon,
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Update as UpdateIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Message as MessageIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { prescriptions, doctors } = useAppData();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  // ...existing code...
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingPatient, setMessagingPatient] = useState<Patient | null>(null);
  const [showTreatmentUpdate, setShowTreatmentUpdate] = useState(false);
  const [showRecoveryPlan, setShowRecoveryPlan] = useState(false);
  const [selectedPatientPlan, setSelectedPatientPlan] = useState<any>(null);
  const [showEmergencyDashboard, setShowEmergencyDashboard] = useState(false);

  // Load patients from PatientService
  useEffect(() => {
    const loadPatients = () => {
      const allPatients = patientService.getAllPatients();
      setPatients(allPatients);
    // ...existing code...
    };

    loadPatients();

    // Subscribe to patient updates
    const unsubscribe = patientService.subscribe((updatedPatients) => {
      setPatients(updatedPatients);
  // ...existing code...
    });

    return unsubscribe;
  }, []);

  // Handle messaging
  const handleSendMessage = (patient: Patient) => {
    setMessagingPatient(patient);
    setShowMessaging(true);
  };

  // Handle treatment plan update
  // ...existing code...

  // Handle activity assignment
  // ...existing code...

  // Handle recovery plan viewing
  const handleViewRecoveryPlan = (patient: Patient) => {
    const riskLevel = patient.riskLevel as 'safe' | 'medium' | 'high';
    const planData = recoveryPlanStages[riskLevel];
    setSelectedPatientPlan({ patient, plan: planData });
    setShowRecoveryPlan(true);
  };

  // Set first patient as selected when patients load
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return CheckCircleIcon;
      case 'medium': return WarningIcon;
      case 'high': return EmergencyIcon;
      default: return PersonIcon;
    }
  };

  const patientPrescriptions = selectedPatient ? prescriptions.filter(p => p.patientId === parseInt(selectedPatient.id.replace('patient-', ''))) : [];

  // Show empty state if no patients
  if (patients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Mentor Dashboard - {user?.name}</h1>
                  <p className="text-sm text-gray-600">Monitor and support patient recovery journeys</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-gray-300 mb-8"
            >
              <PersonIcon style={{ fontSize: 120 }} />
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Patients Yet</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
              Patients will appear here once they complete their risk assessments and are assigned to you.
              Your dashboard will come alive with patient data and progress tracking.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg"
            >
              <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-center">
                <SecurityIcon className="mr-2" />
                Getting Started
              </h4>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-blue-700 font-medium">Users complete the comprehensive risk assessment quiz</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-purple-700 font-medium">Medium and high-risk users are automatically assigned to mentors</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-pink-700 font-medium">You'll receive notifications and can start monitoring their progress</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length.toString(),
      icon: PersonIcon,
      color: 'text-blue-600'
    },
    {
      label: 'High Risk Patients',
      value: patients.filter(p => p.riskLevel === 'high').length.toString(),
      icon: EmergencyIcon,
      color: 'text-red-600'
    },
    {
      label: 'Active Prescriptions',
      value: prescriptions.length.toString(),
      icon: MedicationIcon,
      color: 'text-green-600'
    },
    {
      label: 'Average Progress',
      value: patients.length > 0 ? `${Math.round(patients.reduce((acc, p) => acc + p.progressData.moodScore * 10, 0) / patients.length)}%` : '0%',
      icon: TrendingUpIcon,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <PsychologyIcon className="text-white text-2xl" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                >
                  Mentor Dashboard
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 flex items-center"
                >
                  <FavoriteIcon className="mr-1 text-red-400 text-sm" />
                  Welcome back, {user?.name} • Supporting recovery journeys
                </motion.p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <SecurityIcon className="text-green-600 text-sm" />
                <span className="text-sm font-medium text-green-700">Secure Session</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmergencyDashboard(!showEmergencyDashboard)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg transition-all duration-200"
              >
                <EmergencyIcon className="text-sm" />
                <span className="font-medium">Emergency Dashboard</span>
              </motion.button>
              <NotificationCenter />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all duration-200"
              >
                <LogoutIcon className="text-sm" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(parseInt(stat.value) * 10, 100)}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                        className={`h-1.5 rounded-full bg-gradient-to-r ${
                          stat.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                          stat.color.includes('red') ? 'from-red-400 to-red-600' :
                          stat.color.includes('green') ? 'from-green-400 to-green-600' :
                          'from-purple-400 to-purple-600'
                        }`}
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ml-4 ${
                      stat.color.includes('blue') ? 'bg-gradient-to-r from-blue-100 to-blue-200' :
                      stat.color.includes('red') ? 'bg-gradient-to-r from-red-100 to-red-200' :
                      stat.color.includes('green') ? 'bg-gradient-to-r from-green-100 to-green-200' :
                      'bg-gradient-to-r from-purple-100 to-purple-200'
                    }`}
                  >
                    <IconComponent className={`text-2xl ${stat.color}`} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <PersonIcon className="mr-2 text-purple-600" />
                Patient List
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {patients.length} patients
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {patients.map((patient, index) => {
                const RiskIcon = getRiskLevelIcon(patient.riskLevel);
                const isSelected = selectedPatient?.id === patient.id;

                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{patient.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <PersonIcon className="mr-1 text-xs" />
                            {patient.age}y
                          </span>
                          <span className="flex items-center">
                            <TrendingUpIcon className="mr-1 text-xs" />
                            {Math.round(patient.progressData.moodScore * 10)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(patient.progressData.moodScore * 10)}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                            className={`h-1.5 rounded-full ${
                              patient.riskLevel === 'safe' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                              patient.riskLevel === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(patient.riskLevel)} shadow-sm`}>
                          <RiskIcon className="mr-1 text-sm" />
                          {patient.riskLevel.toUpperCase()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{patient.progressData.lastAssessment}</p>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendMessage(patient);
                            }}
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                            title="Send Message"
                          >
                            <MessageIcon className="text-sm" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(patient);
                              setShowTreatmentUpdate(true);
                            }}
                            className="p-1.5 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                            title="Update Treatment"
                          >
                            <AssignmentIcon className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced Patient Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedPatient ? (
              <>
                {/* Enhanced Patient Info Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <AssignmentIcon className="mr-3 text-purple-600" />
                      Patient Details
                    </h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getRiskLevelColor(selectedPatient.riskLevel)}`}
                    >
                      {React.createElement(getRiskLevelIcon(selectedPatient.riskLevel), { className: "mr-2" })}
                      {selectedPatient.riskLevel.toUpperCase()} RISK
                    </motion.div>
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <PersonIcon className="mr-2 text-purple-600" />
                      {selectedPatient.name}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium text-gray-700">Age:</span>
                        <span className="text-gray-800 font-semibold">{selectedPatient.age} years</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium text-gray-700">Last Assessment:</span>
                        <span className="text-gray-800 font-semibold">{selectedPatient.progressData.lastAssessment}</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <span className="font-medium text-gray-700 block mb-2">Recovery Plan:</span>
                        {selectedPatient.riskLevel === 'high' && (
                          <span className="text-red-700 font-semibold">
                            Intensive Recovery Program:<br />
                            - Daily therapy sessions<br />
                            - Medication management<br />
                            - Emergency support access<br />
                            - Weekly mentor check-ins
                          </span>
                        )}
                        {selectedPatient.riskLevel === 'medium' && (
                          <span className="text-yellow-700 font-semibold">
                            Standard Recovery Program:<br />
                            - Weekly therapy sessions<br />
                            - Group support meetings<br />
                            - Bi-weekly mentor check-ins<br />
                            - Lifestyle coaching
                          </span>
                        )}
                        {selectedPatient.riskLevel === 'safe' && (
                          <span className="text-green-700 font-semibold">
                            Maintenance Recovery Program:<br />
                            - Monthly mentor check-ins<br />
                            - Self-help resources<br />
                            - Community activities<br />
                            - Progress monitoring
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <TrendingUpIcon className="mr-2 text-green-600" />
                      Recovery Progress
                    </h4>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800 mb-2">{Math.round(selectedPatient.progressData.moodScore * 10)}%</div>
                        <div className="text-sm text-gray-600">Overall Progress</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
                        <motion.div
                          className={`h-6 rounded-full shadow-lg ${
                            Math.round(selectedPatient.progressData.moodScore * 10) >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            Math.round(selectedPatient.progressData.moodScore * 10) >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(selectedPatient.progressData.moodScore * 10)}%` }}
                          transition={{ duration: 1.5, delay: 1.2 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Started</span>
                        <span>Recovery Goal</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Prescriptions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <MedicationIcon className="mr-3 text-blue-600" />
                Current Prescriptions
                <span className="ml-auto text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                  {patientPrescriptions.length} active
                </span>
              </h3>
              {patientPrescriptions.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {patientPrescriptions.map((prescription, index) => {
                    const doctor = doctors.find(d => d.id === prescription.doctorId);
                    return (
                      <motion.div
                        key={prescription.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="border-2 border-blue-200 rounded-xl p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <MedicationIcon className="mr-2 text-blue-600" />
                              <h4 className="font-bold text-gray-800 text-lg">{prescription.medication}</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-600 w-20">Dosage:</span>
                                <span className="text-sm text-gray-800 font-semibold">{prescription.dosage}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-600 w-20">Frequency:</span>
                                <span className="text-sm text-gray-800 font-semibold">{prescription.frequency}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-600 w-20">Duration:</span>
                                <span className="text-sm text-gray-800 font-semibold">{prescription.duration}</span>
                              </div>
                              {prescription.notes && (
                                <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                                  <p className="text-sm text-blue-800 font-medium">
                                    <span className="font-bold">Note:</span> {prescription.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                              <p className="text-sm font-bold text-gray-800">Mentor: {doctor?.name}</p>
                              <p className="text-xs text-gray-500">{prescription.prescribedDate}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-center py-8"
                >
                  <MedicationIcon className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No current prescriptions</p>
                  <p className="text-gray-400 text-sm mt-2">Prescriptions will appear here when assigned by doctors</p>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewRecoveryPlan(selectedPatient)}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <AssignmentIcon className="text-xl" />
                <span>View Recovery Plan</span>
              </motion.button>
              <motion.button
                onClick={() => setShowMessaging(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <ChatIcon className="text-xl" />
                <span>Send Message</span>
              </motion.button>
              <motion.button
                onClick={() => setShowTreatmentUpdate(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <UpdateIcon className="text-xl" />
                <span>Update Plan</span>
              </motion.button>
            </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-white/20"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-gray-300 mb-6"
                >
                  <PersonIcon style={{ fontSize: 80 }} />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Patient</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Choose a patient from the list to view their details and manage their treatment.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <p className="text-purple-800 text-sm font-medium">
                    <strong>💡 Tip:</strong> Click on any patient card to see their detailed information,
                    progress tracking, and current prescriptions.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Messaging Center */}
      <MessagingCenter
        recipientId={messagingPatient?.id}
        recipientName={messagingPatient?.name}
        recipientType="patient"
        isOpen={showMessaging}
        onClose={() => {
          setShowMessaging(false);
          setMessagingPatient(null);
        }}
      />

      {/* Recovery Plan Modal */}
      {showRecoveryPlan && selectedPatientPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatientPlan.plan.title}</h2>
                  <p className="text-indigo-100 mt-1">Patient: {selectedPatientPlan.patient.name}</p>
                  <p className="text-indigo-200 text-sm">{selectedPatientPlan.plan.description}</p>
                </div>
                <button
                  onClick={() => setShowRecoveryPlan(false)}
                  className="text-white hover:text-indigo-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Recovery Plan Stages */}
            <div className="p-6">
              <div className="space-y-8">
                {selectedPatientPlan.plan.stages.map((stage: any, index: number) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {stage.id}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{stage.name}</h3>
                          <p className="text-indigo-600 font-medium">{stage.duration}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{stage.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Goals */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                          <TrendingUpIcon className="mr-2" />
                          Goals
                        </h4>
                        <ul className="space-y-2">
                          {stage.goals.map((goal: string, goalIndex: number) => (
                            <li key={goalIndex} className="text-blue-700 text-sm flex items-start">
                              <CheckCircleIcon className="mr-2 mt-0.5 text-xs" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Activities */}
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="font-bold text-green-800 mb-3 flex items-center">
                          <AssignmentIcon className="mr-2" />
                          Activities
                        </h4>
                        <ul className="space-y-3">
                          {stage.activities.map((activity: any, actIndex: number) => (
                            <li key={actIndex} className="text-green-700 text-sm">
                              <div className="font-medium">{activity.name}</div>
                              <div className="text-green-600 text-xs">
                                {activity.frequency} • {activity.duration}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Milestones */}
                      <div className="bg-purple-50 rounded-xl p-4">
                        <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                          <FavoriteIcon className="mr-2" />
                          Milestones
                        </h4>
                        <ul className="space-y-2">
                          {stage.milestones.map((milestone: string, milestoneIndex: number) => (
                            <li key={milestoneIndex} className="text-purple-700 text-sm flex items-start">
                              <SecurityIcon className="mr-2 mt-0.5 text-xs" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setShowRecoveryPlan(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowRecoveryPlan(false);
                    setShowTreatmentUpdate(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Update Plan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Emergency Dashboard Modal */}
      {showEmergencyDashboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEmergencyDashboard(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <EmergencyDashboard />
          </motion.div>
        </motion.div>
      )}

      {/* Treatment Update Modal */}
      {showTreatmentUpdate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTreatmentUpdate(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <UpdateIcon className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Update Treatment Plan</h2>
                    <p className="text-gray-600">Modify patient recovery plan and goals</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTreatmentUpdate(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Treatment Update Form */}
              <div className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Patient
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Choose a patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.riskLevel} risk
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Update Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <AssignmentIcon className="text-green-600 text-sm" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Activities</h3>
                          <p className="text-sm text-gray-600">Update daily activities</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUpIcon className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Goals</h3>
                          <p className="text-sm text-gray-600">Modify recovery goals</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <ScheduleIcon className="text-purple-600 text-sm" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Schedule</h3>
                          <p className="text-sm text-gray-600">Adjust timeline</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Activities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Activities
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Activity name..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add notes about patient progress, challenges, or recommendations..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Risk Level Adjustment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level Assessment
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 cursor-pointer transition-colors">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CheckCircleIcon className="text-green-600" />
                        </div>
                        <h3 className="font-medium text-green-800">Safe</h3>
                        <p className="text-sm text-green-600">Low risk, stable progress</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 cursor-pointer transition-colors">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <WarningIcon className="text-yellow-600" />
                        </div>
                        <h3 className="font-medium text-yellow-800">Medium</h3>
                        <p className="text-sm text-yellow-600">Moderate risk, needs monitoring</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-red-200 rounded-lg hover:border-red-400 cursor-pointer transition-colors">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ErrorIcon className="text-red-600" />
                        </div>
                        <h3 className="font-medium text-red-800">High</h3>
                        <p className="text-sm text-red-600">High risk, immediate attention</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowTreatmentUpdate(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle plan update
                      console.log('✅ Treatment plan updated successfully');
                      alert('Treatment plan updated successfully!');
                      setShowTreatmentUpdate(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Update Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MentorDashboard;
