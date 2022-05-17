import { Server } from 'socket.io';

const io = new Server(3000, {
  cors: {
    origin: [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
    ],
  },
});

io.on('connection', (socket) => {
  console.log(`A user ${socket.id} connected!`);
  //   socket.on('custom-event', (number, string, obj) => {
  //     console.log(number, string, obj)
  //   })

  socket.on('send-message', (message, room) => {
    if (room === '') {
      socket.broadcast.emit('receive-message', message);
    } else {
      socket.to(room).emit('receive-message', message);
    }
  });

  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`Joined Room With ${room}`);
  });
});
