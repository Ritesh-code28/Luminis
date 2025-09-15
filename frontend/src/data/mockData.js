// Mock data for the Echo application
export const mockData = {
  // Available avatar styles (Blooms)
  avatarStyles: [
    { id: 'serene', name: 'Serene', emoji: '🌸', description: 'Peaceful and calming' },
    { id: 'vibrant', name: 'Vibrant', emoji: '🌟', description: 'Energetic and bright' },
    { id: 'nature', name: 'Nature', emoji: '🌿', description: 'Connected to earth' },
    { id: 'cosmic', name: 'Cosmic', emoji: '✨', description: 'Mystical and dreamy' },
    { id: 'gentle', name: 'Gentle', emoji: '🕊️', description: 'Soft and kind' },
    { id: 'creative', name: 'Creative', emoji: '🎨', description: 'Artistic and expressive' },
    { id: 'wisdom', name: 'Wisdom', emoji: '🦉', description: 'Thoughtful and wise' }
  ],

  // Color palette options
  colorPalettes: [
    { id: 'sage', name: 'Sage', color: '#87A96B', description: 'Natural harmony' },
    { id: 'lavender', name: 'Lavender', color: '#B19CD9', description: 'Peaceful serenity' },
    { id: 'blush', name: 'Blush', color: '#F4A7A7', description: 'Gentle warmth' },
    { id: 'mint', name: 'Mint', color: '#A8E6CF', description: 'Fresh clarity' },
    { id: 'cream', name: 'Cream', color: '#FFF5E6', description: 'Pure comfort' },
    { id: 'silver', name: 'Silver', color: '#E8E8E8', description: 'Elegant simplicity' },
    { id: 'charcoal', name: 'Charcoal', color: '#4A4A4A', description: 'Grounded strength' },
    { id: 'teal', name: 'Deep Teal', color: '#2C5F5D', description: 'Ocean depth' }
  ],

  // Mock streams (topic-based groups)
  streams: [
    {
      id: 'mindfulness',
      name: 'Mindful Moments',
      description: 'Share your daily mindfulness practices and peaceful thoughts',
      memberCount: 1247,
      color: '#87A96B',
      emoji: '🧘‍♀️',
      isJoined: true,
      recentActivity: '2 hours ago'
    },
    {
      id: 'creative-souls',
      name: 'Creative Souls',
      description: 'A space for artists, writers, and dreamers to connect',
      memberCount: 892,
      color: '#B19CD9',
      emoji: '🎨',
      isJoined: false,
      recentActivity: '5 minutes ago'
    },
    {
      id: 'nature-lovers',
      name: 'Nature Lovers',
      description: 'Celebrate the beauty of the natural world',
      memberCount: 2103,
      color: '#A8E6CF',
      emoji: '🌲',
      isJoined: true,
      recentActivity: '1 hour ago'
    },
    {
      id: 'gentle-wisdom',
      name: 'Gentle Wisdom',
      description: 'Share life lessons and thoughtful reflections',
      memberCount: 567,
      color: '#F4A7A7',
      emoji: '🕊️',
      isJoined: false,
      recentActivity: '3 hours ago'
    },
    {
      id: 'cosmic-thoughts',
      name: 'Cosmic Thoughts',
      description: 'Explore the mysteries of existence and consciousness',
      memberCount: 734,
      color: '#2C5F5D',
      emoji: '✨',
      isJoined: true,
      recentActivity: '30 minutes ago'
    }
  ],

  // Mock blog posts
  blogs: [
    {
      id: 'finding-peace',
      title: 'Finding Peace in Digital Chaos',
      content: 'In our hyperconnected world, finding moments of genuine peace has become both more challenging and more essential than ever. This morning, as I sat with my coffee and watched the sunrise through my window, I was reminded of the simple power of being present...\n\nThe key to finding peace isn\'t to eliminate all digital noise—it\'s to create intentional spaces of calm. Here are some practices that have helped me:\n\n1. **Morning Mindfulness**: Before checking any devices, spend 10 minutes in quiet reflection.\n\n2. **Digital Boundaries**: Set specific times when devices are put away.\n\n3. **Nature Connection**: Even a few minutes outdoors can reset our nervous system.\n\n4. **Mindful Transitions**: Use the time between activities as mini-meditation moments.\n\nRemember, peace isn\'t a destination—it\'s a practice we return to, again and again.',
      author: 'Luna Sage',
      authorId: 'luna-sage',
      authorAvatar: '🌙',
      authorBio: 'Mindfulness teacher and digital wellness advocate',
      publishDate: '2024-01-15',
      readTime: '3 min read',
      likes: 127,
      comments: 23,
      tags: ['mindfulness', 'digital-wellness', 'peace'],
      excerpt: 'Discovering tranquility in our hyperconnected world through intentional practices and mindful awareness.'
    },
    {
      id: 'creative-morning-ritual',
      title: 'The Magic of Creative Morning Rituals',
      content: 'Every creative soul needs a ritual that awakens their imagination. Mine begins before dawn, in the quiet hours when the world still sleeps...\n\nI\'ve discovered that creativity isn\'t just about inspiration—it\'s about creating the right conditions for ideas to flourish. My morning ritual includes:\n\n**The Setup**: A clean, beautiful space with natural light\n**The Practice**: 20 minutes of free-writing or sketching\n**The Intention**: Setting a creative goal for the day\n**The Gratitude**: Acknowledging the gift of creative expression\n\nWhat I\'ve learned is that consistency matters more than intensity. Small, daily acts of creativity compound into something beautiful over time.\n\nYour ritual doesn\'t have to look like mine. It might be dancing to your favorite song, taking photos of morning light, or simply sitting quietly with a sketchbook. The key is to honor your creative spirit with intentional time and space.',
      author: 'River Chen',
      authorId: 'river-chen',
      authorAvatar: '🎨',
      authorBio: 'Visual artist and creative coach',
      publishDate: '2024-01-12',
      readTime: '4 min read',
      likes: 89,
      comments: 15,
      tags: ['creativity', 'morning-ritual', 'artistic-practice'],
      excerpt: 'How establishing a sacred morning practice can unlock your creative potential and transform your artistic journey.'
    },
    {
      id: 'connection-in-solitude',
      title: 'Finding Connection in Solitude',
      content: 'Paradox lives at the heart of human experience. We are social beings who need solitude, individuals who crave connection...\n\nLast week, I spent three days alone in a cabin by the lake. No internet, no phone, just me and the gentle rhythm of water against shore. I expected to feel lonely, but instead, I felt more connected than ever—to myself, to nature, to the universal experience of being human.\n\nSolitude taught me that connection isn\'t always about being with others. Sometimes it\'s about:\n\n- **Listening to your inner voice** without external noise\n- **Observing nature** and feeling part of something larger\n- **Reflecting on relationships** and appreciating them more deeply\n- **Creating space** for new insights to emerge\n\nWhen I returned to the world, I felt more present in my conversations, more authentic in my interactions. Solitude hadn\'t isolated me—it had prepared me for deeper connection.\n\nIn our always-on culture, we\'ve forgotten that being alone and being lonely are different things. Solitude is a choice, a practice, a gift we give ourselves.',
      author: 'Ocean Blue',
      authorId: 'ocean-blue',
      authorAvatar: '🌊',
      authorBio: 'Writer and contemplative living advocate',
      publishDate: '2024-01-10',
      readTime: '5 min read',
      likes: 156,
      comments: 31,
      tags: ['solitude', 'connection', 'reflection'],
      excerpt: 'Exploring the beautiful paradox of how time alone can deepen our capacity for meaningful connection with others.'
    }
  ],

  // Finn's profile data
  finnProfile: {
    id: 'finn',
    name: 'FINN',
    avatar: '🐬',
    bio: 'Friendly dolphin spreading joy and wisdom across the digital seas. Always here to help fellow Echo travelers find their peaceful path. 🌊✨',
    joinDate: '2023-01-01',
    bloomStyle: 'cosmic',
    colorPalette: 'teal',
    friendsCount: 1337,
    postsCount: 89,
    favoriteQuote: '"In the depths of silence, we find the songs of our soul." - Ocean Wisdom',
    interests: ['Ocean wisdom', 'Digital mindfulness', 'Community building', 'Peaceful connections'],
    recentPosts: [
      {
        id: 'finn-post-1',
        content: 'Just witnessed the most beautiful sunrise from the digital horizon. Remember, every day is a new chance to spread kindness! 🌅',
        timestamp: '2024-01-15T06:30:00Z',
        likes: 42
      },
      {
        id: 'finn-post-2',
        content: 'Pro tip: When the digital waves get rough, take three deep breaths and remember why you chose to be here. Connection over perfection, always. 💙',
        timestamp: '2024-01-14T14:20:00Z',
        likes: 67
      }
    ]
  }
}

// Helper functions for data manipulation
export const getStreamById = (id) => mockData.streams.find(stream => stream.id === id)
export const getBlogById = (id) => mockData.blogs.find(blog => blog.id === id)
export const getBlogsByAuthor = (authorId) => mockData.blogs.filter(blog => blog.authorId === authorId)
export const getMostLikedBlogs = () => [...mockData.blogs].sort((a, b) => b.likes - a.likes)