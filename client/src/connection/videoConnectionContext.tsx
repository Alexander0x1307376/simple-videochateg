import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { serverUrl } from "../constants/server";



export enum CallStatus {
  init = "init",
  collocutorIsCalling = "collocutorIsCalling",
  thisUserIsCalling = "thisUserIsCalling",
  accepted = "accepted",
  declined = "declined",
  ended = "ended"
}

export interface VideoConnectionContextProps {
  thisSocketId: string;
  thisVideo: React.ClassAttributes<HTMLVideoElement>['ref'];
  stream: any;
  collocutorVideo: React.ClassAttributes<HTMLVideoElement>['ref'];
  call: any;
  callStatus: CallStatus;
  isMicrophoneEnabled: boolean;
  callCollocutor: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  declineCall: () => void;
  toggleMicrophone: () => void;
}

export const VideoConnectionContext = createContext<VideoConnectionContextProps>({} as VideoConnectionContextProps);

const socket = io(serverUrl);



export const VideoConnectionProvider = ({ children }: { children: React.ReactElement }) => {

  const [thisSocketId, setThisSocketId] = useState<string>('');
  // наше видео
  const thisVideo = useRef<any>(); // html элемент video, где будет наша рожа
  const [stream, setStream] = useState<MediaStream>(); // стрим с наших вебки и микрофона
  // информация о входящем вызове
  const [call, setCall] = useState<any>({});
  
  const collocutorVideo = useRef<any>(); // html элемент video с рожей собеседника

  //socketId собеседника - хранится во время вызова
  const [collocutorId, setCollocutorId] = useState<string>(''); 

  // пиринговое соединение
  const peerConnection = useRef<Peer.Instance | undefined>();
  
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.init);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState<boolean>(true);

  useEffect(() => {

    // получаем аудио и видеосигнал
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      setStream(stream);
      thisVideo.current.srcObject = stream;
    });

    // при событии socketId записываем свой id сокета
    socket.on('socketId', (id) => { 
      console.log('socket:socketId');
      setThisSocketId(id); 
    });


    // как нам звонят -  записываем информацию вызова
    socket.on('callUser', ({from, signal}) => {
      console.log('socket:callUser');
      setCallStatus(CallStatus.collocutorIsCalling);
      setCollocutorId(from);
      setCall({ isReceivingCall: true, signal });
    });


    socket.on('callDeclined', () => {
      console.log('socket:callDeclined');
      setCallStatus(CallStatus.declined);
      setCollocutorId('');
    });


    socket.on('callEnded', () => {
      console.log('socket:callEnded')
      setCallStatus(CallStatus.ended);
      clearPeer();
    });


    socket.on('clientDisconnected', () => {
      console.log('socket:clientDisconnected');
      setCallStatus(CallStatus.ended);
    });

    // когда пользователь отвечает
    socket.on('callAccepted', (signal) => {
      console.log('socket:callAccepted');
      if (!peerConnection.current) return;
      setCallStatus(CallStatus.accepted);
      peerConnection.current.signal(signal);
    });

  }, [thisVideo]);


  // Отвечаем на звонок
  const answerCall = () => {
    console.log('method:answerCall');

    setCallStatus(CallStatus.accepted);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('answerCall', { signal, collocutorId });
    });
    peer.on('stream', (currentStream) => {
      collocutorVideo.current.srcObject = currentStream;
    });

    peer.on('close', () => {
      peer.removeAllListeners();
    });

    peer.signal(call.signal);
    peerConnection.current = peer;

  }

  // Звоним второму юзеру
  const callCollocutor = (id: string) => {
    console.log('method:callCollocutor');

    setCallStatus(CallStatus.thisUserIsCalling);
    
    setPeer(true, stream!, {

      onSignal: (data) => {
        setCollocutorId(id);
        socket.emit('callUser', {
          collocutorId: id, // id сокета пользователя, которому звоним
          from: thisSocketId, // наш сокет, чтоб юзер знал кто звонит
          signalData: data // сигнальные данные пира
        });
      },

      onStream: (currentStream) => {
        collocutorVideo.current.srcObject = currentStream;
      },

    });
  }


  // отклоняем звонок
  const declineCall = () => {
    console.log('method:declineCall');

    setCallStatus(CallStatus.ended);
    socket.emit('declineCall', { collocutorId });
  }

  // завершаем звонок
  const leaveCall = () => {
    console.log('method:leaveCall');

    socket.emit('leaveCall', { collocutorId });
    setCallStatus(CallStatus.ended);
    clearPeer();
    setCall({});
  }


  const setPeer = (initiator: boolean, stream: MediaStream, eventHandlers: {
    onSignal?: (signal: Peer.SignalData) => void;
    onStream?: (stream: MediaStream) => void;
    onClose?: () => void;
  }) => {
    const peer = new Peer({ initiator, trickle: false, stream });
    eventHandlers.onSignal && peer.on('signal', eventHandlers.onSignal);
    eventHandlers.onStream && peer.on('stream', eventHandlers.onStream);
    eventHandlers.onClose && peer.on('close', eventHandlers.onClose);
    peerConnection.current = peer;
  }

  const clearPeer = () => {
    if (!peerConnection.current) return;
    peerConnection.current.removeAllListeners();
    peerConnection.current.destroy();
    peerConnection.current = undefined;
  }

  const toggleMicrophone = () => {
    if (stream?.getAudioTracks()[0]) {
      setIsMicrophoneEnabled(prev => {
        stream.getAudioTracks()[0].enabled = !prev;
        return !prev;
      });
    }
  }

  return (
    <VideoConnectionContext.Provider value={{
      thisSocketId,
      thisVideo,
      stream,

      collocutorVideo,
      
      call,
      callStatus,
      
      toggleMicrophone,
      isMicrophoneEnabled,

      callCollocutor,
      answerCall,
      leaveCall,
      declineCall
    }}>
      {children}
    </VideoConnectionContext.Provider>
  )
}