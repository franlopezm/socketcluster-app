import { useState, useCallback } from 'react'
import './style.css'

import ListServers from './ListServers'
import SocketInfo from './SocketInfo'

function Server() {
  const [server, setServer] = useState(null)

  const onClick = useCallback(
    (serverInfo) => {
      console.log("file: index.js:14 ~ Server ~ serverInfo:", serverInfo)
      setServer(serverInfo)
    },
    []
  )

  return (
    <div className="servers">
      <ListServers
        onClick={onClick}
      />

      - Al pulsar un servidor información sobre este. /socket/status
      health, etc
      {
        server
          ? (
            <SocketInfo
              server={server}
            />
          )
          : null
      }
    </div>
  )
}

export default Server
