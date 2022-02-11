import React, { useContext, useState } from "react";
import { VideoConnectionContext } from "../../connection/videoConnectionContext";

const InputKeySection: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const { callCollocutor } = useContext(VideoConnectionContext);

  return (
    <div className='py-2'>
      <p className="mb-1">Сюда нужно ввести ключ, который Вам передал собеседник:</p>
    
      <div className='flex w-full'>
        <input className="
            bg-slate-700 rounded-l-lg
            p-3 
            grow
          "
          type="text"
          id="callInput"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />

        <button
          className="
            bg-violet-700 hover:bg-violet-800 transition-colors duration-200
            p-3 rounded-r-lg 
            grow-0 w-32
          "
          onClick={() => callCollocutor(inputValue)}
        >
          Звонок
        </button>
      </div>
    </div>
  )
}

export default InputKeySection;