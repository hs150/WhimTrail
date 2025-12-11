import { create } from 'zustand';

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        set({ user: data.user, token: data.token, isAuthenticated: true });
        localStorage.setItem('token', data.token);
        return data;
      } else {
        set({ error: data.message });
        throw new Error(data.message);
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (firstName, lastName, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
      });
      const data = await response.json();
      if (response.ok) {
        set({ user: data.user, token: data.token, isAuthenticated: true });
        localStorage.setItem('token', data.token);
        return data;
      } else {
        set({ error: data.message });
        throw new Error(data.message);
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

// User Store
export const useUserStore = create((set) => ({
  user: null,
  preferences: {
    theme: 'light',
    currency: 'USD',
    language: 'English',
    notifications: { email: true, push: false }
  },

  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),

  updatePreferences: async (token, newPreferences) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPreferences)
      });
      const data = await response.json();
      if (response.ok) {
        set({ preferences: data.preferences });
      }
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}));

// Destination Store
export const useDestinationStore = create((set) => ({
  destinations: [],
  selectedDestination: null,
  loading: false,
  filter: {
    category: '',
    city: '',
    rating: '',
    budget: ''
  },

  setDestinations: (destinations) => set({ destinations }),
  setSelectedDestination: (destination) => set({ selectedDestination: destination }),
  setLoading: (loading) => set({ loading }),
  setFilter: (filter) => set({ filter }),

  fetchDestinations: async (filters = {}) => {
    set({ loading: true });
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/destinations?${query}`);
      const data = await response.json();
      set({ destinations: data.destinations, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));