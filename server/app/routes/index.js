const router = require('express').Router()

const Socket = require('../services/Socket')
const Redis = require('../services/Redis')
const { RedisPublisher } = require('../services/RedisPubSub')

router
  .route('/message')
  .post(async function (req, res, next) {
    try {

      RedisPublisher.publish(req.body)
      // Socket.transmitMsg('prueba', req.body)

      res.send({ success: true })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/message/sync')
  .post(async function (req, res, next) {
    try {
      RedisPublisher.publish(req.body)

      // await Socket.transmitMsgAsync('prueba', req.body)
      res.send({ success: true })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/socket/status')
  .get(function (req, res, next) {
    try {
      res.send(Socket.status())
    } catch (error) {
      next(error)
    }
  })

router
  .route('/socket/servers/availables')
  .get(async function (req, res, next) {
    try {
      const data = await Redis.getAllServersInfo()

      res.send(data)
    } catch (error) {
      next(error)
    }
  })

module.exports = router