'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '@/server/common';

interface SignupFormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (!formData.name?.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        await registerUser({
          email: formData.email,
          password: formData.password,
          username: formData.name,
          weight: 0,
          height: 0,
          bmi: 0
        });
        
        toast.success('Account created! Please login.');
        onSwitchToLogin();
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 sm:p-8 md:p-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2">
          Create Account
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm md:text-base">
          Join us today and get started
        </p>
      </div>

      {/* Form Container */}
      <div className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name Field */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 active:transform active:translate-y-0"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Switch Form */}
        <div className="text-center text-gray-600 text-xs sm:text-sm mt-2">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors duration-200 focus:outline-none"
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
