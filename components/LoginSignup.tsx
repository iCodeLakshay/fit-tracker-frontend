'use client';

import React, { useState } from 'react';
import Login from './auth/Login';
import Signup from './auth/Signup';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  const switchToSignup = () => {
    setIsLogin(false);
  };
  
  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-300 hover:shadow-2xl">
        {isLogin ? (
          <Login onSwitchToSignup={switchToSignup} />
        ) : (
          <Signup onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;