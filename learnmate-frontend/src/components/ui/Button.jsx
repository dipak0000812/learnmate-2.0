import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 focus:ring-teal-500 shadow-md hover:shadow-lg',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-500',
      outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 focus:ring-teal-500',
      ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
      gradient: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 focus:ring-teal-500 shadow-md hover:shadow-lg',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;