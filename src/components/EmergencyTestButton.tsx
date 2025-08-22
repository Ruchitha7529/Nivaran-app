import React, { useEffect } from 'react';
import { emergencyNotificationService } from '../services/EmergencyNotificationService';
import { realSMSService } from '../services/RealSMSService';
import { emailNotificationService } from '../services/EmailNotificationService';
import { whatsAppService } from '../services/WhatsAppService';
import { directNotificationService } from '../services/DirectNotificationService';

const EmergencyTestButton: React.FC = () => {
  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);
  const handleTestEmergencyAlert = async () => {
    // Simulate high-risk quiz answers
    const mockQuizAnswers = [
      { questionId: 0, selectedOption: 4 }, // Always thinking about substances
      { questionId: 1, selectedOption: 2 }, // Relapsed before
      { questionId: 2, selectedOption: 4 }, // Very high stress
      { questionId: 3, selectedOption: 3 }, // No support
      { questionId: 4, selectedOption: 4 }, // Multiple daily cravings
      { questionId: 5, selectedOption: 4 }, // High trigger exposure
      { questionId: 6, selectedOption: 4 }, // Poor sleep
      { questionId: 7, selectedOption: 4 }, // Very unstable mood
      { questionId: 8, selectedOption: 4 }, // Very isolated
      { questionId: 9, selectedOption: 4 }  // Very unstable living
    ];

    try {
      // Send real test emergency alert
      console.log('🧪 Sending test emergency SMS to your registered numbers...');
      const alert = await emergencyNotificationService.sendEmergencyAlert(
        'test-user-123',
        'Test User (Emergency Test)',
        mockQuizAnswers
      );

      console.log('✅ Test emergency alert processed:', alert);
    } catch (error) {
      console.error('❌ Test emergency alert failed:', error);
    }
  };

  const handleTestSMSOnly = async () => {
    try {
      console.log('🧪 Sending test SMS only...');
      await realSMSService.testSMS();
      console.log('✅ Test SMS completed');
    } catch (error) {
      console.error('❌ Test SMS failed:', error);
    }
  };

  const handleTestEmail = async () => {
    try {
      console.log('📧 Sending test email...');
      const result = await emailNotificationService.sendTestEmail();
      console.log('✅ Test email result:', result);
    } catch (error) {
      console.error('❌ Test email failed:', error);
    }
  };

  const handleTestWhatsApp = async () => {
    try {
      console.log('💬 Opening WhatsApp for emergency contacts...');
      whatsAppService.openAllWhatsApp('Test User (WhatsApp Test)', [
        'Test alert - WhatsApp system is working',
        'This is a test message',
        'Please confirm receipt'
      ]);
      console.log('✅ WhatsApp opened for all contacts');
    } catch (error) {
      console.error('❌ WhatsApp test failed:', error);
    }
  };

  const handleTestDirect = async () => {
    try {
      console.log('📞 Testing direct notification methods...');

      // Focus window first
      window.focus();

      // Small delay to ensure focus
      setTimeout(async () => {
        try {
          await directNotificationService.testDirectNotifications();
          console.log('✅ Direct notification test completed');
        } catch (error) {
          console.error('❌ Direct notification test failed:', error);
        }
      }, 200);

    } catch (error) {
      console.error('❌ Direct notification test failed:', error);
    }
  };

  const handleTestAll = async () => {
    console.log('🧪 Testing all notification methods...');

    // Test browser notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🧪 Test Notification', {
          body: 'Browser notifications are working! You should receive SMS and email alerts.',
          icon: '/favicon.ico',
          requireInteraction: true
        });
      } else {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('🧪 Test Notification', {
            body: 'Browser notifications enabled! Testing SMS and email...',
            icon: '/favicon.ico'
          });
        }
      }
    }

    // Test all methods
    await handleTestEmergencyAlert();
    await handleTestEmail();
    await handleTestWhatsApp();
    await handleTestDirect();
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      <button
        onClick={handleTestAll}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test All Notification Methods"
      >
        🧪 Test All
      </button>
      <button
        onClick={handleTestEmergencyAlert}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test Full Emergency Alert System"
      >
        🚨 Emergency
      </button>
      <button
        onClick={handleTestSMSOnly}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test SMS Only"
      >
        📱 SMS
      </button>
      <button
        onClick={handleTestEmail}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test Email Only"
      >
        📧 Email
      </button>
      <button
        onClick={handleTestWhatsApp}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test WhatsApp"
      >
        💬 WhatsApp
      </button>
      <button
        onClick={handleTestDirect}
        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
        title="Test Direct Methods (Guaranteed)"
      >
        📞 Direct
      </button>
    </div>
  );
};

export default EmergencyTestButton;
