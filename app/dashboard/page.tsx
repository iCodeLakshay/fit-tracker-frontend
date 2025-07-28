'use client';

import { useState, useEffect } from 'react';
import { useAuthProtection } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Target, Calendar, Dumbbell } from 'lucide-react';
import Navigation from '@/components/Navigation';
import WorkoutModal from '@/components/WorkoutModal';
import BMICalculator from '@/components/BMICalculator';
import ProgressCharts from '@/components/ProgressCharts';
import { Workout, BodyMeasurement } from '@/types';
import { getAllWorkouts, getUserProfile } from '@/server/common';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'workouts' | 'bmi' | 'reports' | 'trainer'>('dashboard');
  
  // Protect this page from unauthenticated users
  const { userId } = useAuthProtection();
  
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return; // Don't load data if userId is not available
      
      try {
        const [workoutsData, userProfileData] = await Promise.all([
          getAllWorkouts(),
          getUserProfile(userId)
        ]);
        setWorkouts(workoutsData);
        setWeight(userProfileData.weight || '');
        setBMI(userProfileData.bmi || 0);
        setUsername(userProfileData.username || null);
        // Create a synthetic bodyMeasurement from the user profile data for the charts
        if (userProfileData && userProfileData.weight && userProfileData.height && userProfileData.bmi) {
          const syntheticMeasurement: BodyMeasurement = {
            id: userId,
            date: new Date().toISOString(),
            height: userProfileData.height,
            weight: userProfileData.weight,
            bmi: userProfileData.bmi
          };
          setBodyMeasurements([syntheticMeasurement]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [userId]); // Re-run when userId changes

  const refreshData = async () => {
    if (!userId) return; // Don't refresh if userId is not available
    
    try {
      const [workoutsData, userProfileData] = await Promise.all([
        getAllWorkouts(),
        getUserProfile(userId)
      ]);
      setWorkouts(workoutsData);
      setWeight(userProfileData.weight || '');
      setBMI(userProfileData.bmi || 0);
      
      // Create a synthetic bodyMeasurement from the user profile data for the charts
      if (userProfileData && userProfileData.weight && userProfileData.height && userProfileData.bmi) {
        const syntheticMeasurement: BodyMeasurement = {
          id: userId,
          date: new Date().toISOString(),
          height: userProfileData.height,
          weight: userProfileData.weight,
          bmi: userProfileData.bmi
        };
        setBodyMeasurements([syntheticMeasurement]);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const thisWeekWorkouts = workouts.filter(w => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.date) > weekAgo;
  }).length;

  const totalWorkouts = workouts.length;
  const currentWeight = weight;
  const currentBMI = bmi;

  const bodyPartCounts = workouts.reduce((acc, workout) => {
    acc[workout.bodyPart] = (acc[workout.bodyPart] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBodyParts = Object.entries(bodyPartCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{thisWeekWorkouts}</div>
            <p className="text-xs text-blue-700">workouts completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalWorkouts}</div>
            <p className="text-xs text-green-700">all time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Current Weight</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{currentWeight || '--'}</div>
            <p className="text-xs text-purple-700">kg</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Current BMI</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{currentBMI?.toFixed(1) || '--'}</div>
            <p className="text-xs text-orange-700">body mass index</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => setShowWorkoutModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </Button>
          <Button variant="outline" onClick={() => setActiveView('bmi')}>
            BMI Calculator
          </Button>
          <Button variant="outline" onClick={() => setActiveView('reports')}>
            View Reports
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div key={workout.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{workout.workoutName}</div>
                      <div className="text-sm text-gray-600">{workout.sets} sets × {workout.reps} reps</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{workout.bodyPart}</Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No workouts logged yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Body Parts</CardTitle>
            <CardDescription>Most trained muscle groups</CardDescription>
          </CardHeader>
          <CardContent>
            {topBodyParts.length > 0 ? (
              <div className="space-y-3">
                {topBodyParts.map(([bodyPart, count]) => (
                  <div key={bodyPart} className="flex items-center justify-between">
                    <span className="font-medium capitalize">{bodyPart}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(bodyPartCounts))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Start logging workouts to see stats</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeView === 'dashboard' && `Welcome,${username}`}
            {activeView === 'workouts' && 'Workouts'}
            {activeView === 'bmi' && 'BMI Calculator'}
            {activeView === 'reports' && 'Progress Reports'}
          </h1>
          <p className="text-gray-600 mt-1">
            {activeView === 'dashboard' && 'Track your fitness journey'}
            {activeView === 'workouts' && 'Log and manage your training sessions'}
            {activeView === 'bmi' && 'Calculate and track your BMI'}
            {activeView === 'reports' && 'Analyze your progress over time'}
          </p>
        </div>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'bmi' && <BMICalculator onUpdate={refreshData} />}
        {activeView === 'reports' && <ProgressCharts workouts={workouts} bodyMeasurements={bodyMeasurements} />}
      </main>

      <WorkoutModal 
        open={showWorkoutModal} 
        onClose={() => setShowWorkoutModal(false)}
        onSave={refreshData}
      />
    </div>
  );
}