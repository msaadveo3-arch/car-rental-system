import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none';
  const variantClass = variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-transparent';
  return (
    <button {...rest} className={`${base} ${variantClass} ${className}`}> 
      {children}
    </button>
  );
};

export default Button;
