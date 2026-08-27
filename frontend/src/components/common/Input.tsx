import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input {...rest} className="px-3 py-2 border rounded-md" />
    </div>
  );
};

export default Input;
