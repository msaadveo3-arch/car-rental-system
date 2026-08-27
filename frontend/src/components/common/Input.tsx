import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input: React.FC<InputProps> = ({ label, error, className = '', ...rest }) => {
  return (
    <div className="form-control w-full">
      {label && <label className="label"><span className="label-text">{label}</span></label>}
      <input 
        {...rest} 
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`} 
      />
      {error && <label className="label"><span className="label-text-alt text-error">{error}</span></label>}
    </div>
  );
};

export default Input;
