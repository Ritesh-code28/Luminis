// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:10000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.wsURL = WS_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST'
    });
  }

  // Blog methods
  async getBlogs() {
    return this.request('/api/blogs');
  }

  async createBlog(blogData) {
    return this.request('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  }

  async getBlog(id) {
    return this.request(`/api/blogs/${id}`);
  }

  // Profile methods
  async getProfile() {
    return this.request('/api/profile');
  }

  async updateProfile(profileData) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Friend methods
  async getFriends() {
    return this.request('/api/friends');
  }

  async sendFriendRequest(userId) {
    return this.request('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  async respondToFriendRequest(requestId, accept) {
    return this.request(`/api/friends/request/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ accept })
    });
  }

  // WebSocket connection
  createWebSocket() {
    const token = localStorage.getItem('authToken');
    const ws = new WebSocket(`${this.wsURL}/ws`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      if (token) {
        ws.send(JSON.stringify({
          type: 'auth',
          token
        }));
      }
    };

    return ws;
  }
}

export const apiService = new ApiService();
export { API_BASE_URL, WS_BASE_URL };