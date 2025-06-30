'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/server/common';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
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
    
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        const data = await loginUser({
          email: formData.email,
          password: formData.password
        });
        
        // Store token, userId and redirect
        localStorage.setItem('token', data.token);
        
        localStorage.setItem('userId', data.user.id);
        toast.success('Login successful!');
        router.push('/');
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Authentication failed';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    toast.info('Password recovery feature coming soon!');
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 sm:p-8 md:p-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2">
          Welcome Back
        </h2>
        <p className="text-blue-100 text-xs sm:text-sm md:text-base">
          Please sign in to your account
        </p>
      </div>

      {/* Form Container */}
      <div className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-end" style={{ margin: '0' }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 text-xs sm:text-sm hover:text-blue-600 hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 active:transform active:translate-y-0"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Switch Form */}
        <div className="text-center text-gray-600 text-xs sm:text-sm mt-2">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors duration-200 focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
