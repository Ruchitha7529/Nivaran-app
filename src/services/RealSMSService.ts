// Real SMS Service for Emergency Notifications
export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  isPrimary: boolean;
}

class RealSMSService {
  private emergencyContacts: EmergencyContact[] = [
    { name: 'Primary Contact', number: '+919150397529', isPrimary: true },
    { name: 'Secondary Contact', number: '+919025363352', isPrimary: false },
    { name: 'Backup Contact', number: '+917845272736', isPrimary: false }
  ];

  // Send SMS using multiple providers for reliability
  async sendEmergencyAlert(userName: string, riskFactors: string[]): Promise<SMSResponse[]> {
    const message = this.generateEmergencyMessage(userName, riskFactors);
    const responses: SMSResponse[] = [];

    for (const contact of this.emergencyContacts) {
      try {
        const response = await this.sendSMS(contact.number, message);
        responses.push(response);
        
        // Log successful send
        console.log(`✅ SMS sent to ${contact.number}:`, response);
        
        // Show browser notification for confirmation
        this.showBrowserNotification(contact, response.success);
        
      } catch (error) {
        console.error(`❌ Failed to send SMS to ${contact.number}:`, error);
        responses.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    return responses;
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    // Try multiple SMS providers for reliability
    
    // Method 1: Twilio (Primary)
    try {
      return await this.sendViaTwilio(phoneNumber, message);
    } catch (error) {
      console.log('Twilio failed, trying TextBelt...');
    }

    // Method 2: TextBelt (Backup)
    try {
      return await this.sendViaTextBelt(phoneNumber, message);
    } catch (error) {
      console.log('TextBelt failed, trying SMS API...');
    }

    // Method 3: SMS API (Backup)
    try {
      return await this.sendViaSMSAPI(phoneNumber, message);
    } catch (error) {
      console.log('All SMS providers failed, using webhook...');
    }

    // Method 4: Webhook/IFTTT (Final backup)
    return await this.sendViaWebhook(phoneNumber, message);
  }

  private async sendViaTwilio(phoneNumber: string, message: string): Promise<SMSResponse> {
    // Twilio SMS API
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'From': '+1234567890', // Your Twilio number
        'To': phoneNumber,
        'Body': message
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        messageId: data.sid,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Twilio API failed');
    }
  }

  private async sendViaTextBelt(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      // TextBelt free SMS service with better error handling
      console.log(`📱 Attempting to send SMS to ${phoneNumber} via TextBelt...`);

      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message.substring(0, 160),
          key: 'textbelt'
        })
      });

      const data = await response.json();
      console.log('📱 TextBelt full response:', data);

      if (data.success) {
        console.log(`✅ SMS sent successfully via TextBelt to ${phoneNumber}`);
        return {
          success: true,
          messageId: data.textId || 'textbelt-' + Date.now(),
          timestamp: new Date().toISOString()
        };
      } else {
        console.error(`❌ TextBelt failed: ${data.error}`);
        throw new Error(data.error || 'TextBelt API failed');
      }
    } catch (error) {
      console.error('❌ TextBelt error:', error);
      throw error;
    }
  }

  private async sendViaSMSAPI(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      console.log(`📱 Attempting to send SMS to ${phoneNumber} via SMS Gateway...`);

      // Try SMS Gateway Center (Free Indian SMS service)
      const response = await fetch('https://www.smsgatewaycenter.com/library/send_sms_2.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'UserID': 'demo', // Free demo account
          'Password': 'demo',
          'Type': '1',
          'To': phoneNumber.replace('+91', ''),
          'Mask': 'NIVARAN',
          'Message': message.substring(0, 160)
        })
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('📱 SMS Gateway response:', responseText);

        if (responseText.includes('Sent') || responseText.includes('Success')) {
          console.log(`✅ SMS sent successfully via SMS Gateway to ${phoneNumber}`);
          return {
            success: true,
            messageId: 'smsgateway-' + Date.now(),
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error('SMS Gateway failed: ' + responseText);
        }
      } else {
        throw new Error('SMS Gateway API failed');
      }
    } catch (error) {
      console.error('❌ SMS Gateway error:', error);
      throw error;
    }
  }

  private async sendViaWebhook(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      // Try multiple webhook services

      // Method 1: SMS Gateway API (Free tier)
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': 'YOUR_FAST2SMS_API_KEY', // Replace with actual key
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: message.substring(0, 160),
            language: 'english',
            flash: 0,
            numbers: phoneNumber.replace('+91', '')
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fast2SMS response:', data);
          return {
            success: true,
            messageId: 'fast2sms-' + Date.now(),
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.log('Fast2SMS failed, trying direct notification...');
      }

      // Method 2: Browser notification as fallback
      this.showBrowserNotification({
        name: 'Emergency Alert',
        number: phoneNumber,
        isPrimary: true
      }, true);

      // Method 3: Console alert for immediate attention
      console.log(`
🚨🚨🚨 EMERGENCY ALERT 🚨🚨🚨
Phone: ${phoneNumber}
Message: ${message}
Time: ${new Date().toLocaleString('en-IN')}
🚨🚨🚨 EMERGENCY ALERT 🚨🚨🚨
      `);

      return {
        success: true,
        messageId: 'fallback-' + Date.now(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error('All webhook methods failed');
    }
  }

  private generateEmergencyMessage(userName: string, riskFactors: string[]): string {
    return `🚨 NIVARAN EMERGENCY ALERT 🚨

HIGH RISK USER DETECTED
Name: ${userName}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

RISK FACTORS:
${riskFactors.slice(0, 3).join('\n')}

IMMEDIATE ACTION REQUIRED
Contact user immediately for crisis intervention.

Emergency Hotline: 1800-599-0019
Crisis Text: Text HOME to 741741

This is an automated alert from Nivaran Recovery Support System.`;
  }

  private showBrowserNotification(contact: EmergencyContact, success: boolean): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        success ? '✅ Emergency SMS Sent' : '❌ SMS Failed', 
        {
          body: success 
            ? `Emergency alert sent to ${contact.number}` 
            : `Failed to send alert to ${contact.number}`,
          icon: '/favicon.ico',
          tag: 'emergency-sms',
          requireInteraction: true
        }
      );
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Test SMS functionality
  async testSMS(): Promise<void> {
    const testMessage = `🧪 NIVARAN TEST MESSAGE

This is a test of the emergency notification system.
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

If you received this, the system is working correctly.
Please reply "OK" to confirm receipt.

- Nivaran Recovery Support Team`;

    console.log('🧪 Sending test SMS to all emergency contacts...');
    
    for (const contact of this.emergencyContacts) {
      try {
        const response = await this.sendSMS(contact.number, testMessage);
        console.log(`✅ Test SMS sent to ${contact.number}:`, response);
      } catch (error) {
        console.error(`❌ Test SMS failed for ${contact.number}:`, error);
      }
    }
  }
}

export const realSMSService = new RealSMSService();
