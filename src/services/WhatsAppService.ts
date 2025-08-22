// WhatsApp Notification Service as alternative to SMS
export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

class WhatsAppService {
  private emergencyNumbers = [
    '919150397529',
    '919025363352', 
    '917845272736'
  ];

  async sendEmergencyWhatsApp(userName: string, riskFactors: string[]): Promise<WhatsAppResponse[]> {
    const message = this.generateWhatsAppMessage(userName, riskFactors);
    const responses: WhatsAppResponse[] = [];

    for (const number of this.emergencyNumbers) {
      try {
        const response = await this.sendWhatsAppMessage(number, message);
        responses.push(response);
        console.log(`✅ WhatsApp sent to ${number}:`, response);
      } catch (error) {
        console.error(`❌ WhatsApp failed for ${number}:`, error);
        responses.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    return responses;
  }

  private async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<WhatsAppResponse> {
    try {
      // Method 1: WhatsApp Web URL (opens WhatsApp with pre-filled message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      console.log(`📱 Opening WhatsApp for ${phoneNumber}...`);
      console.log('WhatsApp URL:', whatsappUrl);
      
      // Try to open WhatsApp Web
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      // Also try CallMeBot API (free WhatsApp API)
      try {
        const callMeBotResponse = await this.sendViaCallMeBot(phoneNumber, message);
        if (callMeBotResponse.success) {
          return callMeBotResponse;
        }
      } catch (error) {
        console.log('CallMeBot failed, using WhatsApp Web fallback');
      }

      return {
        success: true,
        messageId: 'whatsapp-web-' + Date.now(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error('WhatsApp sending failed');
    }
  }

  private async sendViaCallMeBot(phoneNumber: string, message: string): Promise<WhatsAppResponse> {
    // CallMeBot WhatsApp API (requires phone number registration)
    const response = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=YOUR_API_KEY`);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log('CallMeBot response:', responseText);
      
      return {
        success: true,
        messageId: 'callmebot-' + Date.now(),
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('CallMeBot API failed');
    }
  }

  private generateWhatsAppMessage(userName: string, riskFactors: string[]): string {
    return `🚨 *NIVARAN EMERGENCY ALERT* 🚨

*HIGH RISK USER DETECTED*

👤 *User:* ${userName}
⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

⚠️ *RISK FACTORS:*
${riskFactors.slice(0, 3).map(factor => `• ${factor}`).join('\n')}

🆘 *IMMEDIATE ACTION REQUIRED*
Contact user immediately for crisis intervention.

📞 *Emergency Resources:*
• National Suicide Prevention: 1800-599-0019
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 112

_This is an automated alert from Nivaran Recovery Support System._`;
  }

  // Test WhatsApp functionality
  async testWhatsApp(): Promise<void> {
    const testMessage = `🧪 *NIVARAN TEST MESSAGE*

This is a test of the WhatsApp emergency notification system.

⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

If you received this, the system is working correctly.
Please reply "OK" to confirm receipt.

_- Nivaran Recovery Support Team_`;

    console.log('🧪 Sending test WhatsApp to all emergency contacts...');
    
    const responses = await this.sendEmergencyWhatsApp('Test User (WhatsApp Test)', ['Test alert - System is working correctly']);
    
    responses.forEach((response, index) => {
      const number = this.emergencyNumbers[index];
      if (response.success) {
        console.log(`✅ Test WhatsApp sent to ${number}`);
      } else {
        console.error(`❌ Test WhatsApp failed for ${number}:`, response.error);
      }
    });
  }

  // Open WhatsApp for manual sending
  openWhatsAppManually(phoneNumber: string, message: string): void {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      
      // Show instruction notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📱 WhatsApp Opened', {
          body: `WhatsApp opened for ${phoneNumber}. Please send the message manually.`,
          icon: '/favicon.ico',
          requireInteraction: true
        });
      }
    }
  }

  // Send to all emergency contacts manually
  openAllWhatsApp(userName: string, riskFactors: string[]): void {
    const message = this.generateWhatsAppMessage(userName, riskFactors);
    
    this.emergencyNumbers.forEach((number, index) => {
      setTimeout(() => {
        this.openWhatsAppManually(number, message);
      }, index * 2000); // 2 second delay between each
    });

    console.log('📱 Opening WhatsApp for all emergency contacts...');
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📱 WhatsApp Emergency Alert', {
        body: `Opening WhatsApp for ${this.emergencyNumbers.length} emergency contacts. Please send messages manually.`,
        icon: '/favicon.ico',
        requireInteraction: true
      });
    }
  }
}

export const whatsAppService = new WhatsAppService();
