import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

const Avatar = ({ 
  src, 
  alt = 'Avatar',
  name,
  size = 'default',
  className,
  fallbackColor = 'from-blue-600 to-purple-600'
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    default: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-20 h-20 text-3xl'
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0',
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : name ? (
        <div className={`w-full h-full bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-white font-semibold`}>
          {getInitials(name)}
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Avatar;