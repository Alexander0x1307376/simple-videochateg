
export type CallStatus = 'waitForAnswer' | 'onLine';
export type ResponseCode = 'ok' | 'otherCallInProgress' | 'notFound';
export type Call = { senderId: string, receiverId: string, status: CallStatus }


export class CallsService {

  private calls: Call[] = [];

  constructor() {
    this.startCall = this.startCall.bind(this);
    this.acceptCall = this.acceptCall.bind(this);
    this.endCall = this.endCall.bind(this);
  }

  startCall(senderId: string, receiverId: string): ResponseCode {
    // если нет записи об уже идущем вызове - добавляем, сообщаем об успехе
    const callInProgress = this.calls.some(item => 
      senderId === item.senderId ||
      senderId === item.receiverId ||
      receiverId === item.senderId ||
      receiverId === item.receiverId
    );

    if (callInProgress)
      return 'otherCallInProgress';

    this.calls.push({ senderId, receiverId, status: 'waitForAnswer' });  
    return 'ok';
  }


  acceptCall(socketId: string): 'ok' | 'notFound' {
    // принятие - установка статуса onLine
    // принимаем если есть запись где socketId === call.receiverId и status === waitForAnswer
    const call = this.calls.find(item => 
      item.senderId === socketId && item.status === 'waitForAnswer'
    );

    if(!call)
      return 'notFound';
    
    call.status = 'onLine';
    return 'ok';  
  }

  // завершение / отмена вызова
  endCall(socketId: string): Call | undefined  {
    // завершение - снос записи
    const call = this.calls.find(item =>
      item.senderId === socketId || item.receiverId === socketId
    );

    if(!call)
      return undefined;

    this.calls.splice(this.calls.indexOf(call), 1);
    return call;
  }
}