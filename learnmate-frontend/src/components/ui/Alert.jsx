
import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Alert = ({ 
  variant = 'info',
  title,
  children,
  onClose,
  className 
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900 dark:text-blue-400',
      textColor: 'text-blue-800 dark:text-blue-300'
    },
    success: {
      container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-300'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900 dark:text-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-300'
    },
    error: {
      container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900 dark:text-red-400',
      textColor: 'text-red-800 dark:text-red-300'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      'border rounded-lg p-4',
      config.container,
      className
    )}>
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <div className={cn('text-sm', config.textColor)}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn('p-1 rounded hover:bg-black/5 transition-colors', config.iconColor)}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;