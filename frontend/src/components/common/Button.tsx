import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'error' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  className = '', 
  disabled,
  ...rest 
}) => {
  const base = 'btn inline-flex items-center justify-center rounded-md font-medium focus:outline-none';
  
  const variantClass = 
    variant === 'primary' ? 'btn-primary' : 
    variant === 'secondary' ? 'btn-secondary' : 
    variant === 'ghost' ? 'btn-ghost' : 
    variant === 'outline' ? 'btn-outline' :
    variant === 'error' ? 'btn-error' :
    variant === 'success' ? 'btn-success' :
    variant === 'warning' ? 'btn-warning' :
    variant === 'info' ? 'btn-info' :
    'btn-primary';
  
  const sizeClass = 
    size === 'xs' ? 'btn-xs' : 
    size === 'sm' ? 'btn-sm' : 
    size === 'lg' ? 'btn-lg' : 
    size === 'xl' ? 'btn-xl' : 
    'btn-md';
  
  return (
    <button 
      {...rest} 
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
    > 
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );
};

export default Button;
