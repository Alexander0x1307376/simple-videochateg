import React, { useContext } from "react";
import { MdPhoneDisabled } from "react-icons/md";
import { VideoConnectionContext } from "../../../connection/videoConnectionContext";
import CircleButton from "../CircleButton";

const EstablishingConnectionScreen: React.FC = () => {

  const { cancelCall } = useContext(VideoConnectionContext);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow flex justify-center items-center">
        <h1 className="text-center" >Установка пирингового соединения c собеседником...</h1>
      </div>
      <div className="py-4 flex justify-center">
        <CircleButton
          type='danger'
          size='big'
          icon={MdPhoneDisabled}
          onClick={cancelCall}
        />
      </div>
    </div>
  )
}

export default EstablishingConnectionScreen;