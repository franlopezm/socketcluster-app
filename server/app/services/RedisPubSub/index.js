const Redis = require('ioredis')

const channel = 'socket_notification'

class RedisPublisher {
  constructor() {
    this._client = null
  }

  /**
   * Create redis connection
   * @param {object} params
   * @param {string} params.host
   * @param {string|number} params.port
   */
  connect(params) {
    const { host, port } = params
    if (!host || !port) throw new Error('host and port are required.')

    this._client = new Redis({
      host,
      port: parseInt(port, 10)
    })
  }

  /**
   * Publish new message to subscribers
   * @param {object} payload
   * @param {string} payload.type
   * @param {string} payload.channel
   * @param {object} payload.data
   *
   * @returns {Boolean}
   */
  publish(payload) {
    if (!payload.type) throw new Error('type is required.')
    if (!payload.channel) throw new Error('channel is required.')

    this._client.publish(
      channel,
      JSON.stringify(payload)
    )

    console.log('Publish new Message', new Date().toISOString())

    return true
  }
}

class RedisSubscriber {
  constructor() {
    this._client = null
  }

  /**
   * Create redis connection
   * @param {object} params
   * @param {string} params.host
   * @param {string|number} params.port
   */
  connect(params) {
    const { host, port } = params
    if (!host || !port) throw new Error('host and port are required.')

    this._client = new Redis({
      host,
      port: parseInt(port, 10)
    })
  }

  /**
   * Add subscriber
   */
  subscribe(cb) {
    try {
      this._client.subscribe(
        channel,
        (error, count) => {
          if (error) {
            console.error('subscribe Error:', error)
          } else {
            console.info('Subscribe to', count, 'channels')
          }
        }
      )

      this._client.on('message', cb)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports.RedisPublisher = new RedisPublisher()
module.exports.RedisSubscriber = new RedisSubscriber()

/**
 *
 * Obtener los canales existentes actualmente: PUBSUB CHANNELS [pattern]
 * https://redis.io/commands/pubsub-channels/
 *
 * Obtener el número de patrones a los que están suscritos los clientes: PUBSUB NUMPAT
 * https://redis.io/commands/pubsub-numpat/
 *
 * Obtener el número de suscriptores que tiene un canal específico: PUBSUB NUMSUB [channelName]
 * https://redis.io/commands/pubsub-numsub/
 *
 * Obtener los canales que actualmente tienen activado el sharding: PUBSUB SHARDCHANNELS [pattern]
 * https://redis.io/commands/pubsub-shardchannels/
 *
 * Obtener el número de suscriptores que tiene un canal específico en modo sharding: PUBSUB SHARDNUMSUB [shardchannel [shardchannel ...]]
 * PUBSUB SHARDNUMSUB [shardchannel [shardchannel ...]]
 *
 */