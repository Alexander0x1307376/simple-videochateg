import React, { useContext, useState } from "react";
import { MdMic, MdMicOff, MdOutlinePhoneDisabled, MdOutlinePictureInPictureAlt } from 'react-icons/md';
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";
import CircleButton from "../shared/circleButton";
import VideoSection from "../shared/videoSection";

// Началное состояние - Ожидание вызова (пустой экран)
// Собеседник звонит (экран с соответствующим сообщением)
// Разговор (морда собеседника и текущего юзера)
// Звонок (сообщение о звонке собеседнику)

const VideoConnection: React.FC = () => {

  const [isCollocutorMainView, setIsCollocutorMainView] = useState<boolean>(true);

  const {
    leaveCall,
    callStatus,
    toggleMicrophone,
    isMicrophoneEnabled
  } = useContext(VideoConnectionContext);


  return (
    <div>
      <div>
        <VideoSection isCollocutorMainView={isCollocutorMainView} />
      </div>
      <div className='flex justify-center py-2'>
        {/* Переключение видов */}
        {
          callStatus === CallStatus.accepted &&
          <div className='px-1'>
            <CircleButton 
              icon={MdOutlinePictureInPictureAlt} 
              onClick={() => setIsCollocutorMainView(prev => !prev)}
            />
          </div>
        }
        {/* Мут микрофона */}
        <div className='px-1'>
          <CircleButton
            icon={isMicrophoneEnabled ? MdMic : MdMicOff}
            onClick={toggleMicrophone}
          />
        </div>
        
        {/* Положить трубу */}
        {
          callStatus === CallStatus.accepted &&
          <div className='px-1'>
            <CircleButton
              icon={MdOutlinePhoneDisabled}
                onClick={leaveCall}
            />
          </div>
        }
        

      </div>
    </div>
  )
}

export default VideoConnection;