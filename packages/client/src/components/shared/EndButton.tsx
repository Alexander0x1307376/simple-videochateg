import React from "react";


export type ButtonStyle = 'default' | 'disabled' | 'danger' | 'success'

export interface EndButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  buttonType?: ButtonStyle;
}

const buttonStyles: Record<ButtonStyle, string> = {
  default: "bg-violet-700 hover:bg-violet-800 transition-colors duration-200 p-3 rounded-r-lg grow-0 w-40",
  disabled: "bg-slate-400 cursor-not-allowed transition-colors duration-200 p-3 rounded-r-lg grow-0 w-40",
  danger: "bg-red-500 hover:bg-red-600 transition-colors duration-200 p-3 rounded-r-lg grow-0 w-40",
  success: "bg-green-500 hover:bg-green-600 transition-colors duration-200 p-3 rounded-r-lg grow-0 w-40"
};

const EndButton: React.FC<EndButtonProps> = ({
  children, onClick, buttonType = "default"
}) => {

  return (
    <button
      className={buttonStyles[buttonType]}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default EndButton;