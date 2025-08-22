import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import LoginPage from './components/LoginPage';
import QuizPage from './components/QuizPage';
import SafeDashboard from './components/dashboards/SafeDashboard';
import MediumDashboard from './components/dashboards/MediumDashboard';
import HighRiskDashboard from './components/dashboards/HighRiskDashboard';
import MentorDashboard from './components/dashboards/MentorDashboard';
import ChatbotPage from './components/ChatbotPage';
import DoctorListPage from './components/DoctorListPage';
import RecoveryPlanPage from './components/RecoveryPlan';
import ReminderSystem from './components/ReminderSystem';
import BackendStatus from './components/BackendStatus';

// User Route Component (only for users, not mentors)
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'user') {
    return <Navigate to="/mentor-dashboard" replace />;
  }

  return <>{children}</>;
};

// Mentor Route Component (only for mentors, not users)
const MentorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'mentor') {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Router>
          <div className="App">
            {/* Backend Status Indicator */}
            <div className="fixed top-4 left-4 z-40">
              <BackendStatus />
            </div>

            <ReminderSystem />
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* User Routes */}
            <Route path="/quiz" element={
              <UserRoute>
                <QuizPage />
              </UserRoute>
            } />

            <Route path="/dashboard/safe" element={
              <UserRoute>
                <SafeDashboard />
              </UserRoute>
            } />

            <Route path="/dashboard/medium" element={
              <UserRoute>
                <MediumDashboard />
              </UserRoute>
            } />

            <Route path="/dashboard/high" element={
              <UserRoute>
                <HighRiskDashboard />
              </UserRoute>
            } />

            <Route path="/chatbot" element={
              <UserRoute>
                <ChatbotPage />
              </UserRoute>
            } />

            <Route path="/doctors" element={
              <UserRoute>
                <DoctorListPage />
              </UserRoute>
            } />

            <Route path="/recovery-plan" element={
              <UserRoute>
                <RecoveryPlanPage />
              </UserRoute>
            } />

            {/* Mentor Routes */}
            <Route path="/mentor-dashboard" element={
              <MentorRoute>
                <MentorDashboard />
              </MentorRoute>
            } />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
