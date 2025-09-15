/**
 * Word Tracker Utility
 * Filters and moderates chat messages for inappropriate content
 */

// Toxic words list (as specified in requirements)
const toxicWords = [
  // Basic profanity
  'hate', 'kill', 'suicide', 'shit', 'fuck', 'damn', 'hell',
  
  // Violence and harmful content
  'murder', 'death', 'destroy', 'attack', 'violence', 'harm',
  'hurt', 'pain', 'suffer', 'torture', 'abuse', 'assault',
  
  // Discriminatory language
  'racist', 'sexist', 'homophobic', 'transphobic', 'bigot',
  
  // Toxic behavior
  'toxic', 'troll', 'spam', 'scam', 'fraud', 'cheat',
  'lie', 'liar', 'fake', 'stupid', 'idiot', 'moron',
  
  // Inappropriate content
  'porn', 'sex', 'nude', 'naked', 'explicit', 'adult',
  
  // Drug-related
  'drug', 'cocaine', 'heroin', 'marijuana', 'weed', 'alcohol',
  
  // Additional harmful content
  'bully', 'bullying', 'harass', 'harassment', 'threat', 'threaten',
  'revenge', 'retaliation', 'payback', 'punishment'
];

// Regex patterns for filtering
const phoneNumberRegex = /\d{10,}/g; // 10 or more consecutive digits
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g; // Email pattern

/**
 * Main word tracking function that filters a message
 * @param {string} message - The original message to filter
 * @param {object} options - Configuration options
 * @returns {object} Filtered message and metadata
 */
const wordTracker = (message, options = {}) => {
  if (!message || typeof message !== 'string') {
    return {
      originalMessage: message || '',
      filteredMessage: '',
      wasFiltered: false,
      filterReasons: [],
      warnings: []
    };
  }

  const {
    replacementChar = '***',
    strictMode = false,
    preserveLength = false
  } = options;

  let filteredMessage = message;
  let wasFiltered = false;
  const filterReasons = [];
  const warnings = [];

  // 1. Remove phone numbers (10 or more digits)
  const phoneMatches = filteredMessage.match(phoneNumberRegex);
  if (phoneMatches && phoneMatches.length > 0) {
    filteredMessage = filteredMessage.replace(phoneNumberRegex, '[phone removed]');
    wasFiltered = true;
    filterReasons.push('phone_number');
    warnings.push(`Removed ${phoneMatches.length} phone number(s)`);
  }

  // 2. Remove email addresses
  const emailMatches = filteredMessage.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    filteredMessage = filteredMessage.replace(emailRegex, '[email removed]');
    wasFiltered = true;
    filterReasons.push('email_address');
    warnings.push(`Removed ${emailMatches.length} email address(es)`);
  }

  // 3. Filter toxic words
  const toxicWordsFound = [];
  const words = filteredMessage.toLowerCase().split(/\s+/);
  
  toxicWords.forEach(toxicWord => {
    const regex = new RegExp(`\\b${toxicWord}\\b`, 'gi');
    if (regex.test(filteredMessage)) {
      const replacement = preserveLength 
        ? '*'.repeat(toxicWord.length)
        : replacementChar;
      
      filteredMessage = filteredMessage.replace(regex, replacement);
      toxicWordsFound.push(toxicWord);
      wasFiltered = true;
    }
  });

  if (toxicWordsFound.length > 0) {
    filterReasons.push('toxic_words');
    warnings.push(`Filtered ${toxicWordsFound.length} inappropriate word(s)`);
  }

  // 4. Additional filtering for strict mode
  if (strictMode) {
    // Filter excessive caps (more than 70% uppercase)
    const uppercaseRatio = (filteredMessage.match(/[A-Z]/g) || []).length / filteredMessage.length;
    if (uppercaseRatio > 0.7 && filteredMessage.length > 10) {
      filteredMessage = filteredMessage.toLowerCase();
      wasFiltered = true;
      filterReasons.push('excessive_caps');
      warnings.push('Converted excessive caps to lowercase');
    }

    // Filter excessive punctuation
    const excessivePunctuation = /([!@#$%^&*()_+=\[\]{}|;':",./<>?`~])\1{3,}/g;
    if (excessivePunctuation.test(filteredMessage)) {
      filteredMessage = filteredMessage.replace(excessivePunctuation, '$1$1$1');
      wasFiltered = true;
      filterReasons.push('excessive_punctuation');
      warnings.push('Reduced excessive punctuation');
    }
  }

  // 5. Trim whitespace and ensure message isn't empty
  filteredMessage = filteredMessage.trim();
  
  if (filteredMessage.length === 0 && message.trim().length > 0) {
    filteredMessage = '[message filtered]';
    wasFiltered = true;
    filterReasons.push('completely_filtered');
    warnings.push('Message was completely filtered');
  }

  return {
    originalMessage: message,
    filteredMessage,
    wasFiltered,
    filterReasons,
    warnings,
    toxicWordsFound,
    phoneNumbersRemoved: phoneMatches ? phoneMatches.length : 0,
    emailsRemoved: emailMatches ? emailMatches.length : 0
  };
};

/**
 * Validates if a message is appropriate for Echo's peaceful environment
 * @param {string} message - Message to validate
 * @returns {object} Validation result
 */
const validateMessage = (message) => {
  const result = wordTracker(message, { strictMode: true });
  
  const isAppropriate = !result.wasFiltered || (
    result.filterReasons.length === 1 && 
    ['excessive_caps', 'excessive_punctuation'].includes(result.filterReasons[0])
  );

  return {
    isAppropriate,
    message: result.filteredMessage,
    warnings: result.warnings,
    severity: result.wasFiltered ? 
      (result.filterReasons.includes('toxic_words') ? 'high' : 'low') : 'none'
  };
};

/**
 * Batch process multiple messages
 * @param {string[]} messages - Array of messages to filter
 * @param {object} options - Configuration options
 * @returns {object[]} Array of filtered message results
 */
const batchWordTracker = (messages, options = {}) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.map(message => wordTracker(message, options));
};

/**
 * Get statistics about filtering
 * @param {object[]} filterResults - Array of filter results
 * @returns {object} Statistics object
 */
const getFilteringStats = (filterResults) => {
  if (!Array.isArray(filterResults)) {
    return {};
  }

  const totalMessages = filterResults.length;
  const filteredMessages = filterResults.filter(result => result.wasFiltered).length;
  const filterReasons = {};
  
  filterResults.forEach(result => {
    result.filterReasons.forEach(reason => {
      filterReasons[reason] = (filterReasons[reason] || 0) + 1;
    });
  });

  return {
    totalMessages,
    filteredMessages,
    filteredPercentage: totalMessages > 0 ? (filteredMessages / totalMessages * 100).toFixed(2) : 0,
    filterReasons,
    cleanMessages: totalMessages - filteredMessages
  };
};

/**
 * Check if message contains only allowed characters for peaceful communication
 * @param {string} message - Message to check
 * @returns {boolean} True if message uses appropriate characters
 */
const isCharacterSetAppropriate = (message) => {
  // Allow letters, numbers, basic punctuation, emojis, and common symbols
  const allowedCharsRegex = /^[\w\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}.,!?;:'"()\-_+=@#$%&*<>/\\|`~\[\]{}]+$/u;
  return allowedCharsRegex.test(message);
};

/**
 * Generate suggestions for improving a filtered message
 * @param {object} filterResult - Result from wordTracker function
 * @returns {string[]} Array of suggestions
 */
const generateMessageSuggestions = (filterResult) => {
  const suggestions = [];

  if (!filterResult.wasFiltered) {
    return ['Your message looks great!'];
  }

  if (filterResult.filterReasons.includes('toxic_words')) {
    suggestions.push('Try expressing your thoughts with more positive language');
    suggestions.push('Consider focusing on constructive feedback');
  }

  if (filterResult.filterReasons.includes('phone_number')) {
    suggestions.push('For privacy, avoid sharing phone numbers in public chats');
    suggestions.push('Use private messages for sharing contact information');
  }

  if (filterResult.filterReasons.includes('email_address')) {
    suggestions.push('Keep email addresses private for your security');
    suggestions.push('Use the built-in messaging system to connect');
  }

  if (filterResult.filterReasons.includes('excessive_caps')) {
    suggestions.push('Try using normal capitalization for better readability');
  }

  if (filterResult.filterReasons.includes('excessive_punctuation')) {
    suggestions.push('Use punctuation sparingly for clearer communication');
  }

  return suggestions.length > 0 ? suggestions : ['Please try rephrasing your message'];
};

module.exports = {
  wordTracker,
  validateMessage,
  batchWordTracker,
  getFilteringStats,
  isCharacterSetAppropriate,
  generateMessageSuggestions,
  toxicWords, // Export for testing purposes
  phoneNumberRegex,
  emailRegex
};