import React, { useContext } from "react";
import { MdCall, MdPhone, MdPhoneDisabled, MdPhoneEnabled } from "react-icons/md";
import { CallStatus, VideoConnectionContext } from "../../connection/videoConnectionContext";
import CircleButton from "./circleButton";


export interface VideoSectionProps {
  isCollocutorMainView?: any;
}


// #region Классы
const converSationClasses = {
  mainElement: "h-full w-full",
  thisVideo: "h-full w-full rounded-lg overflow-hidden",
  collocutorVideo: "h-[6rem] w-auto absolute right-2 bottom-2 z-10 rounded overflow-hidden bg-slate-500",
  callMessage: "hidden",
  callButtons: "hidden",
  idleMessage: "hidden"
};

const converSationClassesThisViewIsMain = {
  mainElement: "h-full w-full",
  thisVideo: "h-[6rem] w-auto absolute right-2 bottom-2 z-10 rounded overflow-hidden bg-slate-500",
  collocutorVideo: "h-full w-full rounded-lg overflow-hidden",
  callMessage: "hidden",
  callButtons: "hidden",
  idleMessage: "hidden"
};

const idleClasses = {
  mainElement: "h-full w-full flex flex-col items-center",
  thisVideo: "h-3/4 rounded-lg overflow-hidden",
  collocutorVideo: "hidden",
  callMessage: "hidden",
  callButtons: "hidden",
  idleMessage: "py-3 select-none"
};

const collocutorIsCallingClasses = {
  mainElement: "h-full w-full flex flex-col justify-center items-center",
  thisVideo: "hidden",
  collocutorVideo: "hidden",
  callMessage: "flex items-center grow",
  callButtons: "flex py-4 grow-0",
  idleMessage: "hidden"
};

const thisUserIsCallingClasses = {
  mainElement: "h-full w-full flex flex-col items-center",
  thisVideo: "h-3/4 rounded-lg overflow-hidden",
  collocutorVideo: "hidden",
  callMessage: "hidden",
  callButtons: "hidden",
  idleMessage: "py-3 select-none"
}
// #endregion

const VideoSection: React.FC<VideoSectionProps> = ({isCollocutorMainView}) => {


  const {
    thisVideo,
    collocutorVideo,
    callStatus,
    answerCall,
    declineCall,
    stream,
  } = useContext(VideoConnectionContext);

  const currentClasses = (() => {
    switch(callStatus) {

      case CallStatus.ended:
        return idleClasses;
      
      case CallStatus.collocutorIsCalling:
        return collocutorIsCallingClasses;
      
      case CallStatus.accepted:
        return isCollocutorMainView 
          ? converSationClasses 
          : converSationClassesThisViewIsMain;
      
      case CallStatus.thisUserIsCalling:
        return thisUserIsCallingClasses;
      
      default:
        return idleClasses;
    }
  })();

  return (
    <div className="h-[20rem] w-full bg-slate-700 rounded-lg relative">

      <div className={currentClasses.mainElement}>

        {/* Сообщение при отключенном собеседнке */}
        <div className={currentClasses.idleMessage}>
          {(() => {
            switch(callStatus) {
              case CallStatus.thisUserIsCalling:
                return 'Звоним собеседнику...';
              case CallStatus.ended:
                return 'Вызов завершен. Можно начать новый';
              case CallStatus.declined:
                return 'Вызов отклонён';
              default:
                return 'Ожидание собеседника';
            }
          })()}
        </div>

        {/* Наша морда */}
        <div className={currentClasses.thisVideo}>
          { stream 
          ? <video 
            className={"h-full w-full"} 
            playsInline 
            muted 
            ref={thisVideo} 
            autoPlay 
          />
          : <div className="h-full w-full">Здесь будет ваше видео</div>}
        </div>
        
        {/* Морда собеседника */}
        {
          callStatus === CallStatus.accepted &&
          <div className={currentClasses.collocutorVideo}>
            <video
              className={"h-full w-full"}
              playsInline
              ref={collocutorVideo}
              autoPlay
            />
          </div>
        }

        {/* Сообщение вызова */}
        <div className={currentClasses.callMessage}>
          <div className="relative">
            <div className="flex h-14 w-14">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative flex rounded-full h-14 w-14 justify-center items-center">
                <MdPhone size={'3rem'}/>
              </span>
            </div>
          </div>
          <span className="pl-4">Вам звонят</span>
        </div>

        {/* Кнопы принять/отклонить вызов */}
        <div className={currentClasses.callButtons}>
          <div className="pr-4">
            <CircleButton icon={MdPhone} type="success" size="big" onClick={answerCall}/>
          </div>
          <div className="pl-4">
            <CircleButton icon={MdPhoneDisabled} type="danger" size="big" onClick={declineCall} />
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default VideoSection;