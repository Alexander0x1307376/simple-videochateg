import React, { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { serverUrl } from "../constants/server";
import { ClientToServerEvents, CallResponses, ServerToClientEvents } from "@simple-videochateg/shared";
import { Socket } from "socket.io-client";
import { nanoid } from "nanoid";


export enum CallStatus {
  IDLE = "IDLE",
  INCOMING_CALL = "INCOMING_CALL",
  OUTCOMING_CALL = "OUTCOMING_CALL",
  ESTABLISHING_PEER_CONNECTION = "ESTABLISHING_PEER_CONNECTION",
  CONNECTION_IN_PROGRESS = "CONNECTION_IN_PROGRESS"
}

export interface VideoConnectionContextProps {
  thisKey: string;
  callStatus: CallStatus;
  preCallResponse: {
    key: string;
    status: CallResponses;
  } | undefined;
  refOurVideoElement: any;
  refCollocutorVideoElement: any;
  callCollocutor: (key: string) => void;
  answerCall: () => void;
  leaveCall: () => void;
  declineCall: () => void;
  cancelCall: () => void;
}

export const VideoConnectionContext = createContext<VideoConnectionContextProps>({} as VideoConnectionContextProps);

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(serverUrl);


export const VideoConnectionProvider = ({ children }: { children: React.ReactElement }) => {

  const [thisKey, setThisKey] = useState<string>('');
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.IDLE);

  const [callResponse, setСallResponse] = useState<VideoConnectionContextProps['preCallResponse']>(undefined);
  const [collocutorData, setCollocutorData] = useState<{ key: string } | undefined>();

  const [ourStream, setOurStream] = useState<MediaStream | undefined>();
  const [ourVideoElement, setOurVideoElement] = useState<any>();

  const [collocutorStream, setCollocutorStream] = useState<MediaStream | undefined>();
  const [collocutorVideoElement, setCollocutorVideoElement] = useState<any>();

  const [peer, setPeer] = useState<any>();

  const refOurVideoElement = (element: any) => {
    setOurVideoElement(element);
  }

  const refCollocutorVideoElement = (element: any) => {
    setCollocutorVideoElement(element);
  }

  useEffect(() => {
    if (ourVideoElement && ourStream)
      ourVideoElement.srcObject = ourStream;
  }, [ourVideoElement, ourStream]);
  
  useEffect(() => {
    if (collocutorVideoElement && collocutorStream)
      collocutorVideoElement.srcObject = collocutorStream;
  }, [collocutorVideoElement, collocutorStream]);


  useEffect(() => {

    // запрашиваем ской ключ при присоединении
    const onConnectionKey: ServerToClientEvents['connectionKey'] = ({ connectionKey }) => {
      setThisKey(connectionKey);
    }

    // реагируем на входящий вызов
    const onIncomingCall: ServerToClientEvents['incomingCall'] = ({ collocutorKey }) => {
      setCallStatus(CallStatus.INCOMING_CALL);
      setCollocutorData({ key: collocutorKey });
    }

    // когда собеседник принял НАШ вызов (при успехе предлагаем пиринговое соединение)
    const onCallAccepted: ServerToClientEvents['callAccepted'] = async ({ collocutorKey, status }) => {
      setCallStatus(CallStatus.ESTABLISHING_PEER_CONNECTION);

      const peer = new Peer({ initiator: true, trickle: false, stream: ourStream });
      peer.on('signal', (signal) => {
        socket.emit('peerOffer', { collocutorKey, signal });
      })
      peer.on('stream', (stream) => {
        setCollocutorStream(stream);
        setCallStatus(CallStatus.CONNECTION_IN_PROGRESS);
      });

      setPeer(peer);
    }

    // предложение НАМ пирингового соединения при входящем звонке
    const onPeerOffer: ServerToClientEvents['peerOffer'] = async (signal) => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on('signal', (signal) => {
        socket.emit('peerAnswer', { collocutorKey: collocutorData!.key, signal });
      });
      peer.on('stream', (stream) => {
        setCollocutorStream(stream);
        setCallStatus(CallStatus.CONNECTION_IN_PROGRESS);
      });

      peer.signal(signal);
      setOurStream(stream);
      setPeer(peer);
    }


    const onPeerAnswer: ServerToClientEvents['peerAnswer'] = async (signal) => {
      peer.signal(signal);
    }

    const onCallEnded: ServerToClientEvents['callEnded'] = ({ collocutorKey, response }) => {
      setIdleState();
      setСallResponse({ key: nanoid(), status: response });
    }

    socket.on('connectionKey', onConnectionKey);
    socket.on('incomingCall', onIncomingCall);
    socket.on('callAccepted', onCallAccepted);
    socket.on('callEnded', onCallEnded);
    socket.on('peerOffer', onPeerOffer);
    socket.on('peerAnswer', onPeerAnswer);
    
    return () => {
      socket.off('connectionKey', onConnectionKey);
      socket.off('incomingCall', onIncomingCall);
      socket.off('callAccepted', onCallAccepted);
      socket.off('callEnded', onCallEnded);
      socket.off('peerOffer', onPeerOffer);
      socket.off('peerAnswer', onPeerAnswer);

      if(peer)
        peer.removeAllListeners();
    }
  }, [peer, thisKey, collocutorData, ourStream]);


  const callCollocutor = async (collocutorKey: string) => {
    setCollocutorData({ key: collocutorKey });

    socket.emit('callUser', { collocutorKey }, async ({status}) => {
      if(status === CallResponses.OK) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setOurStream(stream);
        setCallStatus(CallStatus.OUTCOMING_CALL);
      }
      setСallResponse({ key: nanoid(), status });
    });
  }

  const answerCall = async () => {
    socket.emit('acceptCall', { collocutorKey: collocutorData!.key }, ({ callStatus }) => {
      setCallStatus(CallStatus.ESTABLISHING_PEER_CONNECTION);
    });
  }

  const declineCall = async () => {
    socket.emit('endCall', { collocutorKey: collocutorData!.key, response: CallResponses.CALL_DECLINED });
    setIdleState();
  }

  const cancelCall = () => {
    socket.emit('cancelCall', { collocutorKey: collocutorData!.key });
    setIdleState();
  }

  const leaveCall = () => {
    socket.emit('endCall', { collocutorKey: collocutorData!.key, response: CallResponses.CALL_ENDED });
    setIdleState();
  }

  const setIdleState = () => {
    setCallStatus(CallStatus.IDLE);

    setPeer(undefined);
    setCollocutorData(undefined);
    setOurStream(undefined);
    setCollocutorStream(undefined);
  }


  return (
    <VideoConnectionContext.Provider value={{ 
      thisKey, 
      callStatus, cancelCall, preCallResponse: callResponse,
      callCollocutor, answerCall, declineCall, leaveCall,
      refOurVideoElement, refCollocutorVideoElement
    }}>
      {children}
    </VideoConnectionContext.Provider>
  )
}