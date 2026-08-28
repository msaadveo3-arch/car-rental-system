import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-base-content/70">{label}</label>}
      <input {...rest} className="input input-bordered w-full" />
    </div>
  );
};

export default Input;
