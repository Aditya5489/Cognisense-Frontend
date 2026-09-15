const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

export const TOKEN_KEY = 'cognisense_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        response.statusText ||
        'Request failed';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Health check
  checkHealth: () => request('/health'),

  // Auth
  login: ({ email, password }) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (userData) =>
    request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/me'),

  updateProfile: (profileData) =>
    request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Assessment
  submitAssessment: (assessmentData) =>
    request('/assess', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    }),

  // History
  getHistory: () => request('/history'),

  getAssessmentDetail: (id) => request(`/history/${id}`),

  // Nearby Doctors
  getNearbyDoctors: (location = 'your city') =>
    request('/nearby-doctors', {
      method: 'POST',
      body: JSON.stringify({ location }),
    }),

  // Games & Telemetry
  saveGameScore: (scoreData) =>
    request('/game-score', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    }),

  getGameScores: (game = '') =>
    request(`/game-scores${game ? `?game=${encodeURIComponent(game)}` : ''}`),

  getGameLeaderboard: (game = 'memory') =>
    request(`/game-leaderboard?game=${encodeURIComponent(game)}`),
};

export default api;
