export const SERVER_DEFAULT = process.env.REACT_SERVER_DEFAULT || "http://localhost:8080"

export const ENDPOINT = {
  message: {
    send: '/message',
    sendSync: '/message/sync',
  },
  socket: {
    status: '/socket/status',
    serversAvailable: '/socket/servers/availables'
  },
  server: {
    health: '/health'
  }
}