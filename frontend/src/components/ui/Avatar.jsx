import React, { useState } from 'react';
import { cn } from '../../lib/util.js';

const Avatar = ({
  className,
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status = 'none',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-secondary-300',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    none: 'hidden',
  };

  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary-200",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary-200 text-secondary-600">
            {fallback || alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status !== 'none' && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusClasses[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
