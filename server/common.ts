import { Workout } from "@/types";
import axiosInstance from "./axios";

export const getAllWorkouts = async() => {
    try {
        const response = await axiosInstance.get("/workout/all-workouts");
        return response.data;
    } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
    }
}

export const saveWorkout = async(workout: Workout) =>{
    try {
        // Add weight property as required by the backend model
        const workoutWithWeight = {
            ...workout,
            weight: 0 // Default weight value since it's required by the backend
        };
        const response = await axiosInstance.post("/workout", workoutWithWeight);
        return response.data;

    } catch (error) {
        console.error("Error saving workout:", error);
        throw error;
    }
}

export const deleteWorkout = async(workoutId: string) => {
    try {
        const response = await axiosInstance.delete(`/workout/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting workout:", error);
        throw error;
    }
}

// User related functions

export const createUser = async(user: { name: string, email: string }) => {
    try {
        const response = await axiosInstance.post("/user", user);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export const updateBodyMetrics = async(userId: string, metrics: { height: number, weight: number, bmi: number })=>{
    try {
        const response = await axiosInstance.patch(`/user/${userId}`, metrics);
        return response.data;
    } catch (error) {
        console.error("Error updating body metrics:", error);
        throw error;
    }
}

export const getUserProfile = async(userId: string) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Auth related functions
export const loginUser = async(credentials: { email: string, password: string }) => {
    try {
        const response = await axiosInstance.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export const registerUser = async(userData: { 
    email: string, 
    password: string, 
    username: string,
    weight: number,
    height: number,
    bmi: number 
}) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}