import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/ApiService';
import {
  CloudDone as ConnectedIcon,
  CloudOff as DisconnectedIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Storage as DatabaseIcon
} from '@mui/icons-material';

interface BackendStatusProps {
  className?: string;
  showDetails?: boolean;
}

interface BackendStatus {
  isConnected: boolean;
  version?: string;
  uptime?: string;
  environment?: string;
  responseTime?: number;
  lastChecked: Date;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ 
  className = "", 
  showDetails = false 
}) => {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);
  const [showFullStatus, setShowFullStatus] = useState(showDetails);

  useEffect(() => {
    checkBackendStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const backendStatus = await apiService.getBackendStatus();
      const responseTime = Date.now() - startTime;
      
      setStatus({
        ...backendStatus,
        responseTime,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Backend status check failed:', error);
      setStatus({
        isConnected: false,
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-500 bg-yellow-100';
    return status.isConnected 
      ? 'text-green-500 bg-green-100' 
      : 'text-red-500 bg-red-100';
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    return status.isConnected ? 'Connected' : 'Disconnected';
  };

  const StatusIcon = isChecking 
    ? RefreshIcon 
    : status.isConnected 
      ? ConnectedIcon 
      : DisconnectedIcon;

  if (!showFullStatus) {
    // Compact status indicator
    return (
      <motion.div
        className={`flex items-center space-x-2 ${className}`}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowFullStatus(true)}
      >
        <div className={`w-3 h-3 rounded-full ${status.isConnected ? 'bg-green-500' : 'bg-red-500'} ${isChecking ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-gray-600">
          Backend {getStatusText()}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor()}`}>
            <StatusIcon className={`text-lg ${isChecking ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Backend Status</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={checkBackendStatus}
            disabled={isChecking}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshIcon className={`text-lg ${isChecking ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowFullStatus(false)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SettingsIcon className="text-lg" />
          </button>
        </div>
      </div>

      {/* Status Details */}
      {status.isConnected ? (
        <div className="space-y-3">
          {/* Connection Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <SpeedIcon className="text-blue-500 text-sm" />
              <div>
                <p className="text-xs text-gray-500">Response Time</p>
                <p className="text-sm font-medium">
                  {status.responseTime ? `${status.responseTime}ms` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DatabaseIcon className="text-purple-500 text-sm" />
              <div>
                <p className="text-xs text-gray-500">Environment</p>
                <p className="text-sm font-medium">
                  {status.environment || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(status.version || status.uptime) && (
            <div className="pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {status.version && (
                  <div>
                    <p className="text-xs text-gray-500">Version</p>
                    <p className="text-sm font-medium">{status.version}</p>
                  </div>
                )}
                {status.uptime && (
                  <div>
                    <p className="text-xs text-gray-500">Uptime</p>
                    <p className="text-sm font-medium">{status.uptime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Endpoint */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">API Endpoint</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <DisconnectedIcon className="text-4xl text-red-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            Unable to connect to backend server
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Endpoint: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</p>
            <p>Make sure the backend server is running</p>
          </div>
          <button
            onClick={checkBackendStatus}
            disabled={isChecking}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Retry Connection'}
          </button>
        </div>
      )}

      {/* Last Checked */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last checked: {status.lastChecked.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default BackendStatus;
