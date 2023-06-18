import { useCallback, useState } from 'react'
import { Menu, Layout } from 'antd'

import Routes from './components/Routes'
import { MENU_ITEMS, MENU_KEYS, ROUTES_KEY } from './constants/routes'
import { MenuStorage } from './services/LocalStorage'

const { Header, Content } = Layout

const menuKeyInStorage = MenuStorage.get()
const START_ROUTE = MENU_KEYS.includes(menuKeyInStorage)
  ? menuKeyInStorage : ROUTES_KEY.home

function App() {
  const [route, setRoute] = useState(START_ROUTE)

  const onChangeRoute = useCallback(
    (e) => {
      const key = e.key

      if (MENU_KEYS.includes(key)) {
        setRoute(key)
        MenuStorage.set(key)
      }
    }, [setRoute]
  )

  return (
    <Layout className='layout-main' >
      <Header className='header-main' >
        <Menu
          mode="horizontal"
          onClick={onChangeRoute}
          selectedKeys={[route]}
          items={MENU_ITEMS}
        />
      </Header>

      <Content className='content-main'>
        <Routes
          currentRoute={route}
        />
      </Content>
    </Layout>
  )
}

export default App
