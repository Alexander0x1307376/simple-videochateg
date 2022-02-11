import React from 'react';
import { IconType } from 'react-icons';


type ButtonStyleType = 'default' | 'danger' | 'success';
type ButtonSize = 'default' | 'big';

export interface CircleButtonProps {
  icon: IconType;
  type?: ButtonStyleType;
  size?: ButtonSize;
  onClick?: VoidFunction;
}

const CircleButton: React.FC<CircleButtonProps> = ({ 
  icon: Icon, onClick, type = 'default', size = 'default'
}) => {

  const basicClasses = `
    flex justify-around items-center transition duration-200 rounded-full p-2
  `;

  const sizeClasses: Record<ButtonSize, {classes: string, iconSize: string | number}> = {
    default: {classes:' p-2', iconSize: '1.7rem'},
    big: { classes: ' p-4', iconSize: '2.4rem' }
  }

  const styleClasses: Record<ButtonStyleType, string> = {
    default: basicClasses + sizeClasses[size] + ' bg-violet-700 hover:bg-violet-800',
    danger: basicClasses + sizeClasses[size] + ' bg-red-400 hover:bg-red-600',
    success: basicClasses + sizeClasses[size] + ' bg-lime-400 hover:bg-lime-600'
  }

  return (
    <button 
      onClick={onClick}
      className={styleClasses[type]}
    >
      <Icon size={sizeClasses[size].iconSize} />
    </button>

  )
}

export default CircleButton;