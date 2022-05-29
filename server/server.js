import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

const io = new Server(3000, {
  cors: {
    origin: [
      'http://localhost:8080',
      'https://admin.socket.io',
      'http://localhost:8081',
      'http://localhost:8082',
    ],
  },
});

const userIo = io.of('/user');
userIo.on('connection', (socket) => {
  console.log(`connected to user namespace with username! ${socket.username}`);
});

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error('Please send token!'));
  }
});

function getUsernameFromToken(token) {
  return token;
}

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

  socket.on('ping', (n) => console.log(n));
});

instrument(io, { auth: false });
