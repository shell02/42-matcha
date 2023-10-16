import { createApp } from './src/app'

const app = createApp()

app.listen(3001, () => {
  console.log('Listen on port 3001...')
})
