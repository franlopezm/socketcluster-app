import { CloudServerOutlined, HomeOutlined, WechatOutlined } from '@ant-design/icons'

export const MENU_ITEMS = [{
  label: 'Home',
  key: 'home',
  icon: <HomeOutlined />
}, {
  label: 'Servers',
  key: 'server',
  icon: <CloudServerOutlined />
}, {
  label: 'Chat',
  key: 'chat',
  icon: <WechatOutlined />
}]

export const MENU_KEYS = MENU_ITEMS.map(e => e.key)

export const ROUTES_KEY = {
  home: 'home',
  server: 'server',
  chat: 'chat'
}