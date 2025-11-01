import React from 'react';
import { cn } from '../../utils/cn';

const Spinner = ({ size = 'default', className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'border-blue-600 border-t-transparent rounded-full animate-spin',
          sizes[size],
          className
        )}
      />
    </div>
  );
};

export default Spinner;