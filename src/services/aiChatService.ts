// Advanced AI Chat Service for Nivaran
// This service provides sophisticated AI responses for addiction recovery support

export interface ChatContext {
  riskLevel: 'safe' | 'medium' | 'high' | null;
  conversationHistory: Array<{sender: 'user' | 'bot', message: string}>;
  userMood?: 'positive' | 'neutral' | 'anxious' | 'depressed' | 'angry';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class AIChatService {
  private recoveryStrategies = {
    coping: [
      "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system.",
      "Use the HALT check: Are you Hungry, Angry, Lonely, or Tired? Address these basic needs first.",
      "Try progressive muscle relaxation: Tense and release each muscle group from your toes to your head.",
      "Engage in mindful observation: Focus intensely on one object for 2-3 minutes, noticing every detail."
    ],
    motivation: [
      "Recovery is not about perfection, it's about progress. Every small step counts.",
      "You've overcome 100% of your difficult days so far. That's an incredible track record.",
      "Healing happens in waves. It's okay to have setbacks - they don't erase your progress.",
      "Your brain is literally rewiring itself for health. This process takes time and patience.",
      "You're not just recovering from addiction, you're discovering who you truly are."
    ],
    crisis: [
      "I'm concerned about you. Please reach out to someone immediately - you don't have to face this alone.",
      "Crisis Text Line: Text HOME to 741741 for immediate support from trained counselors.",
      "National Suicide Prevention Lifeline: 988 - Available 24/7 with caring, trained counselors.",
      "If you're in immediate danger, please call 911 or go to your nearest emergency room.",
      "Your life has value and meaning. This pain is temporary, but your life is precious."
    ]
  };

  private moodResponses = {
    positive: [
      "I'm so glad to hear you're feeling positive! What's contributing to this good mood today?",
      "That's wonderful! Positive moments are important to celebrate and remember.",
      "Your positive energy is inspiring. How can we build on this feeling?"
    ],
    anxious: [
      "I understand anxiety can be overwhelming. Let's work through this together.",
      "Anxiety is your brain trying to protect you, but sometimes it's overactive. You're safe right now.",
      "Would you like to try a quick anxiety-reducing technique? I have several that can help."
    ],
    depressed: [
      "I hear that you're struggling right now. Depression can make everything feel harder.",
      "Your feelings are valid, and it's okay to not be okay. You're not alone in this.",
      "Even small actions can help when depression feels heavy. What's one tiny thing you could do for yourself today?"
    ],
    angry: [
      "Anger is a valid emotion, and it often signals that something important to you has been threatened.",
      "Let's channel this energy constructively. What's really underneath this anger?",
      "It's okay to feel angry. Let's find healthy ways to express and process these feelings."
    ]
  };

  private contextualResponses = {
    morning: [
      "Good morning! How are you starting your day? Morning routines can really set the tone.",
      "Mornings can be tough in recovery. What's one positive thing you can do to start today well?",
      "I hope you're having a peaceful morning. What are your intentions for today?"
    ],
    afternoon: [
      "How's your afternoon going? This time of day can sometimes bring challenges.",
      "Afternoon check-in: How are you feeling right now? What do you need most?",
      "The afternoon can be a good time for reflection. What's going well for you today?"
    ],
    evening: [
      "Evening can be a vulnerable time for many people in recovery. How are you doing?",
      "As the day winds down, how are you feeling about your progress today?",
      "Evenings are good for gratitude practice. What's one thing you're grateful for today?"
    ],
    night: [
      "Late nights can be challenging. Are you having trouble sleeping or just need someone to talk to?",
      "Nighttime thoughts can be intense. Remember, thoughts are not facts - they're just mental events.",
      "If you're struggling to sleep, try some gentle breathing exercises or progressive muscle relaxation."
    ]
  };

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private detectMood(message: string): 'positive' | 'neutral' | 'anxious' | 'depressed' | 'angry' | null {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['good', 'great', 'happy', 'excited', 'wonderful', 'amazing', 'fantastic', 'excellent', 'better', 'improving'];
    const anxiousWords = ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed', 'fear'];
    const depressedWords = ['sad', 'depressed', 'hopeless', 'empty', 'worthless', 'tired', 'exhausted', 'lonely', 'isolated'];
    const angryWords = ['angry', 'mad', 'furious', 'frustrated', 'irritated', 'pissed', 'rage', 'annoyed'];

    if (positiveWords.some(word => lowerMessage.includes(word))) return 'positive';
    if (anxiousWords.some(word => lowerMessage.includes(word))) return 'anxious';
    if (depressedWords.some(word => lowerMessage.includes(word))) return 'depressed';
    if (angryWords.some(word => lowerMessage.includes(word))) return 'angry';
    
    return 'neutral';
  }

  private isCrisisMessage(message: string): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself', 
      'self harm', 'overdose', 'can\'t go on', 'no point', 'give up'
    ];
    
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public async generateResponse(userMessage: string, context: ChatContext): Promise<string[]> {
    const timeOfDay = this.getTimeOfDay();
    const detectedMood = this.detectMood(userMessage);
    const isCrisis = this.isCrisisMessage(userMessage);

    // Crisis intervention takes priority
    if (isCrisis || context.riskLevel === 'high') {
      return [
        this.getRandomResponse(this.recoveryStrategies.crisis),
        "Please don't hesitate to reach out for immediate help. You matter, and there are people who want to support you."
      ];
    }

    // Mood-based responses
    if (detectedMood && detectedMood !== 'neutral') {
      const moodResponse = this.getRandomResponse(this.moodResponses[detectedMood]);
      return [moodResponse];
    }

    // Topic-specific responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('craving') || lowerMessage.includes('urge') || lowerMessage.includes('tempt')) {
      return [
        "Cravings are like waves - they build up, peak, and then crash down. You can ride this wave without acting on it.",
        this.getRandomResponse(this.recoveryStrategies.coping),
        "Remember: This feeling is temporary. You've gotten through cravings before, and you can do it again."
      ];
    }

    if (lowerMessage.includes('relapse') || lowerMessage.includes('slip') || lowerMessage.includes('used')) {
      return [
        "A slip doesn't erase all your progress. Recovery is a journey with ups and downs.",
        "What matters most is what you do next. Can you reach out to your support network?",
        "Be gentle with yourself. Self-compassion is crucial for healing."
      ];
    }

    if (lowerMessage.includes('family') || lowerMessage.includes('relationship')) {
      return [
        "Relationships can be complex in recovery. Healing often involves rebuilding trust and communication.",
        "Have you considered family therapy or couples counseling? Professional guidance can be very helpful.",
        "Remember, you can only control your own actions and recovery. Focus on being the best version of yourself."
      ];
    }

    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('stress')) {
      return [
        "Work stress is common, especially in early recovery. How are you managing your stress levels?",
        "Consider talking to your supervisor about accommodations if needed. Many workplaces support recovery.",
        this.getRandomResponse(this.recoveryStrategies.coping)
      ];
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
      return [
        "Sleep issues are common in recovery. Your brain is healing and adjusting to new patterns.",
        "Try establishing a consistent bedtime routine: no screens 1 hour before bed, cool room, comfortable environment.",
        "If sleep problems persist, consider talking to a doctor about sleep hygiene or possible medical support."
      ];
    }

    if (lowerMessage.includes('progress') || lowerMessage.includes('better') || lowerMessage.includes('improving')) {
      return [
        this.getRandomResponse(this.recoveryStrategies.motivation),
        "Progress isn't always linear, but every step forward matters. What positive changes have you noticed?",
        "Celebrating progress, no matter how small, reinforces positive neural pathways. You're doing great!"
      ];
    }

    // Time-based contextual responses
    if (context.conversationHistory.length === 0) {
      return [
        this.getRandomResponse(this.contextualResponses[timeOfDay]),
        "I'm here to support you on your recovery journey. What's on your mind today?"
      ];
    }

    // Default supportive responses
    const defaultResponses = [
      "I hear you. Can you tell me more about what you're experiencing right now?",
      "Thank you for sharing that with me. Your feelings and experiences are valid.",
      "Recovery is a brave journey, and you're showing courage by reaching out for support.",
      "What would be most helpful for you right now? I'm here to listen and support you.",
      "How are you taking care of yourself today? Self-care is so important in recovery.",
      "What's one thing that's going well for you lately, even if it's small?",
      "Remember, asking for help is a sign of strength, not weakness. You're doing the right thing."
    ];

    return [this.getRandomResponse(defaultResponses)];
  }

  public async getWelcomeMessage(riskLevel: 'safe' | 'medium' | 'high' | null): Promise<string> {
    const timeOfDay = this.getTimeOfDay();
    const timeGreeting = this.getRandomResponse(this.contextualResponses[timeOfDay]);
    
    let riskMessage = "";
    if (riskLevel === 'high') {
      riskMessage = " I understand you're going through a particularly challenging time, and I want you to know that immediate support is available if you need it.";
    } else if (riskLevel === 'medium') {
      riskMessage = " I'm here to provide extra support as you navigate your recovery journey.";
    } else {
      riskMessage = " I'm here to support you in maintaining your positive progress.";
    }

    return timeGreeting + riskMessage + " What would you like to talk about today?";
  }
}
