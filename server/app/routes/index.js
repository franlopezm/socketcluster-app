const router = require('express').Router()

const socket = require('../socket')

router
  .route('/message')
  .post(async function(req, res, next) {
    try {
      socket.transmitMsg('prueba', req.body)

      res.send({ success: true })
    } catch(error) {
      next(error)
    }
  })

router
  .route('/message/async')
  .post(async function(req, res, next) {
    try {
      await socket.transmitMsgAsync('prueba', req.body)

      res.send({ success: true })
    } catch(error) {
      next(error)
    }
  })

router
  .route('/socket/status')
  .get(function (req, res, next) {
    try {
      res.send(socket.status())
    } catch(error) {
      next(error)
    }
  })

module.exports = router