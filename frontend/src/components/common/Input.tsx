import React, { useId } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input: React.FC<InputProps> = ({ label, className = '', id, required, ...rest }) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="app-label">{label}{required && <span className="ml-1 text-error" aria-hidden>*</span>}</label>}
      <input {...rest} id={inputId} required={required} className={`input input-bordered w-full bg-base-100 ${className}`} />
    </div>
  );
};

export default Input;
