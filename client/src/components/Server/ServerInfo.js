import { useEffect, useCallback, useState } from "react"
import axios from 'axios'
import { Space, Spin, Button, Descriptions, Badge, Statistic, List } from 'antd'

import { ENDPOINT } from '../../constants/serverInfo'
import { SecureTag, MainServerTag } from './common'

/**
 * Socket info
 * @param {object} props
 * @param {object} props.server
 * @param {string} props.server.url
 * @param {string} props.server.host
 * @param {string|number} props.server.port
 * @param {boolean} [props.server.secure]
 * @param {boolean} [props.server.isMainServer]
 */
function ServerInfo(props) {
  const { server } = props
  const { url, host, port, secure, isMainServer } = server

  const [state, setState] = useState(null)

  const getServerInfo = useCallback(
    async () => {
      try {
        if (url) {
          const [healthStatus, socketInfo] = await Promise.all([
            await axios({
              method: 'get',
              baseURL: url,
              url: ENDPOINT.server.health
            }),
            await axios({
              method: 'get',
              baseURL: url,
              url: ENDPOINT.socket.status
            })
          ])

          setState({
            isOk: true,
            health: healthStatus.data,
            socketInfo: socketInfo.data
          })
        } else {
          setState({ isKO: true })
        }
      } catch ({ response }) {
        console.error(response?.config.url, response?.status, response?.data)
        setState({ isKO: true })
      }
    },
    [url]
  )

  useEffect(
    () => {
      getServerInfo()
    },
    [getServerInfo]
  )

  return (
    <div className="server__info">
      <Space>
        <Spin
          tip="Loading..."
          spinning={!state}
        >
          <Descriptions
            bordered
            title={`Server Information`}
            size="small"
            extra={
              <Button type="primary">Refresh</Button>}
          >
            <Descriptions.Item
              label="Status"
              span="3"
            >
              <Badge
                text={state?.health?.success ? 'Available' : 'Not Available'}
                color={state?.health?.success ? 'green' : 'red'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="URL">{url}</Descriptions.Item>
            <Descriptions.Item label="Host">{host}</Descriptions.Item>
            <Descriptions.Item label="Port">{port}</Descriptions.Item>
            <Descriptions.Item
              label="Main Server"
            >
              <MainServerTag isMainServer={isMainServer} />
            </Descriptions.Item>
            <Descriptions.Item label="Secure">
              <SecureTag secure={secure} />
            </Descriptions.Item>
            <Descriptions.Item>
            </Descriptions.Item>
            <Descriptions.Item
              label="Connected Clients"
              span="3"
            >
              <Statistic
                decimalSeparator=','
                groupSeparator='.'
                className='server__info-statistic'
                value={state?.socketInfo?.connectedClients || 0}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Pending Clients"
              span="3"
            >
              <Statistic
                decimalSeparator=','
                groupSeparator='.'
                className='server__info-statistic'
                value={state?.socketInfo?.pendingClients || 0}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Client identifiers"
              span="3"
            >
              <List
                size="small"
                itemLayout='vertical'
                dataSource={state?.socketInfo?.clients || ['pepito']}
                renderItem={
                  (item) => (
                    <List.Item
                      className="server__info-list__item"
                    >
                      {item}
                    </List.Item>
                  )
                }
              />
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Space>
    </div>
  )
}

export default ServerInfo