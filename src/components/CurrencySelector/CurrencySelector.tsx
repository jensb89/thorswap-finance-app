import React, { useCallback, useMemo } from 'react'

import { DownOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { Asset } from 'multichain-sdk'

import { Menu, Label, IconButton } from '../UIElements'
import * as Styled from './CurrencySelector.style'

export type CurrencySelectorProps = {
  selected: Asset
  currencies: Asset[]
  onSelect?: (asset: Asset) => void
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selected,
  currencies,
  onSelect = () => {},
}: CurrencySelectorProps): JSX.Element => {
  const handleSelect = useCallback(
    ({ key }) => {
      const asset = Asset.fromAssetString(key) || Asset.USD()
      onSelect(asset)
    },
    [onSelect],
  )

  const menu = useMemo(
    () => (
      <Menu onClick={handleSelect} selectedKeys={[selected.toString()]}>
        {currencies.map((currencyAsset: Asset) => {
          const { ticker } = currencyAsset
          return <Menu.Item key={currencyAsset.toString()}>{ticker}</Menu.Item>
        })}
      </Menu>
    ),
    [selected, currencies, handleSelect],
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <IconButton>
        <Styled.DropdownLink className="ant-dropdown-link" href="/">
          <Label weight="bold">{selected.ticker}</Label>
          <DownOutlined />
        </Styled.DropdownLink>
      </IconButton>
    </Dropdown>
  )
}
