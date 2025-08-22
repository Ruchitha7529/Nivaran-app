# 📱 Real SMS Emergency Notification Setup Guide

## 🎯 Overview
This guide will help you set up real SMS notifications to your phone numbers (+91910397529, +919025363352, +917845272736) when high-risk users are detected.

## 🚀 Quick Setup Options

### Option 1: TextBelt (Easiest - Free)
1. **No signup required** - Uses free tier (1 SMS per day per IP)
2. **Already configured** in the code
3. **Test it**: Click the "📱 Test SMS" button in the app

### Option 2: Twilio (Recommended - Reliable)
1. **Sign up**: Go to [twilio.com](https://twilio.com)
2. **Get credentials**: Account SID, Auth Token, Phone Number
3. **Update code**: Replace placeholders in `RealSMSService.ts`:
   ```typescript
   'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
   'From': '+1234567890', // Your Twilio number
   ```

### Option 3: IFTTT Webhook (Alternative)
1. **Sign up**: Go to [ifttt.com](https://ifttt.com)
2. **Create applet**: 
   - Trigger: Webhooks
   - Action: SMS (or any notification service)
3. **Get webhook URL**: Replace in `RealSMSService.ts`

## 🔧 Configuration Steps

### Step 1: Enable Browser Notifications
```javascript
// The app will automatically request permission
// Or manually enable in browser settings
```

### Step 2: Test the System
1. **Open the app**: http://localhost:3000
2. **Login as user**: Take the quiz with high-risk answers
3. **Or use test buttons**: 
   - 🚨 Test Emergency Alert (full system)
   - 📱 Test SMS (SMS only)

### Step 3: Verify SMS Delivery
- Check your phones: +91910397529, +919025363352, +917845272736
- Look for messages from the service
- Check browser notifications for delivery status

## 📋 SMS Message Format

```
🚨 NIVARAN EMERGENCY ALERT 🚨

HIGH RISK USER DETECTED
Name: [User Name]
Time: [Indian Standard Time]

RISK FACTORS:
• [Risk Factor 1]
• [Risk Factor 2]
• [Risk Factor 3]

IMMEDIATE ACTION REQUIRED
Contact user immediately for crisis intervention.

Emergency Hotline: 1800-599-0019
Crisis Text: Text HOME to 741741

This is an automated alert from Nivaran Recovery Support System.
```

## 🛠️ Troubleshooting

### SMS Not Received?
1. **Check console logs** for error messages
2. **Try different provider** (TextBelt → Twilio → Webhook)
3. **Verify phone numbers** are correct
4. **Check spam folder** on phone

### Browser Notifications Not Showing?
1. **Allow notifications** in browser settings
2. **Check notification permissions** for the site
3. **Ensure browser supports** notifications

### API Errors?
1. **Check API credentials** (if using Twilio/SMS API)
2. **Verify account balance** (for paid services)
3. **Check rate limits** (free tiers have limits)

## 🔒 Security Notes

- **API keys**: Never commit real API keys to version control
- **Environment variables**: Use `.env` files for sensitive data
- **Rate limiting**: Implement to prevent spam
- **Verification**: Consider adding SMS verification for emergency contacts

## 📞 Emergency Contact Configuration

Current registered numbers:
- **Primary**: +91910397529
- **Secondary**: +919025363352  
- **Backup**: +917845272736

To modify these numbers, update the `emergencyContacts` array in `RealSMSService.ts`.

## 🧪 Testing Commands

```javascript
// In browser console:

// Test emergency alert
emergencyNotificationService.sendEmergencyAlert('test-123', 'Test User', []);

// Test SMS only
realSMSService.testSMS();

// Request notification permission
realSMSService.requestNotificationPermission();
```

## 📈 Monitoring & Logs

- **Console logs**: Check browser developer tools
- **Notification status**: Browser notifications show delivery status
- **Storage**: Emergency notifications are saved in localStorage
- **Response tracking**: Each SMS attempt is logged with success/failure

## 🎯 Next Steps

1. **Choose SMS provider** (TextBelt for testing, Twilio for production)
2. **Configure credentials** if using paid service
3. **Test thoroughly** with all phone numbers
4. **Monitor delivery** and adjust as needed
5. **Set up monitoring** for failed deliveries

## 💡 Tips

- **Test regularly** to ensure system works
- **Have backup methods** (email, push notifications)
- **Monitor costs** if using paid SMS services
- **Keep emergency contacts updated**
- **Consider time zones** for international numbers

---

**Need Help?** Check the browser console for detailed logs and error messages.
