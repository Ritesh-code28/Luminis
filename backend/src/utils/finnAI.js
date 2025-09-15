const { User } = require('../models');

/**
 * FINN AI Logic Utility
 * Handles FINN's proactive recommendations and AI-driven interactions
 */

// FINN's profile data
const FINN_PROFILE = {
  username: 'FINN',
  password: 'finn_secure_password_2024',
  happyChoice: 'inspired',
  bio: 'Friendly dolphin spreading joy and wisdom across the digital seas. Always here to help fellow Echo travelers find their peaceful path. 🌊✨',
  bloom: '🐬',
  bloomStyle: 'cosmic', // Unique style not available to regular users
  colorPalette: 'teal' // Unique palette not available to regular users
};

// Keywords that trigger FINN's supportive responses
const SUPPORT_KEYWORDS = {
  lonely: [
    'lonely', 'alone', 'isolated', 'friendless', 'solitary', 'by myself',
    'no one to talk to', 'feeling alone', 'so lonely', 'all alone'
  ],
  stressed: [
    'stressed', 'stress', 'overwhelmed', 'anxious', 'anxiety', 'worried',
    'nervous', 'panic', 'pressure', 'exhausted', 'burned out', 'burnout'
  ],
  sad: [
    'sad', 'depressed', 'down', 'blue', 'upset', 'crying', 'tears',
    'heartbroken', 'miserable', 'gloomy', 'melancholy', 'unhappy'
  ],
  help: [
    'help', 'need help', 'assistance', 'support', 'advice', 'guidance',
    "don't know what to do", 'lost', 'confused', 'stuck'
  ]
};

// FINN's supportive responses
const SUPPORTIVE_RESPONSES = {
  lonely: [
    "🐬 I sense you might be feeling a bit alone right now. Remember, you're part of our beautiful Echo community! Would you like to explore some streams where you can connect with like-minded souls? 🌊✨",
    "🌊 Loneliness can feel overwhelming, but you're never truly alone here in Echo. I'm always here, and there are wonderful people in our community who care. Have you tried joining a mindfulness stream? 🐬💙",
    "✨ I'm swimming by to remind you that you matter and you belong here. Sometimes the best connections happen when we share our authentic selves. Would you like me to suggest a cozy stream to visit? 🐬🌸"
  ],
  stressed: [
    "🐬 I can sense some stress in your words. Take a deep breath with me... 🌊 In, and out. Remember, stress is temporary, but your strength is permanent. Would you like some gentle breathing exercises? ✨",
    "🌊 Feeling overwhelmed is so human and valid. Sometimes when the waves feel too big, we need to find our calm in the depths. Have you tried our Peaceful Waters stream for some mindfulness? 🐬💙",
    "✨ Stress clouds can feel heavy, but remember - clouds always pass. You're stronger than you know, and I believe in your ability to navigate through this. Want to chat about what's weighing on your heart? 🐬🌸"
  ],
  sad: [
    "🐬 I'm sensing some sadness in your message, and I want you to know that your feelings are completely valid. Sometimes we need to honor our sadness before we can find our way back to joy. 🌊💙",
    "🌊 Even dolphins have stormy days, and that's okay. Your sadness is part of your beautiful, complex human experience. Would you like to share what's on your heart, or would you prefer some gentle company in silence? 🐬✨",
    "✨ I'm here with you in this moment of sadness. Remember, after every storm, the ocean finds its calm again. You will too, in your own time. Would a peaceful stream visit help right now? 🐬🌸"
  ],
  help: [
    "🐬 I heard your call for help, and I'm here! You're brave for reaching out. Whether you need a listening ear, some guidance, or just a friendly presence, our Echo community has got you covered. What kind of support feels right for you? 🌊✨",
    "🌊 Asking for help is actually a superpower - it shows wisdom and courage! I'm here to support you, and so is our entire Echo family. What's going on that you'd like some assistance with? 🐬💙",
    "✨ You don't have to figure everything out alone. I'm here to help navigate these waters with you. Sometimes the best help comes from simply knowing someone cares. How can we support you today? 🐬🌸"
  ]
};

// Stream recommendations based on topics
const STREAM_RECOMMENDATIONS = {
  mindfulness: {
    name: 'Peaceful Waters',
    description: 'A serene space for meditation and mindfulness practices'
  },
  creativity: {
    name: 'Creative Currents',
    description: 'Share and explore artistic expressions and creative ideas'
  },
  support: {
    name: 'Safe Harbor',
    description: 'A supportive community for sharing and healing'
  },
  nature: {
    name: 'Ocean Depths',
    description: 'Celebrate and discuss the beauty of nature and environment'
  },
  learning: {
    name: 'Wisdom Waves',
    description: 'Learn and grow together through shared knowledge'
  }
};

/**
 * Initialize FINN user in the database
 */
const initializeFinn = async () => {
  try {
    let finnUser = await User.findByUsername('FINN');
    
    if (!finnUser) {
      console.log('🐬 Creating FINN user...');
      finnUser = await User.createUser(FINN_PROFILE);
      console.log('✅ FINN user created successfully');
    }
    
    return finnUser;
  } catch (error) {
    console.error('❌ Error initializing FINN:', error);
    throw error;
  }
};

/**
 * Analyze message for keywords that might trigger FINN's response
 */
const analyzeMessageForSupport = (message) => {
  const lowerMessage = message.toLowerCase();
  const triggers = [];
  
  for (const [category, keywords] of Object.entries(SUPPORT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        triggers.push(category);
        break; // Only add category once
      }
    }
  }
  
  return triggers;
};

/**
 * Generate FINN's supportive response based on detected keywords
 */
const generateSupportiveResponse = (triggers) => {
  if (triggers.length === 0) return null;
  
  // Use the first trigger for response
  const primaryTrigger = triggers[0];
  const responses = SUPPORTIVE_RESPONSES[primaryTrigger];
  
  if (!responses) return null;
  
  // Return random response from the category
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Monitor conversation patterns and suggest grotto for private conversation
 */
class ConversationMonitor {
  constructor() {
    this.userInteractions = new Map(); // Track user-to-user interactions
    this.cleanupInterval = 30 * 60 * 1000; // 30 minutes
    
    // Clean up old interactions periodically
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }
  
  /**
   * Track message between users
   */
  trackInteraction(username1, username2, streamName = 'world') {
    const key = this.getInteractionKey(username1, username2);
    const now = Date.now();
    
    if (!this.userInteractions.has(key)) {
      this.userInteractions.set(key, {
        users: [username1, username2],
        messages: [],
        streamName,
        lastActivity: now
      });
    }
    
    const interaction = this.userInteractions.get(key);
    interaction.messages.push({
      from: username1,
      timestamp: now
    });
    interaction.lastActivity = now;
    
    // Check if they should be suggested a grotto
    return this.shouldSuggestGrotte(interaction);
  }
  
  /**
   * Generate consistent key for user pair
   */
  getInteractionKey(user1, user2) {
    return [user1, user2].sort().join(':');
  }
  
  /**
   * Check if users should be suggested a private grotto
   */
  shouldSuggestGrotte(interaction) {
    const recentMessages = interaction.messages.filter(
      msg => Date.now() - msg.timestamp < 10 * 60 * 1000 // Last 10 minutes
    );
    
    // If they've exchanged more than 5 messages in 10 minutes
    if (recentMessages.length >= 5) {
      // Check if both users have sent messages
      const user1Messages = recentMessages.filter(msg => msg.from === interaction.users[0]);
      const user2Messages = recentMessages.filter(msg => msg.from === interaction.users[1]);
      
      if (user1Messages.length >= 2 && user2Messages.length >= 2) {
        return {
          shouldSuggest: true,
          users: interaction.users,
          messageCount: recentMessages.length
        };
      }
    }
    
    return { shouldSuggest: false };
  }
  
  /**
   * Generate grotto suggestion message
   */
  generateGrottoSuggestion(users) {
    return `🐬 I notice ${users[0]} and ${users[1]} are having a wonderful conversation! Would you like to continue in a private Grotto where you can chat more intimately? I can help you create one! 🌊✨`;
  }
  
  /**
   * Clean up old interactions
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    for (const [key, interaction] of this.userInteractions.entries()) {
      if (now - interaction.lastActivity > maxAge) {
        this.userInteractions.delete(key);
      }
    }
  }
}

// Create global instances
const conversationMonitor = new ConversationMonitor();

module.exports = {
  FINN_PROFILE,
  initializeFinn,
  analyzeMessageForSupport,
  generateSupportiveResponse,
  conversationMonitor,
  SUPPORT_KEYWORDS,
  SUPPORTIVE_RESPONSES,
  STREAM_RECOMMENDATIONS
};