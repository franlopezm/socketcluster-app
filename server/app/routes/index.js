const router = require('express').Router()

const socket = require('../socket')

router
  .route('/message')
  .post(async function (req, res, next) {
    try {
      socket.transmitMsg('prueba', req.body)

      res.send({ success: true })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/message/sync')
  .post(async function (req, res, next) {
    try {
      await socket.transmitMsgAsync('prueba', req.body)

      res.send({ success: true })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/socket/status')
  .get(function (req, res, next) {
    try {
      res.send(socket.status())
    } catch (error) {
      next(error)
    }
  })

router
  .route('/socket/servers/availables')
  .get(function (req, res, next) {
    try {
      res.send(
        [{
          host: 'localhost',
          port: '8080',
          secure: false,
          url: 'http://localhost:8080',
          isMainServer: true, // always run
        }, {
          host: 'localhost',
          port: '8000',
          secure: false,
          url: 'http://localhost:8000'
        }, {
          host: 'localhost',
          port: '8081',
          secure: false,
          url: 'http://localhost:8081'
        }]
      )
    } catch (error) {
      next(error)
    }
  })

module.exports = router