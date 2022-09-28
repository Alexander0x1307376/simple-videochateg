import React, { useContext, useState } from "react";
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";

const InputKeySection: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const { callCollocutor, callStatus } = useContext(VideoConnectionContext);

  const isInputAvaliable = 
    callStatus === CallStatus.init ||
    callStatus === CallStatus.ended ||
    callStatus === CallStatus.declined;

  const buttonStyle = {
    default: "bg-violet-700 hover:bg-violet-800 transition-colors duration-200 p-3 rounded-r-lg grow-0 w-32",
    disabled: "bg-slate-400 cursor-not-allowed p-3 rounded-r-lg grow-0 w-32"
  };

  return (
    <div className='py-2'>
      <p className="mb-1">Сюда нужно ввести ключ, который Вам передал собеседник:</p>
      <div className='flex w-full'>
        <input className="bg-slate-700 rounded-l-lg p-3 grow outline-none"
          type="text"
          id="callInput"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={!isInputAvaliable}
        />

        <button 
          className={isInputAvaliable ? buttonStyle.default : buttonStyle.disabled}
          onClick={() => {
            if (isInputAvaliable) callCollocutor(inputValue)
          }}
        >
          Звонок
        </button>
      </div>
    </div>
  )
}

export default InputKeySection;