import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

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


enum Actions {
  socketId = 'socketId',
  callAccepted = 'callAccepted',
  callEnded = 'callEnded',
}

io.on('connection', (socket) => {

  console.log('connection!', socket.id);
  socket.emit(Actions.socketId, socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit(Actions.callEnded);
  });

  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    console.log(`Calling user name: ${userToCall}, from: ${from}, name: ${name}`)
    io.to(userToCall).emit('callUser', {
      signal: signalData, // данные пиринга?!
      from,
      name
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit(Actions.callAccepted, data.signal);
  });

});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});