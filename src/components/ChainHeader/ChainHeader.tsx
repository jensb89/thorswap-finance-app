import React, { useCallback } from 'react'

import { SyncOutlined, CopyOutlined } from '@ant-design/icons'
import { Chain } from '@xchainjs/xchain-util'
import copy from 'copy-to-clipboard'

import * as Styled from './ChainHeader.style'

export type ChainHeaderProps = {
  chain: Chain
  address: string
  onReload?: () => void
}

export const ChainHeader = (props: ChainHeaderProps) => {
  const { chain, address, onReload = () => {} } = props

  const miniAddress = `${address.slice(0, 3)}...${address.slice(-3)}`

  const handleCopyAddress = useCallback(() => {
    copy(address)
  }, [address])

  return (
    <Styled.Container>
      <Styled.ChainInfo>
        <Styled.InfoLabel weight="bold">{chain} Chain</Styled.InfoLabel>
        <Styled.InfoLabel weight="bold">Total: 0</Styled.InfoLabel>
      </Styled.ChainInfo>
      <Styled.Address onClick={handleCopyAddress}>
        <Styled.AddressLabel weight="bold">{miniAddress}</Styled.AddressLabel>
        <CopyOutlined />
      </Styled.Address>
      <Styled.Reload onClick={onReload}>
        <SyncOutlined />
      </Styled.Reload>
    </Styled.Container>
  )
}
