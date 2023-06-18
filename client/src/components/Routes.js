import { ROUTES_KEY } from '../constants/routes'

import Home from './Home'
import Chat from './Chat'
import Server from './Server'

const routes = {
  [ROUTES_KEY.home]: <Home />,
  [ROUTES_KEY.chat]: <Chat />,
  [ROUTES_KEY.server]: <Server />
}

function Routes(props) {
  const { currentRoute } = props

  const component = routes[currentRoute]
  if (component) return component

  return <Home />
}

export default Routes
