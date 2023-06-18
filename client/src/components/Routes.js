import { ROUTES_KEY } from '../constants/routes'

import Home from './Home'
import Chat from './Chat'
import SocketServer from './SocketServer'

const routes = {
  [ROUTES_KEY.home]: <Home />,
  [ROUTES_KEY.chat]: <Chat />,
  [ROUTES_KEY.socketServer]: <SocketServer />
}

function Routes(props) {
  const { currentRoute } = props

  const component = routes[currentRoute]
  if (component) return component

  return <Home />
}

export default Routes
