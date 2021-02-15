import React from 'react'

import { Col } from 'antd'
import { Amount, Asset, Price } from 'multichain-sdk'

import * as Styled from './AssetData.style'

/**
 * AssetData - Component to show asset data in one row:
 *
 * |------|-------------------|-------------------|------------------|
 * | icon | ticker (optional) | amount (optional) | price (optional) |
 * |------|-------------------|-------------------|------------------|
 *
 */

export type Props = {
  asset: Asset
  amount?: Amount
  price?: Price
  size?: Styled.AssetDataSize
  showLabel?: boolean
}

export const AssetData: React.FC<Props> = (props): JSX.Element => {
  const {
    asset,
    amount,
    price,
    size = 'normal',
    showLabel = true,
    ...others
  } = props

  return (
    <Styled.Wrapper {...others}>
      <Col>
        <Styled.AssetIcon asset={asset} size={size} />
      </Col>
      {showLabel && (
        <Col>
          <Styled.TickerLabel size={size}>{asset.ticker}</Styled.TickerLabel>
        </Col>
      )}
      {!!amount && (
        <Col>
          <Styled.AmountLabel size={size}>
            {amount.toFixed(2)}
          </Styled.AmountLabel>
        </Col>
      )}
      {!!price && (
        <Col>
          <Styled.PriceLabel size={size}>{price.toFixed(2)}</Styled.PriceLabel>
        </Col>
      )}
    </Styled.Wrapper>
  )
}
