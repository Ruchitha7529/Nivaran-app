import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patients, prescriptions, doctors } from '../../data/staticData';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  LocalHospital as DoctorIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Medication as MedicationIcon
} from '@mui/icons-material';

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

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

  const patientPrescriptions = prescriptions.filter(p => p.patientId === selectedPatient.id);

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
      value: `${Math.round(patients.reduce((acc, p) => acc + p.progress, 0) / patients.length)}%`,
      icon: TrendingUpIcon,
      color: 'text-purple-600'
    }
  ];

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
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <NotificationsIcon />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <IconComponent className={`text-3xl ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient List</h2>
            <div className="space-y-4">
              {patients.map((patient) => {
                const RiskIcon = getRiskLevelIcon(patient.riskLevel);
                const isSelected = selectedPatient.id === patient.id;
                
                return (
                  <motion.div
                    key={patient.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                        <p className="text-sm text-gray-600">Age: {patient.age}</p>
                        <p className="text-sm text-gray-600">Progress: {patient.progress}%</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getRiskLevelColor(patient.riskLevel)}`}>
                          <RiskIcon className="mr-1 text-sm" />
                          {patient.riskLevel.toUpperCase()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{patient.lastAssessment}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Patient Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Patient Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(selectedPatient.riskLevel)}`}>
                  {React.createElement(getRiskLevelIcon(selectedPatient.riskLevel), { className: "mr-2" })}
                  {selectedPatient.riskLevel.toUpperCase()} RISK
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{selectedPatient.name}</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Age:</span> {selectedPatient.age}</p>
                    <p className="text-gray-600"><span className="font-medium">Last Assessment:</span> {selectedPatient.lastAssessment}</p>
                    <p className="text-gray-600"><span className="font-medium">Current Plan:</span> {selectedPatient.currentPlan}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Recovery Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedPatient.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{selectedPatient.progress}% Complete</p>
                </div>
              </div>
            </div>

            {/* Prescriptions Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Prescriptions</h3>
              {patientPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {patientPrescriptions.map((prescription) => {
                    const doctor = doctors.find(d => d.id === prescription.doctorId);
                    return (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{prescription.medication}</h4>
                            <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
                            <p className="text-sm text-gray-600">Duration: {prescription.duration}</p>
                            {prescription.notes && (
                              <p className="text-sm text-blue-600 mt-1">Note: {prescription.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">{doctor?.name}</p>
                            <p className="text-xs text-gray-500">{prescription.prescribedDate}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No current prescriptions</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
              >
                Send Message to Patient
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
              >
                Update Treatment Plan
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
