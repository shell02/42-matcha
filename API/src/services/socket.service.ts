import { Server } from 'socket.io'

const io = new Server(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  console.log('a user connected, socket: ', socket.id)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
