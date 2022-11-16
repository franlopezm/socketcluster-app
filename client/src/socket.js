import socketCluster from 'socketcluster-client'

const wsOptions = {
  hostname: 'localhost',
  port: 8000,
  secure: false
}

class SocketConnection {
  /**
   * Constructor
   * @param {object} options All socketcluster-client.create options
   * @param {string} options.hostname
   * @param {number} options.port
   * @param {boolean} [options.secure]
   * @param {function} [socketEvents]
   */
  constructor(options = {}, socketEvents) {
    if (!options.hostname) throw new Error('hostname is required.')
    if (!options.port) throw new Error('port is required.')

    this._options = { ...options }
    this._socketEvents = socketEvents || this._defaultMsgSocketEvents
    this._socket = {}
  }

  /**
   * Display default message for undefined events
   */
  _defaultMsgSocketEvents() {
    console.warn('Socket event not defined.')
  }

  /**
   * Create socket connection
   */
  async start() {
    if (this._socket.state === 'open') return

    // Initiate the connection to the server
    this._socket = socketCluster.create(this._options)

    for await (let data of this._socket.listener('connect')) {
      console.info('Socket connected.', data)
    }
    for await (let data of this._socket.listener('disconnect')) {
      console.info('Socket disconnected.', data)
    }

    for await (let data of this._socket.listener('subscribeFail')) {
      console.error('Socket subscribeFail =>> ' + data)
    }
  }

  async subscribe(channel) {
    if (!this._socket) this.start()

    this._socket.subscribe(channel)

    for await (let data of this._socket.channel(channel)) {
      this._socketEvents(data)
    }
  }

  unsubscribe(channel) {
    this._socket.closeChannel(channel)
    this._socket.unsubscribe(channel)
  }

  // Remove socket
  destroy() {
    this._socket.closeAllChannels()
    this._socket.closeAllListeners()
    this._socket.disconnect()
  }
}

const socket = new SocketConnection(wsOptions, (data) => {
  console.log('socket', data)
})

export default socket