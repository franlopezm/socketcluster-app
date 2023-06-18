const { HOST = '0.0.0.0', PORT = 8000 } = process.env

const express = require('express')
const http = require('http')

const socket = require('./socket')


// Create a httpServer instance
const httpServer = http.createServer()

const app = express()
app.disable('x-powered-by')
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
socket.attach(httpServer, { allowClientPublish: false })

// Start httpServer
httpServer.listen(parseInt(PORT, 10), HOST)

// Listen server is ready
httpServer.on('listening', () => {
  console.info(`
    ***********
      Server started on http://${httpServer.address().address}:${httpServer.address().port}
    ***********
  `)
})
