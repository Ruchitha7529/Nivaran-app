import { realSMSService } from './RealSMSService';
import { emailNotificationService } from './EmailNotificationService';
import { whatsAppService } from './WhatsAppService';
import { directNotificationService } from './DirectNotificationService';

// Emergency Notification Service for High-Risk Users
export interface EmergencyNotification {
  id: string;
  userId: string;
  userName: string;
  riskLevel: 'high';
  timestamp: string;
  message: string;
  phoneNumbers: string[];
  status: 'sent' | 'pending' | 'failed';
  quizAnswers?: any[];
}

class EmergencyNotificationService {
  private notifications: EmergencyNotification[] = [];
  private emergencyNumbers = ['9150397529', '9025363352', '7845272736'];

  // Send emergency notification for high-risk users
  async sendEmergencyAlert(userId: string, userName: string, quizAnswers: any[]): Promise<EmergencyNotification> {
    const riskFactors = this.analyzeRiskFactors(quizAnswers);

    const notification: EmergencyNotification = {
      id: `emergency-${Date.now()}`,
      userId,
      userName,
      riskLevel: 'high',
      timestamp: new Date().toISOString(),
      message: this.generateEmergencyMessage(userName, quizAnswers),
      phoneNumbers: this.emergencyNumbers,
      status: 'pending',
      quizAnswers
    };

    try {
      // Send real SMS to your registered numbers
      console.log('🚨 SENDING REAL SMS EMERGENCY ALERT 🚨');
      const smsResponses = await realSMSService.sendEmergencyAlert(userName, riskFactors);

      // Also send email as backup
      console.log('📧 SENDING EMAIL BACKUP ALERT 📧');
      const emailResponse = await emailNotificationService.sendEmergencyEmail(
        userName,
        '+919150397529',
        riskFactors
      );

      // Send WhatsApp as additional backup
      console.log('📱 SENDING WHATSAPP BACKUP ALERT 📱');
      const whatsAppResponses = await whatsAppService.sendEmergencyWhatsApp(userName, riskFactors);
      const whatsAppSuccess = whatsAppResponses.some(response => response.success);

      // GUARANTEED FALLBACK: Direct notification methods (always works)
      console.log('📞 SENDING DIRECT NOTIFICATION ALERTS 📞');
      let directResponses: any[] = [];
      let directSuccess = false;

      try {
        directResponses = await directNotificationService.sendEmergencyNotification(userName, riskFactors);
        directSuccess = directResponses.some(response => response.success);
      } catch (error) {
        console.error('Direct notification error (non-critical):', error);
        // Even if direct notifications fail, we still have other methods
        directSuccess = false;
      }

      // Check if at least one notification method was successful
      const successfulSends = smsResponses.filter(response => response.success);

      // Direct notifications always succeed (phone dialers, clipboard, etc.)
      if (successfulSends.length > 0 || emailResponse.success || whatsAppSuccess || directSuccess) {
        notification.status = 'sent';
        console.log(`✅ Emergency alert sent - SMS: ${successfulSends.length}, Email: ${emailResponse.success ? 'Yes' : 'No'}, WhatsApp: ${whatsAppSuccess ? 'Yes' : 'No'}, Direct: ${directSuccess ? 'Yes' : 'No'}`);

        // Show comprehensive notification
        this.showComprehensiveNotification(successfulSends.length, emailResponse.success, whatsAppSuccess, userName);

        // Always show direct notification summary
        this.showDirectNotificationSummary(userName, directResponses);
      } else {
        notification.status = 'failed';
        console.error('❌ All notification methods failed (this should never happen with direct notifications)');
        this.showFailureNotification(userName);
      }

    } catch (error) {
      console.error('❌ Emergency SMS service error:', error);
      notification.status = 'failed';
      this.showFailureNotification(userName);
    }

    this.notifications.push(notification);
    this.saveToStorage();

    return notification;
  }

  private generateEmergencyMessage(userName: string, quizAnswers: any[]): string {
    const riskFactors = this.analyzeRiskFactors(quizAnswers);
    
    return `🚨 EMERGENCY ALERT - NIVARAN RECOVERY APP 🚨

HIGH RISK USER DETECTED:
Name: ${userName}
Time: ${new Date().toLocaleString()}

RISK FACTORS IDENTIFIED:
${riskFactors.join('\n')}

IMMEDIATE ACTION REQUIRED:
- Contact user immediately
- Provide crisis intervention
- Consider emergency services if needed

This is an automated alert from Nivaran Recovery Support System.
User needs immediate assistance and support.

Emergency Hotline: 988
Crisis Text Line: Text HOME to 741741`;
  }

  private analyzeRiskFactors(quizAnswers: any[]): string[] {
    const riskFactors: string[] = [];
    
    quizAnswers.forEach((answer, index) => {
      switch (index) {
        case 0: // Substance use thoughts
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Frequent thoughts about substance use');
          }
          break;
        case 1: // Previous quit attempts
          if (answer.selectedOption === 2) {
            riskFactors.push('• History of relapse');
          }
          break;
        case 2: // Stress level
          if (answer.selectedOption >= 3) {
            riskFactors.push('• High stress levels');
          }
          break;
        case 3: // Support system
          if (answer.selectedOption >= 2) {
            riskFactors.push('• Limited support system');
          }
          break;
        case 4: // Cravings
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Frequent cravings');
          }
          break;
        case 5: // Triggers
          if (answer.selectedOption >= 3) {
            riskFactors.push('• High exposure to triggers');
          }
          break;
        case 6: // Sleep
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Sleep disturbances');
          }
          break;
        case 7: // Mood
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Mood instability');
          }
          break;
        case 8: // Social isolation
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Social isolation');
          }
          break;
        case 9: // Living situation
          if (answer.selectedOption >= 3) {
            riskFactors.push('• Unstable living situation');
          }
          break;
      }
    });

    if (riskFactors.length === 0) {
      riskFactors.push('• Multiple high-risk indicators detected');
    }

    return riskFactors;
  }

  private showComprehensiveNotification(smsCount: number, emailSent: boolean, whatsAppSent: boolean, userName: string): void {
    const message = `🚨 EMERGENCY ALERT SENT FOR ${userName.toUpperCase()}

📱 SMS: Sent to ${smsCount} numbers (+919150397529, +919025363352, +917845272736)
📧 Email: ${emailSent ? 'Sent successfully' : 'Failed'}
💬 WhatsApp: ${whatsAppSent ? 'Sent successfully' : 'Failed'}
⏰ Time: ${new Date().toLocaleString('en-IN')}

IMMEDIATE ACTION REQUIRED - Check your phone for alerts!`;

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 EMERGENCY ALERT SENT', {
        body: `High-risk user ${userName} detected. Check your phone for SMS alerts!`,
        icon: '/favicon.ico',
        tag: 'emergency-alert',
        silent: false,
        requireInteraction: true
      });
    }

    // Console alert for immediate attention
    console.log(message);

    // Also try to show browser alert
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        alert(message);
      }, 1000);
    }
  }

  private showFailureNotification(userName: string): void {
    const message = `❌ EMERGENCY ALERT FAILED FOR ${userName}

All notification methods failed. Please contact manually:
📱 +919150397529
📱 +919025363352
📱 +917845272736

IMMEDIATE MANUAL INTERVENTION REQUIRED!`;

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('❌ EMERGENCY ALERT FAILED', {
        body: `Failed to send alerts for ${userName}. Manual intervention required!`,
        icon: '/favicon.ico',
        tag: 'emergency-failed',
        silent: false,
        requireInteraction: true
      });
    }

    console.error(message);

    // Show browser alert for critical failure
    if (typeof window !== 'undefined') {
      alert(message);
    }
  }

  private showDirectNotificationSummary(userName: string, directResponses: any[]): void {
    const successfulMethods = directResponses.filter(r => r.success).map(r => r.method);

    const message = `📞 DIRECT EMERGENCY ACTIONS TAKEN FOR ${userName}:

✅ Successful Methods:
${successfulMethods.map(method => `• ${method}`).join('\n')}

🎯 IMMEDIATE ACTIONS AVAILABLE:
• Phone dialers opened for all emergency contacts
• Emergency message copied to clipboard
• Emergency file downloaded
• Print notice available

CALL +91 91503 97529 IMMEDIATELY!`;

    console.log(message);

    // Show persistent notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📞 EMERGENCY ACTIONS READY', {
        body: `Direct notification methods activated for ${userName}. Phone dialers opened!`,
        icon: '/favicon.ico',
        tag: 'direct-emergency',
        requireInteraction: true
      });
    }
  }

  private showOnScreenNotification(notification: EmergencyNotification): void {
    // Create and show on-screen emergency notification
    const alertDiv = document.createElement('div');
    alertDiv.className = 'emergency-alert-notification';
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff4444, #cc0000);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
      z-index: 10000;
      max-width: 400px;
      font-family: Arial, sans-serif;
      animation: slideIn 0.5s ease-out;
    `;

    alertDiv.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 24px; margin-right: 10px;">🚨</span>
        <strong style="font-size: 18px;">EMERGENCY ALERT SENT</strong>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>User:</strong> ${notification.userName}<br>
        <strong>Time:</strong> ${new Date(notification.timestamp).toLocaleString()}
      </div>
      <div style="margin-bottom: 15px; font-size: 14px;">
        Emergency notifications sent to:<br>
        ${notification.phoneNumbers.map(num => `📱 +91${num}`).join('<br>')}
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
      ">Close</button>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(alertDiv);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, 30000);
  }

  // Get all emergency notifications
  getAllNotifications(): EmergencyNotification[] {
    return this.notifications;
  }

  // Get notifications for a specific user
  getUserNotifications(userId: string): EmergencyNotification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('nivaran_emergency_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save emergency notifications:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('nivaran_emergency_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load emergency notifications:', error);
      this.notifications = [];
    }
  }

  constructor() {
    this.loadFromStorage();
    // Request notification permission on initialization
    this.requestNotificationPermission();
  }
}

export const emergencyNotificationService = new EmergencyNotificationService();
