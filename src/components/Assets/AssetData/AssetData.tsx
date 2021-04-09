import React, { useMemo } from 'react'

import { Col } from 'antd'
import { Amount, Asset, Price } from 'multichain-sdk'

import * as Styled from './AssetData.style'

/**
 * AssetData - Component to show asset data in one row:
 *
 * |------|-------------------|-------------------|------------------|
 * | icon | ticker (optional) | amount (optional) | price (optional) |
 *          chain
 * |------|-------------------|-------------------|------------------|
 *
 */

export type Props = {
  asset: Asset
  amount?: Amount
  price?: Price
  size?: Styled.AssetDataSize
  showLabel?: boolean
  decimal?: number
}

export const AssetData: React.FC<Props> = (props): JSX.Element => {
  const {
    asset,
    amount,
    price,
    size = 'normal',
    showLabel = true,
    decimal = 2,
    ...others
  } = props

  const labelSize = useMemo(() => {
    if (size === 'big') return 'large'
    return 'big'
  }, [size])

  return (
    <Styled.Wrapper {...others}>
      <Col>
        <Styled.AssetIcon asset={asset} size={size} />
      </Col>
      {showLabel && (
        <Col>
          <Styled.TickerRow>
            <Styled.TickerLabel size={labelSize}>
              {asset.ticker}
            </Styled.TickerLabel>
            <Styled.TypeLabel>{asset.type}</Styled.TypeLabel>
          </Styled.TickerRow>
        </Col>
      )}
      {!!amount && (
        <Col>
          <Styled.AmountLabel size={labelSize}>
            {amount.toFixed(decimal)}
          </Styled.AmountLabel>
        </Col>
      )}
      {!!price && (
        <Col>
          <Styled.PriceLabel size={labelSize}>
            {price.toFixed(2)}
          </Styled.PriceLabel>
        </Col>
      )}
    </Styled.Wrapper>
  )
}
