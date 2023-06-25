const socketClusterServer = require('socketcluster-server')

class Socket {
  constructor() {
    this.agServer = null
    this.options = {}
  }

  /**
   * Attach a socket in http server
   * @param {Object} httpServer A http server instance
   * @param {Object} [options] Socketcluster options
   * @param {boolean} [options.allowClientPublish=true] Whether or not clients are allowed to publish messages to channels.
   * @param {boolean} [options.origin='*:*'] Origins which are allowed to connect to the server.
   * @param {boolean} [options.socketChannelLimit=1000] The maximum number of unique channels which a single socket can subscribe to.
   * @param {Object} [options.wsEngineServerOptions] Custom options to pass to the wsEngine.
   *
   * @returns {boolean}
   */
  attach(httpServer, options = {}) {
    if (typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Socket.attach, options parameter is not of type Object.')
    this.options = options

    if (this.agServer) return true

    this.agServer = socketClusterServer.attach(httpServer, this.options)
    this._listenReady()
    this._listenError()
    this._listenDisconnection()
    this._listenConnection()
    this._listenSubscription()
    this._listenUnsubscription()

    return true
  }

  /**
   * Transmit a message to a channel without waiting for acknowledgement
   * @param {string} channel Channel to which the message should be transmitted
   * @param {object} message Message to be transmitted through the indicated channel
   */
  transmitMsg(channel, message = {}) {
    this.isAttach()
    this.isValidChannel('transmitMsg', channel)
    this.isValidMessage('transmitMsg', message)

    this.agServer.exchange.transmitPublish(channel, message)
  }

  /**
   * Transmit a message to a channel waiting for acknowledgement
   * @param {string} channel Channel to which the message should be transmitted
   * @param {object} message Message to be transmitted through the indicated channel
   *
   * @returns {Promise<Boolean>}
   */
  async transmitMsgAsync(channel, message = {}) {
    this.isAttach()
    this.isValidChannel('transmitMsgAsync', channel)
    this.isValidMessage('transmitMsgAsync', message)

    try {
      await this.agServer.exchange.invokePublish(channel, message)
    } catch (error) {
      error.method = 'Socket.transmitMsgAsync'
      console.error('ERROR', error.method, error)

      throw error
    }
  }

  /**
   * Get socket status
   *
   * @returns {{host: string, port: string, connectedClients: number, pendingClients: number}}
   */
  status() {
    this.isAttach()

    return {
      host: this.agServer.host,
      port: this.agServer.sourcePort,
      connectedClients: this.agServer.clientsCount,
      pendingClients: this.agServer.pendingClientsCount
    }
  }

  /**
   * Close the server and terminate all sockets
   */
  closeServer() {
    this.agServer.close()
    this.agServer = null
  }

  /**
   * Check is a channel is valid
   * @param {string} method
   * @param {string} channel Channel to which the message should be transmitted
   */
  isValidChannel(channel) {
    if (!channel) throw new Error('Socket.transmitMsg, channel is required.')
  }

  /**
   * Check is a message is valid
   * @param {string} method
   * @param {Object} message Message to be transmitted
   */
  isValidMessage(method, message) {
    if (typeof message !== 'object' || Array.isArray(message)) throw new TypeError(`Socket.${method}, message parameter is not of type Object.`)
    if (!Object.keys(message).length) throw new Error(`Socket.${method}, message is empty.`)
  }

  /**
   * Check socket is attach to a httpServer
   */
  isAttach() {
    if (!this.agServer) throw new Error('Socket is not attach to a httpServer.')
  }

  // Listen subscription channels
  async _listenSubscription() {
    for await (let data of this.agServer.listener('subscription')) {
      console.info('INFO subscribe', data.socket.id, data.channel, data.subscriptionOptions)
    }
  }

  // Listen Unsubscription channels
  async _listenUnsubscription() {
    for await (let data of this.agServer.listener('unsubscription')) {
      console.info('INFO unsubscribe', data.socket.id, data.channel)
    }
  }

  // Listen sockets errors
  async _listenError() {
    for await (let { error } of this.agServer.listener('error')) {
      console.error('ERROR Socket error:', error)
    }
  }

  // Listen socket is ready
  async _listenReady() {
    for await (let data of this.agServer.listener('ready')) {
      console.info('INFO Socket is ready.')
    }
  }

  // Listen sockets disconnections
  async _listenDisconnection() {
    for await (let socket of this.agServer.listener('disconnection')) {
      console.info('INFO Socket is disconnect:', socket.id)
    }
  }

  // Listen connections
  async _listenConnection() {
    for await (let { socket } of this.agServer.listener('connection')) {
      console.info('INFO Socket is connect:', socket.id)
    }
  }
}

module.exports = new Socket()