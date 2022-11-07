import React, { useContext } from "react";
import { MdCallEnd } from "react-icons/md";
import { VideoConnectionContext } from "../../connection/videoConnectionContext";
import CircleButton from "./CircleButton";

const OutcomingCallScreen: React.FC = () => {

  const { cancelCall } = useContext(VideoConnectionContext);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex justify-center items-center grow">
        <div className="pl-3 text-lg">
          Звоним собеседнику. Ожидание ответа...
        </div>
      </div>
      <div className="flex justify-center pt-4 pb-8 space-x-16">
        <CircleButton icon={MdCallEnd} type='danger' size="big" onClick={cancelCall} />
      </div>
    </div> 
  )
}

export default OutcomingCallScreen;