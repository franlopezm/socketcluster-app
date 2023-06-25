import { useState, useEffect, useCallback } from 'react'
import { Badge, Table, Button } from 'antd'
import axios from 'axios'

import { ENDPOINT, SERVER_DEFAULT } from '../../constants/serverInfo'
import { SecureTag, MainServerTag } from './common'

function ListServers(props) {
  const { onClick } = props

  const [servers, setServers] = useState([])
  const [serverKey, setServerKey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const getServers = useCallback(
    async (server) => {
      try {
        const { data } = await axios({
          method: 'get',
          baseURL: server || SERVER_DEFAULT,
          url: ENDPOINT.socket.serversAvailable
        })

        setServers(data)
      } catch ({ response }) {
        console.error(response?.config.url, response?.status, response?.data)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(
    () => {
      getServers()
    },
    [getServers]
  )

  const onSelectedRow = useCallback(
    (rowselected, infoRows) => {
      if (rowselected.length && serverKey?.[0] !== rowselected[0]) {
        const newSelected = infoRows.pop()

        setServerKey(newSelected.key)
        onClick(newSelected)
      } else {
        setServerKey(null)
        onClick(null)
      }
    },
    [onClick, serverKey]
  )

  const onReload = useCallback(
    () => {
      setIsLoading(true)
      getServers()
    },
    [getServers]
  )

  return (
    <div className='servers__list'>
      <div className='servers__list-header'>
        <div>
          <span className='servers__list-title-info'>Avaible servers</span>
          <Badge
            count={servers.length}
            style={{
              backgroundColor: '#52c41a',
              fontWeight: 'bold'
            }}
          />
        </div>
        <div>
          <Button
            type='primary'
            onClick={onReload}
            loading={isLoading}
            disabled={isLoading}
          >
            Reload
          </Button>
        </div>
      </div>
      <div className='servers__list-table'>
        <Table
          loading={isLoading}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => onSelectedRow([record.key], [record])
            }
          }}
          rowSelection={{
            selectedRowKeys: serverKey ? [serverKey] : serverKey,
            hideSelectAll: true,
            onChange: onSelectedRow,
            type: 'radio'
          }}
          columns={[{
            key: 'host',
            title: 'Host',
            dataIndex: 'host'
          }, {
            key: 'port',
            title: 'Port',
            dataIndex: 'port'
          }, {
            key: 'secure',
            title: 'Secure',
            dataIndex: 'secure',
            render: (_, { secure }) => {
              return (
                <SecureTag secure={secure} />
              )
            }
          }, {
            key: 'url',
            title: 'Url',
            dataIndex: 'url'
          }, {
            key: 'isMainServer',
            title: 'Main Server',
            dataIndex: 'isMainServer',
            render: (_, { isMainServer }) => {
              return (
                <MainServerTag
                  isMainServer={isMainServer}
                />
              )
            }
          }]}
          dataSource={
            servers.map((e, idx) => {
              e.key = idx.toString()
              return e
            })
          }
        />
      </div>
    </div>
  )
}

export default ListServers
