import React, { useContext, useState, useEffect, useCallback } from "react";
import Button from "../shared/Button";
import IncomingCallScreen from "../shared/Screens/IncomingCallScreen";
import Header from "../shared/Header";
import InputText from "../shared/InputText";
import StartCallScreen from "../shared/Screens/StartCallScreen";
import OutcomingCallScreen from "../shared/Screens/OutcomingCallScreen";
import { AnimatePresence, motion } from "framer-motion";
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";
import ToastMessageSection, { ToastMessageSectionProps } from "../shared/ToastMessageSection";
import { nanoid } from "nanoid";
import { CallResponses } from "@simple-videochateg/shared";
import VideoSection from "../shared/Screens/VideoSection";
import EstablishingConnectionScreen from "../shared/Screens/EstablishingConnectionScreen";


export interface VideochatProps {
  title: string;
}


const Videochat: React.FC<VideochatProps> = ({title}) => {

  const {callCollocutor, callStatus, preCallResponse } = useContext(VideoConnectionContext);



  const [callKey, setCallKey] = useState<string>('');
  const handleCallCollocutor = () => {
    if(callKey)
      callCollocutor(callKey);
  }


  
  const [infoMessages, setInfoMessages] = useState<ToastMessageSectionProps['list']>([]);

  const handleDeleteMessage = (key: string) => {
    
    setInfoMessages(prevInfoMessages => {
      const updatedArray = [...prevInfoMessages];
      const itemIndex = updatedArray.findIndex(item => item.key === key);
      updatedArray.splice(itemIndex, 1);
      return updatedArray;
    });
  }

  const addMessage = (message: string) => {
    const newMessageItem = { message, key: nanoid() };
    setInfoMessages(prevInfoMessages => [...prevInfoMessages, newMessageItem]);
  }

  useEffect(() => {
    let interval: any;
    if (infoMessages.length) {
      interval = setInterval(() => {
        handleDeleteMessage(infoMessages[0].key);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    }
  }, [infoMessages]);

  useEffect(() => {
    if (!preCallResponse?.status) return;

    switch (preCallResponse?.status) {
      case (CallResponses.COLLOCUTOR_NOT_FOUND):
        addMessage('Пользователь не найден');
      break;
      case (CallResponses.CALL_SELF):
        addMessage('Звонок самому себе невозможен');
      break;
      case (CallResponses.OTHER_CALL_IN_PROGRESS):
        addMessage('Абонент занят');
      break;
      case (CallResponses.CALL_ENDED):
        addMessage('Вызов равершен');
      break;
      case (CallResponses.CALL_DECLINED):
        addMessage('Вызов отклонён');
      break;
      case (CallResponses.CALL_CANCELED):
        addMessage('Вызов отменён');
      break;
      case (CallResponses.OK):
      break;
      default:
        addMessage('Вызов невозможен');
      break;
    }
  }, [preCallResponse]);


  return (
    <div>
      <div className="pb-2">
        <Header title={title} />
      </div>
      <div>
        <div className="group relative h-96 w-full bg-slate-800">
          {(() => {
            switch (callStatus) {
              case(CallStatus.OUTCOMING_CALL): 
                return <OutcomingCallScreen />;
              case(CallStatus.INCOMING_CALL):
                return <IncomingCallScreen />;
              case(CallStatus.CONNECTION_IN_PROGRESS):
                return <VideoSection />;
              case(CallStatus.ESTABLISHING_PEER_CONNECTION):
                return <EstablishingConnectionScreen />
              default: 
                return <StartCallScreen />;
            }
          })()}
          <ToastMessageSection list={infoMessages} onClose={handleDeleteMessage} />

        </div>
        <div>
          <div className="w-full">
            <AnimatePresence>
              <motion.div
                className="flex items my-2 space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .02 }}
              >
                <InputText 
                  disabled={callStatus !== CallStatus.IDLE}
                  value={callKey}
                  onChange={setCallKey}
                  placeholder={"Введите ключ собеседника"}
                />
                <Button 
                  onClick={handleCallCollocutor} 
                  buttonType={callKey? "default" : "disabled"}
                >Звонок</Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Videochat;