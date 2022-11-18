import React from 'react';

export interface InputTextProps {
  placeholder?: string;
  value: string;
  name?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
  placeholder, value, onChange, name, disabled
}) => {
  return (
    <input
      value={value}
      name={name}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      type="text"
      className="outline-none py-2 w-full bg-transparent border-b-2"
      placeholder={placeholder}
    />
  );
}

export default InputText