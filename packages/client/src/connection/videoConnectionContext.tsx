import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { serverUrl } from "../constants/server";
import { CallEvents } from "@simple-videochateg/shared";


export enum CallStatus {
  INIT = "INIT",
  INCOMING_CALL = "INCOMING_CALL",
  OUTCOMING_CALL = "OUTCOMING_CALL",
  CALL_ACCEPTED = "CALL_ACCEPTED",
  CALL_DECLINED = "CALL_DECLINED",
  CALL_CANCELLED = "CALL_CANCELLED",
  CALL_DISCONNECTED = "CALL_DISCONNECTED",
  CALL_ENDED = "CALL_ENDED",
  NO_COLLOCUTOR = "NO_COLLOCUTOR"
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
  cancelCall: () => void;
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
  
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INIT);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState<boolean>(true);

  useEffect(() => {

    // получаем аудио и видеосигнал
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      setStream(stream);
      thisVideo.current.srcObject = stream;
    });

    // при событии socketId записываем свой id сокета
    socket.on(CallEvents.SOCKET_ID, (id) => { 
      console.log('socket:socketId');
      setThisSocketId(id); 
    });


    // как нам звонят -  записываем информацию вызова
    socket.on(CallEvents.CALL_USER, ({from, signal}) => {
      console.log('socket:callUser');
      setCallStatus(CallStatus.INCOMING_CALL);
      setCollocutorId(from);
      setCall({ isReceivingCall: true, signal });
    });


    socket.on(CallEvents.CALL_DECLINED, () => {
      console.log('socket:callDeclined');
      setCallStatus(CallStatus.CALL_DECLINED);
      setCollocutorId('');
    });


    socket.on(CallEvents.CALL_CANCELED, ({ collocutorId }: { collocutorId: string }) => {
      console.log('socket:callCanceled');
      setCallStatus(CallStatus.CALL_CANCELLED);
      clearPeer();
    });


    socket.on(CallEvents.CALL_ENDED, () => {
      console.log('socket:callEnded')
      setCallStatus(CallStatus.CALL_ENDED);
      clearPeer();
    });


    socket.on(CallEvents.COLLOCUTOR_DISCONNECTED, () => {
      console.log('socket:clientDisconnected');
      setCallStatus(CallStatus.CALL_DISCONNECTED);
    });

    // когда пользователь отвечает
    socket.on(CallEvents.CALL_ACCEPTED, (signal) => {
      console.log('socket:callAccepted');
      if (!peerConnection.current) return;
      setCallStatus(CallStatus.CALL_ACCEPTED);
      peerConnection.current.signal(signal);
    });

  }, [thisVideo]);


  // Отвечаем на звонок
  const answerCall = () => {
    console.log('method:answerCall');

    setCallStatus(CallStatus.CALL_ACCEPTED);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit(CallEvents.ANSWER_CALL, { signal, collocutorId });
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
  const callCollocutor = async (id: string) => {
    console.log('method:callCollocutor', id);

    socket.emit(CallEvents.CALL_USER_CHECK, { collocutorId: id }, (response: { callAllowed: boolean }) => {
      console.log('CheckResponse!', response);
      if(response.callAllowed) {
        setCallStatus(CallStatus.OUTCOMING_CALL);

        setPeer(true, stream!, {
          onSignal: (data) => {
            setCollocutorId(id);
            socket.emit(CallEvents.CALL_USER, {
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
      else {
        setCallStatus(CallStatus.NO_COLLOCUTOR);
      }
    });



  }


  // отклоняем звонок
  const declineCall = () => {
    console.log('method:declineCall');

    setCallStatus(CallStatus.CALL_ENDED);
    socket.emit('declineCall', { collocutorId });
  }

  // завершаем звонок
  const leaveCall = () => {
    console.log('method:leaveCall');

    socket.emit(CallEvents.LEAVE_CALL, { collocutorId });
    setCallStatus(CallStatus.CALL_ENDED);
    clearPeer();
    setCall({});
  }

  // отмена звонка
  const cancelCall = () => {
    console.log('method:cancelCall');
    socket.emit(CallEvents.CANCEL_CALL, { collocutorId });
    setCallStatus(CallStatus.CALL_CANCELLED);
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
      declineCall,
      cancelCall
    }}>
      {children}
    </VideoConnectionContext.Provider>
  )
}