import React, { useContext, useState } from "react";
import Button from "../shared/Button";
import IncomingCallScreen from "../shared/IncomingCallScreen";
import Header from "../shared/Header";
import InputText from "../shared/InputText";
import StartCallScreen from "../shared/StartCallScreen";
import VideoSection from "../shared/VideoSection";
import OutcomingCallScreen from "../shared/OutcomingCallScreen";
import { AnimatePresence, motion } from "framer-motion";
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";

export interface VideochatProps {
  title: string;
}


const Videochat: React.FC<VideochatProps> = ({title}) => {

  const {callStatus, callCollocutor, ourStream, collocutorStream} = useContext(VideoConnectionContext);

  const [callKey, setCallKey] = useState<string>('');
  const handleCallCollocutor = () => {
    if (callKey)
      callCollocutor(callKey);
  }


  return (
    <div>
      <div className="pb-2">
        <Header title={title} />
      </div>
      <div>
        <div 
          className="group relative h-96 w-full bg-slate-800"
        >
          {(() => {
            if (callStatus === CallStatus.CALL_ACCEPTED) 
              return <VideoSection />

            else if (callStatus === CallStatus.INCOMING_CALL)
              return <IncomingCallScreen />

            else if (callStatus === CallStatus.OUTCOMING_CALL)
              return <OutcomingCallScreen />

            else 
              return <StartCallScreen />
          })()}
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