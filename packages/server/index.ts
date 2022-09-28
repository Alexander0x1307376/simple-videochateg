import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { log } from './utils/logger';
import { CallsService } from './CallsService';
import { checkIsSocketIsConnected } from './utils/socketUtils';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());


const port = process.env.PORT || 8000;


app.get('/', (req, res) => {
  res.send('server is running');
});


enum Events {
  SOCKET_ID = 'socketId',
  CALL_USER = 'callUser',
  OTHER_CALL_IN_PROGRESS = 'otherCallInProgress',
  NO_COLLOCUTOR = 'noCollocutor',
  CANCEL_CALL_USER = 'cancelCallUser',
  CALL_ACCEPTED = 'callAccepted',
  CALL_DECLINED = 'callDeclined',
  CALL_ENDED = 'callEnded',
  COLLOCUTOR_DISCONNECTED = 'clientDisconnected'
}


const callService = new CallsService();

io.on('connection', (socket) => {

  log(`Соединение:`, socket.id);
  socket.emit(Events.SOCKET_ID, socket.id);


  socket.on('disconnect', () => {
    log(`Отключение: ${socket.id}`);

    const callData = callService.endCall(socket.id);
    if (callData) {
      const collocutorId = callData.receiverId === socket.id 
        ? callData.receiverId 
        : callData.senderId;
      io.to(collocutorId).emit(Events.COLLOCUTOR_DISCONNECTED, { collocutorId });
    }

  });


  socket.on('callUser', ({ collocutorId, signalData }) => {
    log(`Звонок: ${socket.id} -> ${collocutorId}`);

    const callStatus = callService.startCall(socket.id, collocutorId);

    if (checkIsSocketIsConnected(io, collocutorId)) {
      socket.emit(Events.NO_COLLOCUTOR, { collocutorId });
    }
    else if (callStatus === 'otherCallInProgress') {
      socket.emit(Events.OTHER_CALL_IN_PROGRESS, { collocutorId });
    }
    else if(callStatus === 'ok') {
      io.to(collocutorId).emit(Events.CALL_USER, { signal: signalData, from: socket.id });
    }

  });


  socket.on('cancelCallUser', ({ collocutorId }) => {
    log(`Звонок: ${socket.id} -> ${collocutorId}. Отменён звонящим`);

    const callStatus = callService.endCall(socket.id);
    if (callStatus) {
      io.to(collocutorId).emit(Events.CANCEL_CALL_USER, socket.id);
    }

  });


  // принимаем входящий звонок
  socket.on('answerCall', ({ signal, collocutorId }) => {
    log(`Звонок: ${collocutorId} -> ${socket.id}. Ответ`);

    const callStatus = callService.acceptCall(collocutorId);
    log(`callStatus: ${callStatus}`);
    if (callStatus === 'ok') {
      io.to(collocutorId).emit(Events.CALL_ACCEPTED, signal);
    }

  });


  socket.on('leaveCall', ({ collocutorId }) => {
    log(`Звонок: ${collocutorId} : ${socket.id}. Завершен`);

    const callStatus = callService.endCall(socket.id);
    if (callStatus) {
      io.to(collocutorId).emit(Events.CALL_ENDED, socket.id);
    }
  });


  socket.on('declineCall', ({ collocutorId }) => {
    log(`Звонок: ${collocutorId} -> ${socket.id}. Отклонён принимающим`);

    callService.endCall(socket.id);

    io.to(collocutorId).emit(Events.CALL_DECLINED);
  });

});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});