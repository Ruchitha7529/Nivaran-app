import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter';
import MessagingCenter from '../MessagingCenter';
import { messagingService } from '../../services/MessagingService';
import { patientService, Patient } from '../../services/PatientService';
import {
  LocalHospital as DoctorIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Medication as MedicationIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Psychology as PsychologyIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: string;
  status: 'active' | 'completed' | 'discontinued';
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingPatient, setMessagingPatient] = useState<Patient | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    if (user) {
      // Load patients assigned to this doctor
      const allPatients = patientService.getAllPatients();
      const doctorPatients = allPatients.filter(patient => 
        patient.assignedDoctor === user.id || patient.selectedDoctor === user.id
      );
      setPatients(doctorPatients);

      // Load prescriptions
      const savedPrescriptions = localStorage.getItem('nivaran_prescriptions');
      if (savedPrescriptions) {
        setPrescriptions(JSON.parse(savedPrescriptions));
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = (patient: Patient) => {
    setMessagingPatient(patient);
    setShowMessaging(true);
  };

  const handlePrescribeMedication = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
  };

  const handleSubmitPrescription = () => {
    if (!selectedPatient || !user) return;

    const prescription: Prescription = {
      id: `prescription-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      medication: newPrescription.medication,
      dosage: newPrescription.dosage,
      frequency: newPrescription.frequency,
      duration: newPrescription.duration,
      instructions: newPrescription.instructions,
      prescribedDate: new Date().toISOString(),
      status: 'active'
    };

    const updatedPrescriptions = [...prescriptions, prescription];
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('nivaran_prescriptions', JSON.stringify(updatedPrescriptions));

    // Send message to patient about new prescription
    messagingService.sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderType: 'doctor',
      recipientId: selectedPatient.id,
      recipientType: 'patient',
      subject: 'New Prescription Assigned',
      content: `I have prescribed ${prescription.medication} (${prescription.dosage}) for you. Please take ${prescription.frequency} for ${prescription.duration}. Instructions: ${prescription.instructions}`,
      messageType: 'treatment_update',
      relatedData: { treatmentPlanId: prescription.id }
    });

    // Reset form and close modal
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setShowPrescriptionModal(false);
    setSelectedPatient(null);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPatientStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="text-green-500" />;
      case 'needs_attention': return <WarningIcon className="text-yellow-500" />;
      case 'critical': return <EmergencyIcon className="text-red-500" />;
      default: return <PersonIcon className="text-gray-500" />;
    }
  };

  const dashboardStats = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.currentStatus === 'active').length,
    needsAttention: patients.filter(p => p.riskLevel === 'high').length,
    prescriptionsToday: prescriptions.filter(p => 
      new Date(p.prescribedDate).toDateString() === new Date().toDateString()
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <DoctorIcon className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome back, Dr. {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <PersonIcon className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Patients</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.activePatients}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Needs Attention</p>
                <p className="text-3xl font-bold text-red-600">{dashboardStats.needsAttention}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <WarningIcon className="text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Prescriptions Today</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardStats.prescriptionsToday}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MedicationIcon className="text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
            <p className="text-gray-600">Manage your assigned patients</p>
          </div>
          
          <div className="p-6">
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <PersonIcon className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No patients assigned</h3>
                <p className="text-gray-500">Patients will appear here when they select you as their doctor</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {patients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                          <p className="text-gray-600">{patient.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getPatientStatusIcon(patient.currentStatus)}
                            <span className="text-sm text-gray-600">{patient.currentStatus}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(patient.riskLevel)}`}>
                        {patient.riskLevel.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <span className="ml-2 font-medium">{patient.age}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 font-medium">{patient.phone}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSendMessage(patient)}
                        className="flex-1 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        <MessageIcon className="text-sm" />
                        <span>Message</span>
                      </button>
                      <button
                        onClick={() => handlePrescribeMedication(patient)}
                        className="flex-1 py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        <MedicationIcon className="text-sm" />
                        <span>Prescribe</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
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

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Prescribe Medication</h2>
              <p className="text-gray-600">For patient: {selectedPatient.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
                  <input
                    type="text"
                    value={newPrescription.medication}
                    onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Naltrexone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50mg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newPrescription.duration}
                    onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30 days"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Special instructions for the patient..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPrescription}
                disabled={!newPrescription.medication || !newPrescription.dosage || !newPrescription.frequency}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prescribe Medication
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
