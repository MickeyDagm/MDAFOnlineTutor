import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-secondary-50 py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;