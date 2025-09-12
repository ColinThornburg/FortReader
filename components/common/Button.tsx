
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'large';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'normal', ...props }) => {
  const baseClasses = 'font-display tracking-wider rounded-lg font-bold transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 hover:from-yellow-300 hover:to-orange-400 focus:ring-yellow-400 disabled:from-gray-500 disabled:to-gray-600 disabled:text-gray-300',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-purple-500 disabled:bg-slate-800 disabled:text-slate-500',
  };

  const sizeClasses = {
      normal: 'px-6 py-2 text-lg',
      large: 'px-10 py-4 text-2xl',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
