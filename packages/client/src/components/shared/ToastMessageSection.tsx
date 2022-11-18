import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { nanoid } from 'nanoid';

export interface ToastMessageSectionProps {
  list: {
    key: string; 
    message: string;
  }[];

  onClose: (key: string) => void;
}

const ToastMessageSection: React.FC<ToastMessageSectionProps> = ({ list: propMessages, onClose }) => {

  return (
    <div className="absolute bottom-0 left-0 right-0 flex flex-col">
      {
        propMessages.map((item) => (
          <div key={item.key} className="flex p-2 items-start bg-red-500 mb-[1px] space-x-1">
            <span className="grow">{item.message}</span>
            <button 
              className="block"
              onClick={() => onClose(item.key)}
            >
              <IoCloseOutline size='1.5rem' />
            </button>
          </div>
        ))
      }
    </div>
  );
}

export default ToastMessageSection;