import { useState, useCallback } from 'react'
import './style.css'

import ListServers from './ListServers'
import ServerInfo from './ServerInfo'

function Server() {
  const [server, setServer] = useState(null)

  const onClick = useCallback(
    (serverInfo) => {
      setServer(serverInfo)
    },
    []
  )

  return (
    <div className="servers">
      <ListServers
        onClick={onClick}
      />
      {
        server
          ? (
            <ServerInfo
              server={server}
            />
          )
          : null
      }
    </div>
  )
}

export default Server
