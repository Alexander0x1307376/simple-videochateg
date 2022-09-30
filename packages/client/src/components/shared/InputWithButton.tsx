import React from 'react';
import EndButton, { ButtonStyle } from './EndButton';


export interface InputWithButtonProps {
  value?: string;
  onChange?: (value: string) => void;
  isInputAvaliable?: boolean;
  onButtonClick?: () => void;
  buttonContent: React.ReactNode;
  buttonStyle?: ButtonStyle;
  inputName?: string;
  inputId?: string;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  value, onChange, isInputAvaliable, 
  onButtonClick, buttonContent, inputId, inputName, buttonStyle = 'default'
}) => {

  return (
    <div className='flex w-full'>
      <input className="bg-slate-700 rounded-l-lg p-3 grow outline-none"
        type="text"
        id={inputId}
        value={value}
        name={inputName}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={!isInputAvaliable}
      />
      <EndButton
        buttonType={buttonStyle}
        onClick={onButtonClick}
      >
        {buttonContent}
      </EndButton>
    </div>
  );
}

export default InputWithButton;