'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Filter, TrendingUp, Dumbbell } from 'lucide-react';
import { Workout, BodyMeasurement } from '@/types';
import { startOfWeek, startOfMonth, startOfYear, format, subDays, subWeeks, subMonths } from 'date-fns';

interface ProgressChartsProps {
  workouts: Workout[];
  bodyMeasurements: BodyMeasurement[];
}

const bodyPartColors = {
  chest: '#3B82F6',
  back: '#10B981',
  shoulders: '#F59E0B',
  arms: '#EF4444',
  legs: '#8B5CF6',
  abs: '#06B6D4',
  cardio: '#F97316',
  'full body': '#84CC16',
};

export default function ProgressCharts({ workouts, bodyMeasurements }: ProgressChartsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: subWeeks(now, 12), label: 'Last 12 Weeks' };
      case 'month':
        return { start: subMonths(now, 12), label: 'Last 12 Months' };
      case 'year':
        return { start: subMonths(now, 36), label: 'Last 3 Years' };
    }
  };

  const { start: dateStart, label: dateLabel } = getDateRange();

  // Filter workouts by date range and body part
  const filteredWorkouts = (workouts || []).filter(workout => {
    const workoutDate = new Date(workout.date);
    const isInRange = workoutDate >= dateStart;
    const isBodyPartMatch = selectedBodyPart === 'all' || workout.bodyPart === selectedBodyPart;
    return isInRange && isBodyPartMatch;
  });

  // Get unique body parts
  const bodyParts = Array.from(new Set((workouts || []).map(w => w.bodyPart)));

  // Workout frequency data
  const workoutFrequencyData = () => {
    const grouped: Record<string, number> = {};
    
    filteredWorkouts.forEach(workout => {
      let key = '';
      const date = new Date(workout.date);
      
      switch (timeRange) {
        case 'week':
          key = format(startOfWeek(date), 'MMM dd');
          break;
        case 'month':
          key = format(startOfMonth(date), 'MMM yyyy');
          break;
        case 'year':
          key = format(startOfYear(date), 'yyyy');
          break;
      }
      
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([period, count]) => ({
      period,
      workouts: count,
    })).slice(-12);
  };

  // Body part distribution
  const bodyPartData = filteredWorkouts.reduce((acc, workout) => {
    acc[workout.bodyPart] = (acc[workout.bodyPart] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(bodyPartData).map(([bodyPart, count]) => ({
    name: bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1),
    value: count,
    color: bodyPartColors[bodyPart as keyof typeof bodyPartColors] || '#6B7280',
  }));

  // Volume progression (sets × reps)
  const volumeData = () => {
    const grouped: Record<string, { volume: number; count: number }> = {};
    
    filteredWorkouts.forEach(workout => {
      let key = '';
      const date = new Date(workout.date);
      
      switch (timeRange) {
        case 'week':
          key = format(startOfWeek(date), 'MMM dd');
          break;
        case 'month':
          key = format(startOfMonth(date), 'MMM yyyy');
          break;
        case 'year':
          key = format(startOfYear(date), 'yyyy');
          break;
      }
      
      const volume = workout.sets * workout.reps;
      if (!grouped[key]) {
        grouped[key] = { volume: 0, count: 0 };
      }
      grouped[key].volume += volume;
      grouped[key].count += 1;
    });

    return Object.entries(grouped).map(([period, data]) => ({
      period,
      volume: data.volume,
      avgVolume: Math.round(data.volume / data.count),
    })).slice(-12);
  };

  // BMI progression
  const bmiData = bodyMeasurements
    .filter(m => new Date(m.date) >= dateStart)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(measurement => ({
      date: format(new Date(measurement.date), 'MMM dd'),
      bmi: measurement.bmi,
      weight: measurement.weight,
    }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Body Part</label>
              <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Body Parts</SelectItem>
                  {bodyParts.map(part => (
                    <SelectItem key={part} value={part}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredWorkouts.length}</div>
            <p className="text-xs text-gray-600">{dateLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredWorkouts.reduce((sum, w) => sum + (w.sets * w.reps), 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">sets × reps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bodyMeasurements.length > 0 ? bodyMeasurements[bodyMeasurements.length - 1].bmi.toFixed(1) : '--'}
            </div>
            <p className="text-xs text-gray-600">body mass index</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="frequency" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="bmi">BMI Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>Workout Frequency</CardTitle>
              <CardDescription>Number of workouts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutFrequencyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#3B82F6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle>Training Volume</CardTitle>
              <CardDescription>Total and average volume (sets × reps) over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="avgVolume" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Body Part Distribution</CardTitle>
              <CardDescription>Breakdown of workouts by muscle group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {Object.entries(bodyPartData)
                    .sort(([,a], [,b]) => b - a)
                    .map(([bodyPart, count]) => (
                      <div key={bodyPart} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: bodyPartColors[bodyPart as keyof typeof bodyPartColors] || '#6B7280' }}
                          />
                          <span className="capitalize font-medium">{bodyPart}</span>
                        </div>
                        <Badge variant="secondary">{count} workouts</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bmi">
          <Card>
            <CardHeader>
              <CardTitle>BMI Progress</CardTitle>
              <CardDescription>Your BMI and weight changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              {bmiData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bmiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="bmi" orientation="left" />
                    <YAxis yAxisId="weight" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="bmi" type="monotone" dataKey="bmi" stroke="#8B5CF6" strokeWidth={2} />
                    <Line yAxisId="weight" type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No BMI data available. Start tracking in the BMI Calculator section.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}