import { Application } from 'express'
import http = require('http')
import { Server } from 'socket.io'

const userSockets: { [key: string]: string } = {}

export const createServer = (app: Application) => {
  const server: http.Server = http.createServer(app)

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('a user connected, socket: ', socket.id)
    io.to(socket.id).emit('identify')

    socket.on('auth', (data) => {
      userSockets[data.id] = socket.id
      socket.emit('online', data)
    })

    socket.on('like', (data) => {
      console.log('like', data)
      if (userSockets[data.toUserID]) {
        socket.to(userSockets[data.toUserID]).emit('likeReceived', data)
      }
    })

    socket.on('unlike', (data) => {
      console.log('unlike', data)
      if (userSockets[data.toUserID]) {
        socket.to(userSockets[data.toUserID]).emit('unlikeReceived', data)
      }
    })

    socket.on('likeBack', (data) => {
      console.log('likeBack', data)
      if (userSockets[data.toUserID]) {
        socket.to(userSockets[data.toUserID]).emit('likeBackReceived', data)
      }
    })

    socket.on('view', (data) => {
      console.log('view', data)
      if (userSockets[data.toUserID]) {
        socket.to(userSockets[data.toUserID]).emit('viewReceived', data)
      }
    })

    socket.on('message', (data) => {
      console.log('message', data)
    })

    socket.on('logout', (data) => {
      console.log('logout', data)
      delete userSockets[data.id]
      socket.emit('offline', data)
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('offline', socket.id)
      Object.keys(userSockets).forEach((key) => {
        if (userSockets[key] === socket.id) {
          delete userSockets[key]
        }
      })
      console.log('user disconnected')
    })
  })
  return server
}
