import React from 'react';

export interface InputTextProps {
  placeholder?: string;
  value: string;
  name?: string;
  onChange: (value: string) => void;
}

const InputText: React.FC<InputTextProps> = ({
  placeholder, value, onChange, name
}) => {
  return (
    <input
      value={value}
      name={name}
      onChange={e => onChange(e.target.value)}
      type="text"
      className="outline-none py-2 w-full bg-transparent border-b-2"
      placeholder={placeholder}
    />
  );
}

export default InputText