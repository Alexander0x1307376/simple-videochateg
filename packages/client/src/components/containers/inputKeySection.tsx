import React, { useContext, useState } from "react";
import { MdOutlinePhone, MdOutlinePhoneDisabled } from "react-icons/md";
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";
import { ButtonStyle } from "../shared/EndButton";
import InputWithButton from "../shared/InputWithButton";

const InputKeySection: React.FC = () => {

  const [inputValue, setInputValue] = useState<string>('');
  const { callCollocutor, callStatus, cancelCall } = useContext(VideoConnectionContext);
  
  const isInputAvaliable = !(
    callStatus === CallStatus.INCOMING_CALL ||
    callStatus === CallStatus.OUTCOMING_CALL
  );

  const buttonStyle: ButtonStyle = (() => {
    if (callStatus === CallStatus.OUTCOMING_CALL) return 'danger';
    if (!(isInputAvaliable && !!inputValue)) return 'disabled';
    return 'success';
  })();

  const buttonContent = (
    <div className="flex items-center space-x-2">
      {
        callStatus === CallStatus.OUTCOMING_CALL
        ? (<>
            <MdOutlinePhoneDisabled size={'1.5rem'} />
            <span>Отмена</span>
          </>)
        : (<>
            <MdOutlinePhone size={'1.5rem'} />
            <span>Звонок</span>
          </>
        )
      }
    </div>
  );

  

  return (
    <div className="py-2">
      <p className="mb-1">Сюда нужно ввести ключ, который Вам передал собеседник:</p>
      <InputWithButton 
        inputId="callInput"
        buttonContent={buttonContent}
        buttonStyle={buttonStyle}
        value={inputValue}
        onChange={setInputValue}
        isInputAvaliable={isInputAvaliable}
        onButtonClick={() => {
          if (callStatus === CallStatus.OUTCOMING_CALL) 
            cancelCall();
          else if (isInputAvaliable && inputValue) 
            callCollocutor(inputValue);
        }}
      />
    </div>
  )
}

export default InputKeySection;