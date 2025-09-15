/**
 * Username Generator Utility
 * Generates meaningful, non-gibberish usernames for Echo users
 */

// Peaceful adjectives that align with Echo's mindful aesthetic
const peacefulAdjectives = [
  'Serene', 'Calm', 'Gentle', 'Peaceful', 'Tranquil', 'Quiet', 
  'Soft', 'Mindful', 'Zen', 'Flowing', 'Bright', 'Pure',
  'Wise', 'Kind', 'Graceful', 'Humble', 'Clear', 'Warm',
  'Radiant', 'Glowing', 'Harmony', 'Sacred', 'Divine', 'Blessed',
  'Cosmic', 'Mystic', 'Ethereal', 'Dreamy', 'Whispering', 'Dancing',
  'Floating', 'Soaring', 'Blissful', 'Joyful', 'Content', 'Balanced',
  'Centered', 'Grounded', 'Rooted', 'Flowing', 'Rippling', 'Shimmering'
];

// Natural elements and peaceful concepts
const naturalNouns = [
  'Ocean', 'River', 'Stream', 'Lake', 'Pond', 'Mist', 'Rain',
  'Cloud', 'Sky', 'Star', 'Moon', 'Sun', 'Dawn', 'Dusk',
  'Forest', 'Tree', 'Leaf', 'Flower', 'Petal', 'Bloom', 'Garden',
  'Mountain', 'Valley', 'Meadow', 'Field', 'Grove', 'Glade',
  'Breeze', 'Wind', 'Whisper', 'Song', 'Melody', 'Harmony',
  'Light', 'Glow', 'Spark', 'Flame', 'Crystal', 'Pearl',
  'Sage', 'Willow', 'Cedar', 'Pine', 'Oak', 'Birch',
  'Lotus', 'Rose', 'Lily', 'Iris', 'Sage', 'Mint',
  'Dream', 'Vision', 'Hope', 'Peace', 'Love', 'Joy',
  'Soul', 'Spirit', 'Heart', 'Mind', 'Path', 'Journey'
];

// Meaningful suffixes that add uniqueness
const meaningfulSuffixes = [
  'Walker', 'Keeper', 'Seeker', 'Finder', 'Dreamer', 'Thinker',
  'Listener', 'Speaker', 'Singer', 'Dancer', 'Writer', 'Artist',
  'Guide', 'Teacher', 'Student', 'Explorer', 'Wanderer', 'Traveler',
  'Guardian', 'Protector', 'Helper', 'Healer', 'Creator', 'Builder',
  'Lover', 'Friend', 'Companion', 'Partner', 'Soul', 'Spirit',
  'Voice', 'Echo', 'Whisper', 'Song', 'Story', 'Tale',
  'Light', 'Star', 'Moon', 'Sun', 'Fire', 'Water'
];

// Simple numbers for uniqueness (if needed)
const simpleNumbers = [1, 2, 3, 7, 8, 9, 11, 21, 77, 88, 99, 108, 111, 222, 333, 777, 888];

/**
 * Generates a random, meaningful username
 * @param {string} pattern - The pattern to use: 'adjective_noun', 'noun_suffix', 'adjective_noun_number'
 * @returns {string} Generated username
 */
const generateUsername = (pattern = null) => {
  // Randomly select pattern if not specified
  const patterns = ['adjective_noun', 'noun_suffix', 'adjective_noun_number'];
  const selectedPattern = pattern || patterns[Math.floor(Math.random() * patterns.length)];

  let username = '';

  switch (selectedPattern) {
    case 'adjective_noun':
      username = getRandomAdjective() + getRandomNoun();
      break;
      
    case 'noun_suffix':
      username = getRandomNoun() + getRandomSuffix();
      break;
      
    case 'adjective_noun_number':
      username = getRandomAdjective() + getRandomNoun() + getRandomNumber();
      break;
      
    default:
      // Default to adjective + noun
      username = getRandomAdjective() + getRandomNoun();
  }

  return username;
};

/**
 * Generates multiple username suggestions
 * @param {number} count - Number of suggestions to generate
 * @returns {string[]} Array of username suggestions
 */
const generateUsernameSuggestions = (count = 5) => {
  const suggestions = [];
  const patterns = ['adjective_noun', 'noun_suffix', 'adjective_noun_number'];
  
  for (let i = 0; i < count; i++) {
    const pattern = patterns[i % patterns.length];
    let username = generateUsername(pattern);
    
    // Ensure uniqueness in suggestions
    while (suggestions.includes(username)) {
      username = generateUsername(pattern);
    }
    
    suggestions.push(username);
  }
  
  return suggestions;
};

/**
 * Validates if a username follows Echo's peaceful aesthetic
 * @param {string} username - Username to validate
 * @returns {boolean} True if username is appropriate
 */
const isUsernameAppropriate = (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // Basic length and character validation
  if (username.length < 3 || username.length > 30) {
    return false;
  }

  // Only allow letters, numbers, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return false;
  }

  // Check for inappropriate words (basic filter)
  const inappropriateWords = [
    'hate', 'kill', 'murder', 'suicide', 'death', 'war', 'fight',
    'angry', 'rage', 'fury', 'violence', 'destroy', 'attack',
    'toxic', 'poison', 'evil', 'devil', 'hell', 'damn'
  ];

  const lowerUsername = username.toLowerCase();
  const hasInappropriateContent = inappropriateWords.some(word => 
    lowerUsername.includes(word)
  );

  return !hasInappropriateContent;
};

/**
 * Creates a personalized username based on user preferences
 * @param {string} happyChoice - User's happiness choice
 * @param {string} bloomStyle - User's preferred bloom style
 * @returns {string} Personalized username
 */
const generatePersonalizedUsername = (happyChoice = 'peaceful', bloomStyle = 'serene') => {
  // Happiness-based adjectives
  const happinessAdjectives = {
    happy: ['Joyful', 'Bright', 'Cheerful', 'Sunny', 'Radiant'],
    calm: ['Serene', 'Tranquil', 'Peaceful', 'Quiet', 'Still'],
    inspired: ['Creative', 'Mystic', 'Visionary', 'Dreamy', 'Cosmic'],
    peaceful: ['Gentle', 'Soft', 'Harmonious', 'Balanced', 'Zen'],
    creative: ['Artistic', 'Imaginative', 'Expressive', 'Colorful', 'Vibrant'],
    thoughtful: ['Wise', 'Mindful', 'Reflective', 'Deep', 'Contemplative'],
    grateful: ['Blessed', 'Thankful', 'Humble', 'Gracious', 'Content']
  };

  // Bloom-based nouns
  const bloomNouns = {
    serene: ['Lake', 'Mist', 'Whisper', 'Breeze', 'Cloud'],
    vibrant: ['Flame', 'Star', 'Rainbow', 'Crystal', 'Spark'],
    nature: ['Forest', 'River', 'Mountain', 'Ocean', 'Garden'],
    cosmic: ['Galaxy', 'Nebula', 'Comet', 'Constellation', 'Aurora'],
    gentle: ['Feather', 'Silk', 'Pearl', 'Dewdrop', 'Butterfly'],
    creative: ['Canvas', 'Melody', 'Story', 'Dance', 'Song'],
    wisdom: ['Sage', 'Oracle', 'Scroll', 'Temple', 'Lantern']
  };

  const selectedAdjectives = happinessAdjectives[happyChoice] || happinessAdjectives.peaceful;
  const selectedNouns = bloomNouns[bloomStyle] || bloomNouns.serene;

  const adjective = selectedAdjectives[Math.floor(Math.random() * selectedAdjectives.length)];
  const noun = selectedNouns[Math.floor(Math.random() * selectedNouns.length)];

  return adjective + noun;
};

// Helper functions
const getRandomAdjective = () => {
  return peacefulAdjectives[Math.floor(Math.random() * peacefulAdjectives.length)];
};

const getRandomNoun = () => {
  return naturalNouns[Math.floor(Math.random() * naturalNouns.length)];
};

const getRandomSuffix = () => {
  return meaningfulSuffixes[Math.floor(Math.random() * meaningfulSuffixes.length)];
};

const getRandomNumber = () => {
  return simpleNumbers[Math.floor(Math.random() * simpleNumbers.length)].toString();
};

module.exports = {
  generateUsername,
  generateUsernameSuggestions,
  generatePersonalizedUsername,
  isUsernameAppropriate
};