import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { emergencyNotificationService } from '../services/EmergencyNotificationService';
import { directNotificationService } from '../services/DirectNotificationService';
import {
  Emergency as EmergencyIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  riskLevel: string;
  timestamp: string;
  status: string;
  message: string;
  phoneNumbers: string[];
}

const EmergencyDashboard: React.FC = () => {
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadEmergencyAlerts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadEmergencyAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadEmergencyAlerts = () => {
    try {
      const alerts = emergencyNotificationService.getAllNotifications();
      setEmergencyAlerts(alerts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load emergency alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallEmergencyContact = (phoneNumber: string, userName: string) => {
    const telUrl = `tel:+91${phoneNumber}`;
    window.open(telUrl, '_blank');
    
    // Log the action
    console.log(`📞 Calling ${phoneNumber} for emergency user: ${userName}`);
  };

  const handleSendDirectNotification = async (userName: string) => {
    try {
      await directNotificationService.sendEmergencyNotification(userName, [
        'Manual emergency notification triggered',
        'Immediate intervention required',
        'Contact user for crisis support'
      ]);
      console.log(`📞 Direct notification sent for ${userName}`);
    } catch (error) {
      console.error('Failed to send direct notification:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return CheckIcon;
      case 'failed': return ErrorIcon;
      case 'pending': return WarningIcon;
      default: return TimeIcon;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading Emergency Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <EmergencyIcon className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Emergency Dashboard</h1>
                <p className="text-gray-600">Monitor and respond to high-risk user alerts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {formatTime(lastRefresh.toISOString())}
              </div>
              <button
                onClick={loadEmergencyAlerts}
                className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <RefreshIcon className="text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Alerts', value: emergencyAlerts.length, color: 'bg-red-500', icon: EmergencyIcon },
            { label: 'Sent Successfully', value: emergencyAlerts.filter(a => a.status === 'sent').length, color: 'bg-green-500', icon: CheckIcon },
            { label: 'Failed', value: emergencyAlerts.filter(a => a.status === 'failed').length, color: 'bg-red-600', icon: ErrorIcon },
            { label: 'Pending', value: emergencyAlerts.filter(a => a.status === 'pending').length, color: 'bg-yellow-500', icon: WarningIcon }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Emergency Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Recent Emergency Alerts</h2>
          </div>
          
          {emergencyAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <EmergencyIcon className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Emergency Alerts</h3>
              <p className="text-gray-400">All users are currently safe. Emergency alerts will appear here when high-risk users are detected.</p>
            </div>
          ) : (
            <div className="divide-y">
              {emergencyAlerts.map((alert, index) => {
                const StatusIcon = getStatusIcon(alert.status);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{alert.userName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                            <StatusIcon className="inline w-4 h-4 mr-1" />
                            {alert.status.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {alert.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <TimeIcon className="w-4 h-4 mr-1" />
                            {formatTime(alert.timestamp)}
                          </span>
                          <span>User ID: {alert.userId}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <div className="text-sm text-gray-600 mb-2">Emergency Contacts:</div>
                        {alert.phoneNumbers.map((phone, phoneIndex) => (
                          <button
                            key={phoneIndex}
                            onClick={() => handleCallEmergencyContact(phone, alert.userName)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <PhoneIcon className="w-4 h-4" />
                            <span>+91{phone}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => handleSendDirectNotification(alert.userName)}
                          className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <EmergencyIcon className="w-4 h-4" />
                          <span>Send Alert</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Emergency Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Response Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => directNotificationService.testDirectNotifications()}
              className="flex items-center space-x-3 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <PhoneIcon />
              <span>Test Emergency System</span>
            </button>
            <button
              onClick={() => window.open('tel:+919150397529', '_blank')}
              className="flex items-center space-x-3 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PhoneIcon />
              <span>Call Primary Contact</span>
            </button>
            <button
              onClick={loadEmergencyAlerts}
              className="flex items-center space-x-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <RefreshIcon />
              <span>Refresh Alerts</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
