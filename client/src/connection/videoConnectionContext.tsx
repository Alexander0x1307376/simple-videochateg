import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { serverUrl } from "../constants/server";


export interface VideoConnectionContext {
  thisSocketId: string,
  thisVideo: React.ClassAttributes<HTMLVideoElement>['ref'],
  stream: any,
  collocutorVideo: React.ClassAttributes<HTMLVideoElement>['ref'],
  call: any,
  callStatus: CallStatus,
  callCollocutor: (id: string) => void,
  answerCall: () => void,
  leaveCall: () => void
}

export const SocketContext = createContext<VideoConnectionContext>({} as VideoConnectionContext);

const socket = io(serverUrl);

export enum CallStatus { 
  init, 
  collocutorIsCalling, 
  accepted, 
  ended 
}

export const SocketContextProvider = ({ children }: { children: React.ReactElement }) => {

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
      if (!thisVideo.current) return;

      thisVideo.current.srcObject = stream;
      setStream(stream);
    });

    // при событии socketId записываем свой id сокета
    socket.on('socketId', (id) => { setThisSocketId(id); });

    // при событии callUser записываем информацию вызова
    socket.on('callUser', ({from, name, signal}) => {
      setCallStatus(CallStatus.collocutorIsCalling);
      setCall({
        isReseivedCall: true,
        from,
        name,
        signal
      });
    })

  }, []);



  const callCollocutor = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        collocutorId: id, // id сокета пользователя, которому звоним
        signalData: data, // сигнальные данные пира
        from: thisSocketId, // наш сокет, чтоб юзер знал кто звонит
        name: 'Вызывающий' //наше имя 
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

  const answerCall = () => {
    setCallStatus(CallStatus.accepted);
    // создаём пир (мы отвечаем на звонок - то есть мы не инициатор, поэтому initiator == false)
    const peer = new Peer({ initiator: false, trickle: false, stream });

    // как только у пира сработает signal отправляем нашему сигнальному серверу информацию о нас
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });


    peer.on('stream', (currentStream) => {
      collocutorVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    peerConnection.current = peer;
  }

  const leaveCall = () => {
    setCallStatus(CallStatus.ended);
    peerConnection.current.destroy();
  }


  return (
    <SocketContext.Provider value={{
      thisSocketId,
      thisVideo,
      stream,

      collocutorVideo,
      
      call,
      callStatus,
      
      callCollocutor,
      answerCall,
      leaveCall
    }}>
      {children}
    </SocketContext.Provider>
  )
}