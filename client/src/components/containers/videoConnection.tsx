import React, { useState } from "react";
import { MdOutlineHeadset, MdOutlineKeyboardVoice, MdOutlinePhoneDisabled, MdOutlinePictureInPictureAlt, MdOutlineSettingsOverscan } from 'react-icons/md';
import CircleButton from "../shared/circleButton";

const VideoConnection: React.FC = () => {

  const [isCollocutorMainView, setIsCollocutorMainView] = useState<boolean>(true);


  const mainViewClasses = 'transition-all duration-200 w-[30rem] h-[18rem] rounded-lg bg-slate-600 absolute drop-shadow-xl';
  const secondaryViewClasses = 'transition-all duration-200 w-[10rem] h-[6rem] rounded-lg bg-slate-800 absolute z-10 bottom-2 right-2 drop-shadow-xl';
  
  return (
    <div className='mt-2 border-b'>
      <div className='w-full flex justify-center'>
        <div className='w-[30rem] h-[18rem] relative'>
          <div 
            className={isCollocutorMainView ? mainViewClasses : secondaryViewClasses}
          >
            Собеседник
          </div>
          <div 
            className={!isCollocutorMainView ? mainViewClasses : secondaryViewClasses}
          >
            Ты
          </div>
        </div>
      </div>
      <div className='flex justify-center py-2'>
        <div className='px-1'>
          <CircleButton 
            icon={MdOutlinePictureInPictureAlt} 
            onClick={() => setIsCollocutorMainView(prev => !prev)}
          />
        </div>
        <div className='px-1'>
          <CircleButton icon={MdOutlineSettingsOverscan} />
        </div>
        <div className='pl-3 pr-1 ml-2 border-l'>
          <CircleButton icon={MdOutlineKeyboardVoice} />
        </div>
        <div className='px-1'>
          <CircleButton icon={MdOutlinePhoneDisabled} />
        </div>

      </div>
    </div>
  )
}

export default VideoConnection;