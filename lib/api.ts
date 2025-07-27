import axiosInstance from '@/server/axios';
import { Workout, BodyMeasurement } from '@/types';

// Workout API functions
export const workoutApi = {
  // Get all workouts
  getAll: async (): Promise<Workout[]> => {
    const response = await fetch('/api/workouts');
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    return response.json();
  },

  // Create a new workout
  create: async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create workout');
    }
    
    const data = await response.json();
    return data.workout;
  },

  // Delete a workout
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/workouts?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }
  },
};

// Body Measurement API functions
export const bodyMeasurementApi = {
  // Get all body measurements
  getAll: async (): Promise<BodyMeasurement[]> => {
    const response = await fetch('/api/body-measurements');
    if (!response.ok) {
      throw new Error('Failed to fetch body measurements');
    }
    return response.json();
  },

  // Create a new body measurement
  create: async (measurement: Omit<BodyMeasurement, 'id'>): Promise<BodyMeasurement> => {
    const response = await fetch('/api/body-measurements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(measurement),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create body measurement');
    }
    
    const data = await response.json();
    return data.measurement;
  },

  // Delete a body measurement
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/body-measurements?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete body measurement');
    }
  },
};

// --- AI Trainer API functions ---
export const aiApi = {
  // Fetch dynamic AI suggestions
  getSuggestions: async (): Promise<string[]> => {
    const { data } = await axiosInstance.get('/ai/suggestions');
    return data.suggestions || [];
  },

  // Send a message to the AI trainer
  sendMessage: async (
    message: string,
    conversationHistory: { sender: string; content: string }[]
  ): Promise<string> => {
    const { data } = await axiosInstance.post('/ai/chat', { message, conversationHistory });
    return data.response || '';
  },
};