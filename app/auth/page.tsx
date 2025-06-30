'use client';

import LoginSignup from '@/components/LoginSignup'
import { useAuthRedirect } from '@/hooks/useAuth';

const AuthPage = () => {
  // Redirect to dashboard if already logged in
  useAuthRedirect();
  
  return <LoginSignup />;
}

export default AuthPage