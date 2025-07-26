export interface Workout {
  _id: string;
  userId: string;
  date: string;
  workoutName: string;
  bodyPart: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  height: number;
  weight: number;
  bmi: number;
}