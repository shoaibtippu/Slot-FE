import React from 'react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-xs sm:text-sm text-gray-600">
        Enter your details to manage your grounds.
      </p>
    </div>
  );
};
