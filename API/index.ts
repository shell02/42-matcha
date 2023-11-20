import { createApp } from './src/app'
import { createServer } from './src/sockets'

const app = createApp()
const server = createServer(app)

server.listen(3001, () => {
  console.log('Listening on port 3001...')
})
