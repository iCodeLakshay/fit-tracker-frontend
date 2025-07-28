'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp } from 'lucide-react';
import { BodyMeasurement } from '@/types';
// No longer using bodyMeasurementApi
import { toast } from 'sonner';
import { getUserProfile, updateBodyMetrics } from '@/server/common';

interface BMICalculatorProps {
  onUpdate: () => void;
}

export default function BMICalculator({ onUpdate }: BMICalculatorProps) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMeasurements = async (id: string) => {
      try {
        const userData = await getUserProfile(id);
        // Create a synthetic measurement from user data if it exists
        if (userData && userData.weight && userData.height && userData.bmi) {
          const syntheticMeasurement: BodyMeasurement = {
            id: id,
            date: new Date().toISOString(), // Current date as we don't have a date in the User model
            height: userData.height,
            weight: userData.weight,
            bmi: userData.bmi
          };
          setBodyMeasurements([syntheticMeasurement]);
          
          // Pre-populate the form with the user's data
          setHeight(userData.height.toString());
          setWeight(userData.weight.toString());
          setBmi(userData.bmi);
        }
      } catch (error) {
        console.error('Failed to load measurements:', error);
      }
    };

    const id = String(localStorage.getItem('userId'));
    if (id) {
      loadMeasurements(id);
    }
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) return;
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    
    setBmi(calculatedBMI);
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'bg-blue-100 text-blue-800' };
    if (bmiValue < 25) return { category: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
    return { category: 'Obese', color: 'bg-red-100 text-red-800' };
  };

  const saveMeasurement = async () => {
    if (!height || !weight || !bmi) {
      toast.error('Please calculate BMI first');
      return;
    }

    setLoading(true);
    try {
      const userId = String(localStorage.getItem('userId'));
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      const metrics = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: bmi,
      };

      // Update the user profile with new metrics
      await updateBodyMetrics(userId, metrics);
      
      // Create a synthetic measurement to update the UI
      const syntheticMeasurement: BodyMeasurement = {
        id: userId,
        date: new Date().toISOString(),
        ...metrics
      };
      
      // Add the new measurement to the existing ones
      setBodyMeasurements(prev => [syntheticMeasurement, ...prev]);
      toast.success('Measurement saved successfully!');
      setBmi(0);
      setHeight('');
      setWeight('');
      onUpdate();
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('Failed to save measurement');
    } finally {
      setLoading(false);
    }
  };

  const recentMeasurements = bodyMeasurements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BMI Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              BMI Calculator
            </CardTitle>
            <CardDescription>
              Calculate your Body Mass Index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    setBmi(null);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setBmi(null);
                  }}
                />
              </div>
            </div>

            <Button onClick={calculateBMI} className="w-full bg-blue-600 hover:bg-blue-700">
              Calculate BMI
            </Button>

            {bmi && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{bmi.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">BMI</div>
                </div>
                
                <div className="flex justify-center">
                  <Badge className={getBMICategory(bmi).color}>
                    {getBMICategory(bmi).category}
                  </Badge>
                </div>

                <Button 
                  onClick={saveMeasurement} 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Saving...' : 'Save Measurement'}
                </Button>
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>BMI Categories:</strong></div>
              <div>• Underweight: Below 18.5</div>
              <div>• Normal: 18.5 - 24.9</div>
              <div>• Overweight: 25.0 - 29.9</div>
              <div>• Obese: 30.0 and above</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Measurements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Measurements
            </CardTitle>
            <CardDescription>
              Track your progress over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMeasurements.length > 0 ? (
              <div className="space-y-3">
                {recentMeasurements.map((measurement) => {
                  const category = getBMICategory(measurement.bmi);
                  return (
                    <div key={measurement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">BMI: {measurement.bmi.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">
                          {measurement.weight}kg • {measurement.height}cm
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={category.color}>{category.category}</Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(measurement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No measurements recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* BMI Chart Placeholder */}
      {bodyMeasurements.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>BMI Trend</CardTitle>
            <CardDescription>Your BMI progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">BMI trend chart will be displayed in the Reports section</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}