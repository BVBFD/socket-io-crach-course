import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:8081'],
  },
})

io.on('connection', (socket) => {
  console.log(`A user ${socket.id} connected!`)
  //   socket.on('custom-event', (number, string, obj) => {
  //     console.log(number, string, obj)
  //   })

  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', message)
  })
})
