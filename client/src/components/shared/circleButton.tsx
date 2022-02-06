import React from 'react';
import { IconType } from 'react-icons';

export interface CircleButtonProps {
  icon: IconType;
  onClick?: VoidFunction;
}

const CircleButton: React.FC<CircleButtonProps> = ({icon: Icon, onClick}) => {
  return (
    <button 
      onClick={onClick}
      className="
        flex justify-around items-center
        w-10 h-10 rounded-full 
        bg-red-400 hover:bg-red-600
        transition duration-200
      "
    >
      <Icon size={24} />
    </button>

  )
}

export default CircleButton;