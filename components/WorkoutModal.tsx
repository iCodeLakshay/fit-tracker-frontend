'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { saveWorkout } from '@/server/common';

interface WorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const bodyParts = [
  'chest', 'back', 'shoulders', 'arms', 'legs', 'abs', 'cardio', 'full body'
];

export default function WorkoutModal({ open, onClose, onSave }: WorkoutModalProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName || !bodyPart || !sets || !reps || !weight) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    
    try {
      const workout = {
        userId: String(localStorage.getItem('userId')),
        date: new Date().toISOString(),
        workoutName: exerciseName.trim(),
        bodyPart,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseInt(weight),
      };
      console.log("Workout: ", workout);

      await saveWorkout(workout);
      toast.success('Workout logged successfully!');
      
      // Reset form
      setExerciseName('');
      setBodyPart('');
      setSets('');
      setReps('');
      setWeight('');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log New Workout
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise Name</Label>
            <Input
              id="exercise"
              placeholder="e.g., Bench Press"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Body Part</Label>
            <Select value={bodyPart} onValueChange={setBodyPart} required>
              <SelectTrigger>
                <SelectValue placeholder="Select body part" />
              </SelectTrigger>
              <SelectContent>
                {bodyParts.map((part) => (
                  <SelectItem key={part} value={part}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                placeholder="3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                placeholder="12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                placeholder="20"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Workout'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}