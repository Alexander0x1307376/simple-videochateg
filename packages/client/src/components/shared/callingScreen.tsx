import React from "react";
import { MdCall, MdCallEnd } from "react-icons/md";
import CircleButton from "./circleButton";



export interface CallingScreen {
  incomingCall?: boolean;
  acceptCall?: VoidFunction;
  declineCall?: VoidFunction;
}

const CallingScreen: React.FC<CallingScreen> = ({ 
  incomingCall, acceptCall, declineCall
}) => {  

  return (
      <div className="w-full h-full flex flex-col justify-center">
        <div className="flex justify-center items-center grow">
          <div className="flex justify-center items-center">
            <span className='animate-ping absolute rounded-full p-8 bg-violet-500'></span>
            <span className='relative rounded-full p-3'><MdCallEnd size={50} /></span>
          </div>
          <div className=" pl-3">
            {incomingCall ? 'Вам звонят' : 'Ожидание ответа'}
          </div>
        </div>
        {incomingCall &&
        <div className="flex justify-center pt-4 pb-8">
          <div className="px-8">
            <CircleButton icon={MdCall} type='success' size="big" onClick={acceptCall} />
          </div>
          <div className="px-8">
            <CircleButton icon={MdCallEnd} type='danger' size="big" onClick={declineCall} />
          </div>
        </div>}
      </div>   
  )
}

export default CallingScreen;