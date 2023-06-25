const Redis = require('ioredis')

class Cache {
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
   * Add server info to redis list
   * @param {string} serverIdentifier
   * @param {object} serverInfo
   * @param {string} serverInfo.host
   * @param {string|number} serverInfo.port
   * @param {string} serverInfo.url
   * @param {boolean} [serverInfo.secure]
   * @param {boolean} [serverInfo.isMainServer]
   *
   * @returns Promise<boolean>
   */
  async addServerInfo(serverIdentifier, serverInfo) {
    if (!serverIdentifier) return false
    if (!serverInfo) return false
    if (!Object.keys(serverInfo).length) return false

    await this._client.hset(
      'available_servers',
      {
        [serverIdentifier]: JSON.stringify(serverInfo)
      }
    )

    return true
  }

  /**
   * delete server info to redis list
   * @param {string} serverIdentifier
   *
   * @returns Promise<boolean>
   */
  async deleteServerInfo(serverIdentifier) {
    if (!serverIdentifier) return false

    if (this._client) {
      await this._client.hdel('available_servers', serverIdentifier)
    }

    return true
  }

  /**
   * Get server info to redis list
   * @param {string} serverIdentifier
   *
   * @returns Promise<object>
   */
  async getServerInfo(serverIdentifier) {
    if (!serverIdentifier) return false

    const data = await this._client.hget('available_servers', serverIdentifier)

    return data ? JSON.parse(data) : data
  }

  /**
   * Get all server info to redis list
   * @returns Promise<[object]>
   */
  async getAllServersInfo() {
    const data = await this._client.hgetall('available_servers')
    if (!data || !Object.keys(data).length) return []

    return Object.values(data).map(d => JSON.parse(d))
  }
}

module.exports = new Cache()