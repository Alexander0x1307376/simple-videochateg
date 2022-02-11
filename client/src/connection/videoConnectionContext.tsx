import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { serverUrl } from "../constants/server";
import useHookWithRefCallback from "../utils/useHookWithRefCallback";


export interface VideoConnectionContextProps {
  thisSocketId: string;
  thisVideo: React.ClassAttributes<HTMLVideoElement>['ref'];
  stream: any;
  collocutorVideo: React.ClassAttributes<HTMLVideoElement>['ref'];
  call: any;
  callStatus: CallStatus;
  callCollocutor: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  declineCall: () => void;
}

export const VideoConnectionContext = createContext<VideoConnectionContextProps>({} as VideoConnectionContextProps);

const socket = io(serverUrl);

export enum CallStatus { 
  init = "init", 
  collocutorIsCalling = "collocutorIsCalling", 
  thisUserIsCalling = "thisUserIsCalling",
  accepted = "accepted", 
  declined = "declined", 
  ended = "ended"
}

export const VideoConnectionProvider = ({ children }: { children: React.ReactElement }) => {

  const [thisSocketId, setThisSocketId] = useState<string>('');

  // наше видео
  const thisVideo = useRef<any>(); // html элемент video, где будет наша рожа
  const [stream, setStream] = useState<MediaStream>(); // стрим с наших вебки и микрофона
  
  const collocutorVideo = useRef<any>(); // html элемент video с рожей собеседника

  // пиринговое соединение
  const peerConnection = useRef<any>();

  // информация о текущем вызове
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.init);
  const [call, setCall] = useState<any>({}); // данные вызова



  useEffect(() => {
    // получаем аудио и видеосигнал
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      setStream(stream);
      thisVideo.current.srcObject = stream;
    });

    // при событии socketId записываем свой id сокета
    socket.on('socketId', (id) => { setThisSocketId(id); });

    // как нам звонят -  записываем информацию вызова
    socket.on('callUser', ({from, signal}) => {
      
      setCallStatus(CallStatus.collocutorIsCalling);
      console.log('Нам звонят!', from);

      setCall({
        isReceivingCall: true,
        from,
        signal
      });
    });

    socket.on('callDeclined', () => {
      console.log('Вызов отклонён!');
      setCallStatus(CallStatus.declined);
    });

    socket.on('callEnded', () => {
      console.log('Вызов завершён!');
      setCallStatus(CallStatus.ended);
    });

    socket.on('clientDisconnected', () => {
      setCallStatus(CallStatus.ended);
    });

  }, [thisVideo]);


  // Отвечаем на звонок
  const answerCall = () => {
    setCallStatus(CallStatus.accepted);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', (currentStream) => {
      collocutorVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    peerConnection.current = peer;

  }

  // Звоним второму юзеру
  const callCollocutor = (id: string) => {
    setCallStatus(CallStatus.thisUserIsCalling);
    
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        collocutorId: id, // id сокета пользователя, которому звоним
        signalData: data, // сигнальные данные пира
        from: thisSocketId // наш сокет, чтоб юзер знал кто звонит
      });
    });

    peer.on('stream', (currentStream) => {
      collocutorVideo.current.srcObject = currentStream;
    });

    // когда пользователь отвечает
    socket.on('callAccepted', (signal) => {
      setCallStatus(CallStatus.accepted);
      peer.signal(signal); // сигналим о соединении?!
    })
  }


  // отклоняем звонок
  const declineCall = () => {
    setCallStatus(CallStatus.ended);
    socket.emit('declineCall', { to: call.from });
  }

  // завершаем звонок
  const leaveCall = () => {
    console.log('завершаем звонок')
    setCallStatus(CallStatus.ended);
    socket.emit('leaveCall', { to: call.from });
    if (peerConnection.current)
      peerConnection.current.destroy();
    setCall({});
  }


  return (
    <VideoConnectionContext.Provider value={{
      thisSocketId,
      thisVideo,
      stream,

      collocutorVideo,
      
      call,
      callStatus,
      
      callCollocutor,
      answerCall,
      leaveCall,
      declineCall
    }}>
      {children}
    </VideoConnectionContext.Provider>
  )
}