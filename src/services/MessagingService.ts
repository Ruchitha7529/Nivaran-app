export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'mentor' | 'patient' | 'doctor';
  recipientId: string;
  recipientType: 'mentor' | 'patient' | 'doctor';
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'general' | 'treatment_update' | 'activity_assignment' | 'emergency' | 'appointment';
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  relatedData?: {
    treatmentPlanId?: string;
    activityId?: string;
    appointmentId?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  userType: 'mentor' | 'patient' | 'doctor';
  title: string;
  message: string;
  type: 'message' | 'treatment_update' | 'activity_assigned' | 'appointment' | 'emergency' | 'doctor_assigned';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedData?: {
    messageId?: string;
    patientId?: string;
    doctorId?: string;
    treatmentPlanId?: string;
    activityId?: string;
  };
}

export interface TreatmentPlanUpdate {
  id: string;
  patientId: string;
  updatedBy: string;
  updatedByName: string;
  updateType: 'activities' | 'goals' | 'medications' | 'therapy_schedule' | 'emergency_contacts';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    reason?: string;
  }[];
  timestamp: string;
  notes?: string;
}

class MessagingService {
  private messages: Message[] = [];
  private notifications: Notification[] = [];
  private treatmentUpdates: TreatmentPlanUpdate[] = [];
  private messageListeners: ((messages: Message[]) => void)[] = [];
  private notificationListeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  private loadFromStorage() {
    const messages = localStorage.getItem('nivaran_messages');
    const notifications = localStorage.getItem('nivaran_notifications');
    const updates = localStorage.getItem('nivaran_treatment_updates');

    if (messages) this.messages = JSON.parse(messages);
    if (notifications) this.notifications = JSON.parse(notifications);
    if (updates) this.treatmentUpdates = JSON.parse(updates);
  }

  private saveToStorage() {
    localStorage.setItem('nivaran_messages', JSON.stringify(this.messages));
    localStorage.setItem('nivaran_notifications', JSON.stringify(this.notifications));
    localStorage.setItem('nivaran_treatment_updates', JSON.stringify(this.treatmentUpdates));
    this.notifyListeners();
  }

  private initializeSampleData() {
    if (this.messages.length === 0) {
      this.messages = [
        {
          id: 'msg-1',
          senderId: 'mentor-1',
          senderName: 'Dr. Sarah Johnson',
          senderType: 'mentor',
          recipientId: 'patient-1',
          recipientType: 'patient',
          subject: 'Great Progress This Week!',
          content: 'Hi John! I wanted to congratulate you on completing all your activities this week. Your mood scores have been consistently improving. Keep up the excellent work!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          messageType: 'general'
        }
      ];

      this.notifications = [
        {
          id: 'notif-1',
          userId: 'patient-1',
          userType: 'patient',
          title: 'New Message from Dr. Sarah Johnson',
          message: 'You have received a new message about your progress',
          type: 'message',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          priority: 'medium',
          relatedData: { messageId: 'msg-1' }
        }
      ];

      this.saveToStorage();
    }
  }

  // Send message from mentor/doctor to patient
  sendMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.messages.push(newMessage);

    // Create notification for recipient
    this.createNotification({
      userId: messageData.recipientId,
      userType: messageData.recipientType,
      title: `New Message from ${messageData.senderName}`,
      message: messageData.subject,
      type: 'message',
      priority: messageData.messageType === 'emergency' ? 'urgent' : 'medium',
      relatedData: { messageId: newMessage.id }
    });

    this.saveToStorage();
    return newMessage;
  }

  // Update treatment plan and notify patient
  updateTreatmentPlan(updateData: Omit<TreatmentPlanUpdate, 'id' | 'timestamp'>): TreatmentPlanUpdate {
    const update: TreatmentPlanUpdate = {
      ...updateData,
      id: `update-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    this.treatmentUpdates.push(update);

    // Create notification for patient
    this.createNotification({
      userId: updateData.patientId,
      userType: 'patient',
      title: 'Treatment Plan Updated',
      message: `Your ${updateData.updateType.replace('_', ' ')} has been updated by ${updateData.updatedByName}`,
      type: 'treatment_update',
      priority: 'high',
      relatedData: { 
        treatmentPlanId: update.id,
        patientId: updateData.patientId
      }
    });

    // Send message to patient about the update
    this.sendMessage({
      senderId: updateData.updatedBy,
      senderName: updateData.updatedByName,
      senderType: 'mentor',
      recipientId: updateData.patientId,
      recipientType: 'patient',
      subject: 'Treatment Plan Updated',
      content: `Your treatment plan has been updated. Changes made to: ${updateData.updateType.replace('_', ' ')}. ${updateData.notes || 'Please review the changes in your recovery plan.'}`,
      messageType: 'treatment_update',
      relatedData: { treatmentPlanId: update.id }
    });

    this.saveToStorage();
    return update;
  }

  // Assign activity to patient
  assignActivity(patientId: string, activityData: any, assignedBy: string, assignedByName: string): void {
    // Create notification for activity assignment
    this.createNotification({
      userId: patientId,
      userType: 'patient',
      title: 'New Activity Assigned',
      message: `${assignedByName} has assigned you a new activity: ${activityData.title}`,
      type: 'activity_assigned',
      priority: 'medium',
      relatedData: { 
        activityId: activityData.id,
        patientId: patientId
      }
    });

    // Send message about the activity assignment
    this.sendMessage({
      senderId: assignedBy,
      senderName: assignedByName,
      senderType: 'mentor',
      recipientId: patientId,
      recipientType: 'patient',
      subject: 'New Activity Assigned',
      content: `I've assigned you a new activity: "${activityData.title}". ${activityData.description}. This activity will help with your recovery progress.`,
      messageType: 'activity_assignment',
      relatedData: { activityId: activityData.id }
    });

    this.saveToStorage();
  }

  // Notify doctor when patient selects them
  notifyDoctorSelection(doctorId: string, patientId: string, patientName: string): void {
    this.createNotification({
      userId: doctorId,
      userType: 'doctor',
      title: 'New Patient Assignment',
      message: `${patientName} has selected you as their recovery doctor`,
      type: 'doctor_assigned',
      priority: 'high',
      relatedData: { patientId: patientId }
    });

    // Send message to doctor
    this.sendMessage({
      senderId: patientId,
      senderName: patientName,
      senderType: 'patient',
      recipientId: doctorId,
      recipientType: 'doctor',
      subject: 'New Patient Assignment Request',
      content: `Hello Doctor, I would like to request you as my recovery specialist. Please review my case and let me know if you can take me on as a patient.`,
      messageType: 'general'
    });

    this.saveToStorage();
  }

  // Create notification
  private createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Notification {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.notifications.push(notification);
    return notification;
  }

  // Get messages for user
  getMessagesForUser(userId: string, userType: 'mentor' | 'patient' | 'doctor'): Message[] {
    return this.messages
      .filter(msg => 
        (msg.recipientId === userId && msg.recipientType === userType) ||
        (msg.senderId === userId && msg.senderType === userType)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get notifications for user
  getNotificationsForUser(userId: string, userType: 'mentor' | 'patient' | 'doctor'): Notification[] {
    return this.notifications
      .filter(notif => notif.userId === userId && notif.userType === userType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get unread notifications count
  getUnreadNotificationsCount(userId: string, userType: 'mentor' | 'patient' | 'doctor'): number {
    return this.notifications.filter(notif => 
      notif.userId === userId && 
      notif.userType === userType && 
      !notif.isRead
    ).length;
  }

  // Mark message as read
  markMessageAsRead(messageId: string): void {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.isRead = true;
      this.saveToStorage();
    }
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
    }
  }

  // Mark all notifications as read for user
  markAllNotificationsAsRead(userId: string, userType: 'mentor' | 'patient' | 'doctor'): void {
    this.notifications
      .filter(notif => notif.userId === userId && notif.userType === userType)
      .forEach(notif => notif.isRead = true);
    this.saveToStorage();
  }

  // Get treatment plan updates for patient
  getTreatmentUpdatesForPatient(patientId: string): TreatmentPlanUpdate[] {
    return this.treatmentUpdates
      .filter(update => update.patientId === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Subscribe to messages
  subscribeToMessages(callback: (messages: Message[]) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to notifications
  subscribeToNotifications(callback: (notifications: Notification[]) => void): () => void {
    this.notificationListeners.push(callback);
    return () => {
      const index = this.notificationListeners.indexOf(callback);
      if (index > -1) {
        this.notificationListeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.messageListeners.forEach(callback => callback([...this.messages]));
    this.notificationListeners.forEach(callback => callback([...this.notifications]));
  }
}

export const messagingService = new MessagingService();
export default messagingService;
