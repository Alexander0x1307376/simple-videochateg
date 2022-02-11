import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { getCurrentTime } from './utils/time';
import { log } from './utils/logger';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());


const port = process.env.PORT || 8001;


app.get('/', (req, res) => {
  res.send('server is running');
});


enum Emits {
  SOCKET_ID = 'socketId',
  CALL_USER = 'callUser',
  CALL_ACCEPTED = 'callAccepted',
  CALL_ENDED = 'callEnded',
  CALL_DECLINED = 'callDeclined',
  DISCONNECTED = 'clientDisconnected'
}


io.on('connection', (socket) => {

  log(`Соединение:`, socket.id);
  socket.emit(Emits.SOCKET_ID, socket.id);


  socket.on('disconnect', () => {
    log(`Отключение: ${socket.id}`);
    socket.broadcast.emit(Emits.DISCONNECTED, { socketId: socket.id });
  });


  socket.on('callUser', ({ collocutorId, signalData, from }) => {
    log(`Звонок: ${from} -> ${collocutorId}`);
    io.to(collocutorId).emit(Emits.CALL_USER, { signal: signalData, from });
  });


  socket.on('answerCall', (data) => {
    log(`Звонок: ${data.to} -> ${socket.id}. Ответ`);
    io.to(data.to).emit(Emits.CALL_ACCEPTED, data.signal);
  });


  socket.on('leaveCall', (data) => {
    log(`Звонок: ${data.to} -> ${socket.id}. Завершение`);
    io.to(data.to).emit(Emits.CALL_ENDED);
    // io.to(data.to).emit(Emits.CALL_ENDED, data.signal);
  });


  socket.on('declineCall', (data) => {
    log(`Звонок: ${data.to} -> ${socket.id}. Отклонён принимающим`);
    io.to(data.to).emit(Emits.CALL_DECLINED);
  });

});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});