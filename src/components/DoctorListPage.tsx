import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const DoctorListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, bookAppointment } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  const specializations = ['all', 'Addiction Medicine', 'Psychiatry', 'Behavioral Therapy', 'Family Medicine'];
  const availabilityOptions = ['all', 'available', 'busy', 'offline'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || doctor.specialization === selectedSpecialization;
    const matchesAvailability = selectedAvailability === 'all' || doctor.availability === selectedAvailability;
    
    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const [bookingDoctor, setBookingDoctor] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookAppointment = (doctorId: number) => {
    setBookingDoctor(doctorId);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    const doctor = doctors.find(d => d.id === bookingDoctor);
    if (doctor && user) {
      // Book the appointment
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1); // Tomorrow

      bookAppointment({
        userId: user.id,
        doctorId: doctor.id,
        date: appointmentDate.toISOString().split('T')[0],
        time: doctor.nextAvailable.split(' ').slice(-2).join(' '),
        status: 'scheduled',
        type: 'consultation'
      });

      alert(`✅ Appointment booked with ${doctor.name} for ${doctor.nextAvailable}. You will receive a confirmation email shortly.`);
      setShowBookingModal(false);
      setBookingDoctor(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Find a Doctor</h1>
                <p className="text-sm text-gray-600">Connect with qualified medical professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availabilityOptions.map(avail => (
                <option key={avail} value={avail}>
                  {avail === 'all' ? 'All Availability' : avail.charAt(0).toUpperCase() + avail.slice(1)}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-gray-600">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Doctor Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getAvailabilityColor(doctor.availability)}`}>
                  {doctor.availability.charAt(0).toUpperCase() + doctor.availability.slice(1)}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                <p className="text-gray-600 text-sm mb-4">{doctor.experience} years experience</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({doctor.rating})</span>
                </div>

                {/* Consultation Fee */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-semibold text-gray-800">${doctor.consultationFee}</span>
                </div>

                {/* Next Available */}
                <div className="flex items-center mb-6">
                  <ScheduleIcon className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Next available: {doctor.nextAvailable}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookAppointment(doctor.id)}
                    disabled={doctor.availability === 'offline'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      doctor.availability === 'offline'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {doctor.availability === 'offline' ? 'Currently Offline' : 'Book Appointment'}
                  </motion.button>

                  {doctor.availability !== 'offline' && (
                    <div className="grid grid-cols-3 gap-2">
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <VideoCallIcon className="text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <PhoneIcon className="text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageIcon className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <SearchIcon style={{ fontSize: 64 }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <PhoneIcon className="text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800">Emergency Support</h3>
              <p className="text-red-700 mt-1">
                If you're experiencing a medical emergency or crisis, please call 911 or your local emergency services immediately.
                For crisis support, call the National Suicide Prevention Lifeline at 988.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && bookingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            {(() => {
              const doctor = doctors.find(d => d.id === bookingDoctor);
              return doctor ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Book Appointment with {doctor.name}
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium">{doctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Available:</span>
                      <span className="font-medium text-green-600">{doctor.nextAvailable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Fee:</span>
                      <span className="font-medium">${doctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">⭐ {doctor.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              ) : null;
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;
