import { useCallback, useState } from 'react'
import { Menu } from 'antd'

import { MENU_ITEMS, MENU_KEYS } from './constants/routes'
import { MenuStorage } from './services/LocalStorage'

function App() {
  const [route, setRoute] = useState(MenuStorage.get())

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
    <div className="app">
      <Menu
        mode="horizontal"
        onClick={onChangeRoute}
        selectedKeys={[route]}
        items={MENU_ITEMS}
      />
    </div>
  )
}

export default App
