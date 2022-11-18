import React, { useContext } from "react";
import { MdCall, MdCallEnd } from "react-icons/md";
import { VideoConnectionContext } from "../../../connection/videoConnectionContext";
import CircleButton from "../CircleButton";


const IncomingCallScreen: React.FC = () => {  

  const { answerCall, declineCall } = useContext(VideoConnectionContext);

  return (
      <div className="w-full h-full flex flex-col justify-center">
        <div className="flex justify-center items-center grow">
          <div className="flex justify-center items-center">
            <span className='animate-ping absolute rounded-full p-8 bg-violet-500'></span>
            <span className='relative rounded-full p-3'><MdCallEnd size={50} /></span>
          </div>
          <div className="pl-3 text-lg">
            Вам звонят
          </div>
        </div>
        <div className="flex justify-center pt-4 pb-8 space-x-16">
          <CircleButton icon={MdCall} type='success' size="big" onClick={answerCall} />
          <CircleButton icon={MdCallEnd} type='danger' size="big" onClick={declineCall} />
        </div>
      </div>   
  )
}

export default IncomingCallScreen;