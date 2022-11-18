import { CallResponses } from "./messages";



export interface ServerToClientEvents {
  connectionKey: (data : { connectionKey: string }) => void;
  incomingCall: (data : { collocutorKey: string }) => void;
  callAccepted: (data : { 
    collocutorKey: string;
    status: string; 
  }) => void;
  callEnded: (data: { collocutorKey: string, response: CallResponses }) => void;
  peerOffer: (signal: any) => void;
  peerAnswer: (signal: any) => void;
  callUser: (data: { callerKey: string }) => void;
}

export interface ClientToServerEvents {
  callUser: (
    data: { collocutorKey: string; },
    callback: (statusData: { status: CallResponses }) => void
  ) => void;
  acceptCall: (
    data: { collocutorKey: string; },
    callback: (data: { callStatus: string }) => void
  ) => void;
  declineCall: (
    data: { collocutorKey: string; }
  ) => void;
  endCall: (
    data: { collocutorKey: string; response: CallResponses }
  ) => void;
  cancelCall: (
    data: { collocutorKey: string; }
  ) => void;
  peerOffer: (
    data: { collocutorKey: string; signal: any }
  ) => void;
  peerAnswer: (
    data: { collocutorKey: string; signal: any }
  ) => void;
}