const { HOST = '0.0.0.0', PORT = '8080', REDIS_HOST = "localhost", REDIS_PORT = "6379" } = process.env

const { randomBytes } = require('node:crypto')
const express = require('express')
const http = require('http')
const cors = require('cors')

const Socket = require('./services/Socket')
const Redis = require('./services/Redis')
const { RedisPublisher, RedisSubscriber } = require('./services/RedisPubSub')

const SERVER_ID = randomBytes(10).toString('base64url')

// Create a httpServer instance
const httpServer = http.createServer()

const app = express()
app.disable('x-powered-by')

app.use(cors())
app.use(require('./middlewares/logger'))

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// status
app.get('/health', (req, res) => res.json({ success: true }))

// ROUTES
app.use('/', require('./routes'))

// Handling 404 - Endpoind Not found
app.use((req, res) => res.status(404).send('Not found'))
app.use(require('./middlewares/errors'))

// Attach express to a httpServer
httpServer.on('request', app)

// Attach socket to a httpServer
Socket.attach(httpServer, { allowClientPublish: false })

// Start httpServer
httpServer.listen(parseInt(PORT, 10), HOST)

// Listen server is ready
httpServer.on('listening', () => {
  // Redis.connect({
  //   host: REDIS_HOST,
  //   port: REDIS_PORT
  // })

  RedisPublisher.connect({
    host: REDIS_HOST,
    port: REDIS_PORT
  })

  RedisSubscriber.connect({
    host: REDIS_HOST,
    port: REDIS_PORT
  })

  RedisSubscriber.subscribe((channel, data) => {
    console.log('Received', channel, 'message', data)
  })

  console.info(
    `
    ***********
      Server started on http://${httpServer.address().address}:${httpServer.address().port} IDENTIFIER ${SERVER_ID} PID ${process.pid}
    ***********
    `
  )

  // Redis.addServerInfo(
  //   SERVER_ID,
  //   {
  //     host: 'localhost',
  //     port: PORT,
  //     secure: false,
  //     url: `http://localhost:${PORT}`,
  //     isMainServer: PORT === '8080'
  //   }
  // )
})

process.on('exit', (code) => {
  Redis.deleteServerInfo(SERVER_ID)

  console.info('Server exit', code)
})

process.on('SIGTERM', () => {
  Redis.deleteServerInfo(SERVER_ID)

  console.info('Server SIGTERM')
})

// Work with ctrl+c in terminal
process.on('SIGINT', () => {
  console.info('Server SIGINT')

  process.exit(0)
})

process.on('unhandledRejection', (reason) => {
  console.error('Server unhandledRejection', reason)

  process.exit(0)
})

process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.error('Server uncaughtExceptionMonitor', origin, error)
})