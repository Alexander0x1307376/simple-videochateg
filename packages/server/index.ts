import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { log } from './utils/logger';
import { CallsService } from './CallsService';
import { checkIsSocketIsConnected } from './utils/socketUtils';
import { CallEvents } from '@simple-videochateg/shared';

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





const callService = new CallsService();

io.on('connection', (socket) => {

  log(`Соединение:`, socket.id);
  socket.emit(CallEvents.SOCKET_ID, socket.id);


  socket.on('disconnect', () => {
    log(`Отключение: ${socket.id}`);

    const callData = callService.endCall(socket.id);
    if (callData) {
      const collocutorId = callData.receiverId === socket.id 
        ? callData.senderId
        : callData.receiverId;
      io.to(collocutorId).emit(CallEvents.COLLOCUTOR_DISCONNECTED, { collocutorId });
    }

  });

  socket.on(CallEvents.CALL_USER_CHECK, ({ collocutorId }, callback) => {
    const isThereCollocutor = checkIsSocketIsConnected(io, collocutorId);
    const callMyself = socket.id === collocutorId;
    callback({ 
      callAllowed: isThereCollocutor && !callMyself 
    });
  });

  socket.on(CallEvents.CALL_USER, ({ collocutorId, signalData }) => {
    log(`Звонок: ${socket.id} -> ${collocutorId}`);

    const callStatus = callService.startCall(socket.id, collocutorId);

    if (callStatus === 'otherCallInProgress') {
      socket.emit(CallEvents.OTHER_CALL_IN_PROGRESS, { collocutorId });
    }
    else if(callStatus === 'ok') {
      io.to(collocutorId).emit(CallEvents.CALL_USER, { signal: signalData, from: socket.id });
    }

  });


  socket.on(CallEvents.CANCEL_CALL, ({ collocutorId }) => {
    log(`Звонок: ${socket.id} -> ${collocutorId}. Отменён звонящим`);

    const callStatus = callService.endCall(socket.id);
    if (callStatus) {
      io.to(collocutorId).emit(CallEvents.CALL_CANCELED, { collocutorId: socket.id });
    }

  });


  // принимаем входящий звонок
  socket.on(CallEvents.ANSWER_CALL, ({ signal, collocutorId }) => {
    log(`Звонок: ${collocutorId} -> ${socket.id}. Ответ`);

    const callStatus = callService.acceptCall(collocutorId);
    log(`callStatus: ${callStatus}`);
    if (callStatus === 'ok') {
      io.to(collocutorId).emit(CallEvents.CALL_ACCEPTED, signal);
    }

  });


  socket.on(CallEvents.LEAVE_CALL, ({ collocutorId }) => {
    log(`Звонок: ${collocutorId} : ${socket.id}. Завершен`);

    const callStatus = callService.endCall(socket.id);
    if (callStatus) {
      io.to(collocutorId).emit(CallEvents.CALL_ENDED, socket.id);
    }
  });


  socket.on(CallEvents.DECLINE_CALL, ({ collocutorId }) => {
    log(`Звонок: ${collocutorId} -> ${socket.id}. Отклонён принимающим`);

    callService.endCall(socket.id);

    io.to(collocutorId).emit(CallEvents.CALL_DECLINED);
  });

});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});