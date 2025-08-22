import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/MessagingService';
import {
  LocalHospital as DoctorIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  location: string;
  phone: string;
  email: string;
  bio: string;
  languages: string[];
  consultationFee: number;
  nextAvailable: string;
}

interface DoctorSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onDoctorSelected: (doctor: Doctor) => void;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  isOpen,
  onClose,
  onDoctorSelected
}) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with sample doctors
    setDoctors([
      {
        id: 'doctor-1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Addiction Medicine Specialist',
        experience: 12,
        rating: 4.9,
        availability: 'available',
        location: 'New York, NY',
        phone: '+1-555-0123',
        email: 'sarah.johnson@nivaranhealth.com',
        bio: 'Board-certified addiction medicine specialist with over 12 years of experience in comprehensive addiction treatment. Expert in medication-assisted treatment (MAT), behavioral therapy, and dual diagnosis. Committed to providing compassionate, evidence-based care for individuals on their recovery journey.',
        languages: ['English', 'Spanish'],
        consultationFee: 200,
        nextAvailable: 'Today 2:00 PM'
      },
      {
        id: 'doctor-2',
        name: 'Dr. Michael Chen',
        specialization: 'Psychiatrist & Dual Diagnosis Expert',
        experience: 8,
        rating: 4.7,
        availability: 'available',
        location: 'Los Angeles, CA',
        phone: '+1-555-0124',
        email: 'michael.chen@nivaranhealth.com',
        bio: 'Board-certified psychiatrist with specialized training in dual diagnosis treatment. Expert in treating co-occurring mental health disorders and substance use disorders. Utilizes integrated treatment approaches combining psychotherapy and medication management.',
        languages: ['English', 'Mandarin', 'Cantonese'],
        consultationFee: 180,
        nextAvailable: 'Tomorrow 9:00 AM'
      },
      {
        id: 'doctor-3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Clinical Psychologist & CBT Specialist',
        experience: 15,
        rating: 4.8,
        availability: 'busy',
        location: 'Chicago, IL',
        phone: '+1-555-0125',
        email: 'emily.rodriguez@nivaranhealth.com',
        bio: 'Licensed clinical psychologist with 15+ years of experience in addiction recovery therapy. Specializes in Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and trauma-informed care. Passionate about helping individuals develop healthy coping strategies and achieve lasting recovery.',
        languages: ['English', 'Spanish', 'Portuguese'],
        consultationFee: 150,
        nextAvailable: 'Next Week Monday 11:00 AM'
      },
      {
        id: 'doctor-4',
        name: 'Dr. James Wilson',
        specialization: 'Family Medicine & Addiction Care',
        experience: 10,
        rating: 4.6,
        availability: 'available',
        location: 'Houston, TX',
        phone: '+1-555-0126',
        email: 'james.wilson@nivaranhealth.com',
        bio: 'Board-certified family physician with specialized training in addiction medicine. Provides comprehensive primary care with a focus on addiction treatment, including medication management and family therapy integration.',
        languages: ['English'],
        consultationFee: 160,
        nextAvailable: 'Today 4:30 PM'
      }
    ]);
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());
    return matchesSearch && matchesSpecialization;
  });

  const handleSelectDoctor = async (doctor: Doctor) => {
    if (!user) return;

    setLoading(true);
    try {
      // Notify the doctor about the patient selection
      messagingService.notifyDoctorSelection(doctor.id, user.id, user.name);
      
      // Call the callback
      onDoctorSelected(doctor);
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error selecting doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DoctorIcon className="text-3xl" />
              <div>
                <h2 className="text-2xl font-bold">Select Your Doctor</h2>
                <p className="text-blue-100">Choose a healthcare professional for your recovery journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="addiction">Addiction Medicine</option>
                <option value="psychiatry">Psychiatry</option>
                <option value="psychology">Clinical Psychology</option>
              </select>
            </div>
          </div>

          {/* Doctors List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  {/* Professional Header with Photo */}
                  <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white">
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(doctor.availability)} bg-white/20 backdrop-blur-sm`}>
                      {getAvailabilityText(doctor.availability)}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      {/* Professional Photo Placeholder */}
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border-4 border-white/30 group-hover:scale-110 transition-transform duration-300">
                        <DoctorIcon className="text-3xl text-white" />
                      </div>

                      <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                      <p className="text-blue-100 font-medium mb-2">{doctor.specialization}</p>

                      {/* Rating and Experience */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(doctor.rating) ? 'text-yellow-300' : 'text-white/30'
                              }`}
                            />
                          ))}
                          <span className="text-white/90 ml-1">{doctor.rating}</span>
                        </div>
                        <span className="text-white/60">•</span>
                        <span className="text-white/90">{doctor.experience} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">

                    {/* Professional Bio */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">About</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>

                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <ScheduleIcon className="mr-3 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">Next Available</p>
                          <p className="text-gray-600">{doctor.nextAvailable}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <PhoneIcon className="mr-3 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">Phone</p>
                          <p className="text-gray-600">{doctor.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <EmailIcon className="mr-3 text-purple-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">Email</p>
                          <p className="text-gray-600">{doctor.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Languages and Consultation Fee */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h5 className="font-semibold text-gray-800 mb-2">Languages Spoken</h5>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-xl text-center">
                        <h5 className="font-semibold text-gray-800 mb-1">Consultation Fee</h5>
                        <p className="text-2xl font-bold text-green-600">${doctor.consultationFee}</p>
                        <p className="text-xs text-gray-600">per session</p>
                      </div>
                    </div>

                    {/* Professional Select Button */}
                    <button
                      onClick={() => handleSelectDoctor(doctor)}
                      disabled={loading || doctor.availability === 'offline'}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                        doctor.availability === 'offline'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 transform'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Selecting...</span>
                        </>
                      ) : doctor.availability === 'offline' ? (
                        <>
                          <span>Currently Unavailable</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="text-xl" />
                          <span>Choose Dr. {doctor.name.split(' ')[1]}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <DoctorIcon className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No doctors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DoctorSelection;
