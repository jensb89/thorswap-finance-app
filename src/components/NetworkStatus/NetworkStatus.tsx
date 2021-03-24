import React, { useMemo } from 'react'

import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Row } from 'antd'

import { midgardApi } from 'services/midgard'

import { getHostnameFromUrl } from 'helpers/api'

import { StatusBadge, Menu, Label, IconButton } from '../UIElements'
import * as Styled from './NetworkStatus.style'

type MenuItem = {
  key: string
  label: string
  url?: string
  status: 'red' | 'yellow' | 'green'
}

type Props = {
  status: 'red' | 'yellow' | 'green'
}

// TODO: implement outbound queue level

export const NetworkStatus: React.FC<Props> = ({
  status: globalStatus,
}: Props): JSX.Element => {
  // Midgard IP on devnet OR on test|chaos|mainnet
  const midgardUrl = getHostnameFromUrl(midgardApi.getBaseUrl()) || ''

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: 'midgard_api',
        label: 'Midgard',
        url: midgardUrl,
        status: 'green',
      },
      {
        key: 'thornode',
        label: 'THORNODE',
        url: 'OK',
        status: 'green',
      },
    ],
    [midgardUrl],
  )

  const menu = useMemo(
    () => (
      <Menu
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        className="connection-menu-items"
      >
        {menuItems.map((item) => {
          const { label, key, status, url } = item
          return (
            <Menu.Item
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 10px',
              }}
              key={key}
            >
              <StatusBadge color={status} />
              <Styled.StatusItem>
                <Row>
                  <Label weight="bold">{label}</Label>
                </Row>
                <Row>
                  <span
                    style={{
                      paddingLeft: '10px',
                      color: '#808080',
                      textTransform: 'lowercase',
                    }}
                  >
                    {url || 'unknown'}
                  </span>
                </Row>
              </Styled.StatusItem>
            </Menu.Item>
          )
        })}
      </Menu>
    ),
    [menuItems],
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <IconButton>
        <Styled.DropdownLink className="ant-dropdown-link" href="/">
          <StatusBadge color={globalStatus} />
          <DownOutlined />
        </Styled.DropdownLink>
      </IconButton>
    </Dropdown>
  )
}
