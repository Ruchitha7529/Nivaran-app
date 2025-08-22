// Email Notification Service as backup for SMS
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

class EmailNotificationService {
  private emergencyEmail = 'your-email@gmail.com'; // Replace with your email

  async sendEmergencyEmail(userName: string, phoneNumber: string, riskFactors: string[]): Promise<EmailResponse> {
    const subject = `🚨 NIVARAN EMERGENCY ALERT - High Risk User Detected`;
    const body = this.generateEmailBody(userName, phoneNumber, riskFactors);

    try {
      // Method 1: EmailJS (Free email service)
      return await this.sendViaEmailJS(subject, body);
    } catch (error) {
      console.log('EmailJS failed, trying mailto...');
      // Method 2: Mailto fallback
      return this.sendViaMailto(subject, body);
    }
  }

  private async sendViaEmailJS(subject: string, body: string): Promise<EmailResponse> {
    // EmailJS - Free email service
    // You need to sign up at emailjs.com and get your keys
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        template_id: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        user_id: 'YOUR_USER_ID', // Replace with your EmailJS user ID
        template_params: {
          to_email: this.emergencyEmail,
          subject: subject,
          message: body,
          from_name: 'Nivaran Emergency System'
        }
      })
    });

    if (response.ok) {
      return {
        success: true,
        messageId: 'emailjs-' + Date.now(),
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('EmailJS failed');
    }
  }

  private sendViaMailto(subject: string, body: string): EmailResponse {
    // Mailto fallback - opens default email client
    const mailtoUrl = `mailto:${this.emergencyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
      window.open(mailtoUrl, '_blank');
      return {
        success: true,
        messageId: 'mailto-' + Date.now(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to open email client',
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateEmailBody(userName: string, phoneNumber: string, riskFactors: string[]): string {
    return `
🚨 NIVARAN EMERGENCY ALERT 🚨

HIGH RISK USER DETECTED

User Details:
- Name: ${userName}
- Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Contact: ${phoneNumber}

RISK FACTORS IDENTIFIED:
${riskFactors.map(factor => `• ${factor}`).join('\n')}

IMMEDIATE ACTION REQUIRED:
1. Contact the user immediately at ${phoneNumber}
2. Provide crisis intervention support
3. Consider emergency services if needed
4. Follow up within 24 hours

Emergency Resources:
- National Suicide Prevention Lifeline: 1800-599-0019
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 112

This is an automated alert from the Nivaran Recovery Support System.
Please respond immediately to ensure user safety.

---
Nivaran Recovery Support Team
Emergency Notification System
    `;
  }

  // Send test email
  async sendTestEmail(): Promise<EmailResponse> {
    return this.sendEmergencyEmail(
      'Test User',
      '+919150397529',
      ['Test alert - System is working correctly', 'This is a test message']
    );
  }
}

export const emailNotificationService = new EmailNotificationService();
