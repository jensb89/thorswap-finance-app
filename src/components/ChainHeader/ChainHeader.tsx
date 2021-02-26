import React, { useCallback, useMemo } from 'react'

import { ExternalLink } from 'react-feather'

import { CopyOutlined } from '@ant-design/icons'
import { chainToString, Chain } from '@xchainjs/xchain-util'
import copy from 'copy-to-clipboard'

import { multichain } from 'services/multichain'

import * as Styled from './ChainHeader.style'

export type ChainHeaderProps = {
  chain: Chain
  address: string
  totalPrice?: string
  onReload?: () => void
}

export const ChainHeader = (props: ChainHeaderProps) => {
  const { chain, address, totalPrice = '0' } = props

  const miniAddress = useMemo(
    () => `${address.slice(0, 3)}...${address.slice(-3)}`,
    [address],
  )

  const accountUrl = useMemo(
    () => multichain.getExplorerAddressUrl(chain, address),
    [chain, address],
  )

  const handleCopyAddress = useCallback(() => {
    copy(address)
  }, [address])

  return (
    <Styled.Container>
      <Styled.ChainInfo>
        <Styled.InfoLabel weight="bold">
          {chainToString(chain)}
        </Styled.InfoLabel>
        <Styled.InfoLabel weight="bold">
          Total: ${totalPrice} USD
        </Styled.InfoLabel>
      </Styled.ChainInfo>
      <Styled.Address onClick={handleCopyAddress}>
        <Styled.AddressLabel weight="bold">{miniAddress}</Styled.AddressLabel>
        <CopyOutlined />
      </Styled.Address>
      <Styled.Tools>
        <a href={accountUrl} target="_blank" rel="noopener noreferrer">
          <Styled.ToolWrapper>
            <ExternalLink />
          </Styled.ToolWrapper>
        </a>
      </Styled.Tools>
    </Styled.Container>
  )
}
