export enum CallEvents {
  SOCKET_ID = 'socketId',
  CALL_USER = 'callUser',
  CALL_USER_CHECK = 'callUserCheck',
  OTHER_CALL_IN_PROGRESS = 'otherCallInProgress',
  NO_COLLOCUTOR = 'noCollocutor',
  CALL_ACCEPTED = 'callAccepted',
  CALL_DECLINED = 'callDeclined',
  CALL_CANCELED = 'callCanceled',
  CALL_ENDED = 'callEnded',
  COLLOCUTOR_DISCONNECTED = 'clientDisconnected',
  
  ANSWER_CALL = 'answerCall',
  LEAVE_CALL = 'leaveCall',
  DECLINE_CALL = 'declineCall',
  CANCEL_CALL = 'cancelCallUser',

}