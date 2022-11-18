import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { log } from './utils/logger';
import { CallsService } from './CallsService';
import { checkIfSocketIsConnected } from './utils/socketUtils';
import { CallResponses, ClientToServerEvents } from '@simple-videochateg/shared';
import { ServerToClientEvents } from '@simple-videochateg/shared';

const app = express();
const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
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
  log('Сокет подключён:', socket.id);
  socket.emit('connectionKey', { connectionKey: socket.id });


  socket.on('callUser', ({ collocutorKey }, callback) => {

    // если звоним себе
    const callMyself = socket.id === collocutorKey;
    if (callMyself) {
      callback({ status: CallResponses.CALL_SELF });
      return;
    }

    // если нет собеседника
    const isThereCollocutor = checkIfSocketIsConnected(io, collocutorKey);
    if (!isThereCollocutor) {
      callback({ status: CallResponses.COLLOCUTOR_NOT_FOUND });
      return;
    }

    // если с ключом всё нормально - начинаем звонок 
    io.to(collocutorKey).emit('incomingCall', { collocutorKey: socket.id });
    const callStatus = callService.startCall(socket.id, collocutorKey);

    // если всё хорошо
    if (callStatus === 'ok') {
      log(`Звонок: ${socket.id} -> ${collocutorKey}`);
      io.to(collocutorKey).emit('callUser', { callerKey: socket.id });
      callback({ status: CallResponses.OK });
      return;
    }

    // если абонент уже с кем-то разговаривает
    else if(callStatus === 'otherCallInProgress') {
      log(`Звонок: ${socket.id} -> ${collocutorKey}. Абонент занят`);
      callback({ status: CallResponses.OTHER_CALL_IN_PROGRESS });
      return;
    }

    // в остальных случаях
    callback({ status: CallResponses.CALL_IS_NOT_ALLOWED });

  });
  

  socket.on('acceptCall', ( { collocutorKey }, callback) => {
    const callStatus = callService.acceptCall(collocutorKey);
    if (callStatus === 'ok') {
      // собеседнику
      io.to(collocutorKey).emit('callAccepted', {
        collocutorKey: socket.id,
        status: callStatus
      });
      log(`Звонок: ${collocutorKey} -> ${socket.id}. Принят собеседником`);
    }
    else if (callStatus === 'notFound')
      log(`Звонок: ${collocutorKey} -> ${socket.id}. Вызов не найден`);
    // нам
    callback({ callStatus });
  });


  socket.on('peerOffer', ({ collocutorKey, signal }) => {
    log(`Пиринговое соединение: ${socket.id} <-> ${collocutorKey}`);
    io.to(collocutorKey).emit('peerOffer', signal);
  });


  socket.on('peerAnswer', ({ collocutorKey, signal }) => {
    log(`Пиринговое соединение: ${socket.id} - ${collocutorKey}. Ответ`);
    io.to(collocutorKey).emit('peerAnswer', signal);
  });


  socket.on('cancelCall', ({ collocutorKey }) => {
    log(`Звонок: ${socket.id} - ${collocutorKey}. Отменён звонящим`);
    const callData = callService.endCall(socket.id);
    if (callData)
      io.to(collocutorKey).emit('callEnded', {collocutorKey: socket.id, response: CallResponses.CALL_CANCELED});
  });

  socket.on('endCall', ({ collocutorKey, response }) => {
    const callData = callService.endCall(socket.id);
    if (callData) {
      io.to(callData.receiverId === collocutorKey ? callData.receiverId : callData.senderId)
        .emit('callEnded', { collocutorKey: socket.id, response });
    }
  });

  socket.on('disconnect', () => {
    const callData = callService.endCall(socket.id);
    if (callData) {
      io.to(callData.senderId === socket.id ? callData.receiverId : callData.senderId)
        .emit('callEnded', { collocutorKey: socket.id, response: CallResponses.LOST_CONNECTION });
    }
  });

});


server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});