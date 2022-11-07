import React from 'react';

export type ButtonStyle = 'default' | 'disabled' | 'danger' | 'success'

export interface EndButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  buttonType?: ButtonStyle;
}

const buttonStyles: Record<ButtonStyle, string> = {
  default: "bg-violet-700 hover:bg-violet-800 transition-colors duration-200 w-44",
  disabled: "bg-slate-400 cursor-not-allowed transition-colors duration-200 w-44",
  danger: "bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded-r-lg w-44",
  success: "bg-green-500 hover:bg-green-600 transition-colors duration-200 rounded-r-lg w-44"
};


const Button: React.FC<EndButtonProps> = ({
  children, onClick, buttonType = 'default'
}) => {
  return (
    <button onClick={onClick} className={buttonStyles[buttonType]}>{children}</button>
  )
}

export default Button;