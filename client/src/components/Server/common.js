import { Tag } from 'antd'

/**
 * SecureTag
 * @param {object} props
 * @param {boolean} props.secure
 */
export function SecureTag(props) {
  const { secure } = props

  const color = secure ? 'green' : 'red'
  const text = secure ? 'Secure' : 'Not Secure'

  return (
    <Tag
      color={color}
    >
      {text}
    </Tag>
  )
}

/**
 * MainServerTag
 * @param {object} props
 * @param {boolean} props.isMainServer
 */
export function MainServerTag(props) {
  const { isMainServer } = props
  if (!isMainServer) return ''

  return (
    <Tag
      color='magenta'
    >
      Main Server
    </Tag>
  )
}