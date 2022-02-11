import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoConnectionContext } from "../../connection/videoConnectionContext";
import VideochatLayout from "../containers/mainLayout";

const JoinConversation: React.FC = () => {

  const { idToConnect } = useParams<any>();

  const { callCollocutor, thisSocketId } = useContext(VideoConnectionContext);

  useEffect(() => {

    console.log('joinConversation page!!!');

    if (thisSocketId) {
      console.log('Звонок со страницы');
      callCollocutor(idToConnect as string);
    }

  }, [thisSocketId]);

  return (
    <VideochatLayout 
      title={"Присоединиться к разговору: " + idToConnect} 
    />
  )
}

export default JoinConversation;