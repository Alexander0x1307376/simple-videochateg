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

io.on('connection', (socket) => {

  socket.emit('me', socket.id);

});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});