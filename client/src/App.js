import { useState } from 'react'
import { Menu } from 'antd'
import { CloudServerOutlined, HomeOutlined, WechatOutlined } from '@ant-design/icons'

function App() {
  const [route, setRoute] = useState('home')

  return (
    <div className="app">
      <Menu
        mode="horizontal"
        onClick={(e) => setRoute(e.key)}
        selectedKeys={[route]}
        items={[{
          label: 'Home',
          key: 'home',
          icon: <HomeOutlined />
        }, {
          label: 'Socker Servers',
          key: 'socketServer',
          icon: <CloudServerOutlined />
        }, {
          label: 'Chat',
          key: 'chat',
          icon: <WechatOutlined />
        }]}
      />
    </div>
  )
}

export default App
