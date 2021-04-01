import React from 'react'

import { Repeat } from 'react-feather'

import { Asset, Price } from 'multichain-sdk'

import { Information } from '../UIElements'
import * as Styled from './PriceRate.style'

export const PriceRate = ({
  price,
  inputAsset,
  outputAsset,
}: {
  price?: Price
  inputAsset?: Asset
  outputAsset?: Asset
}) => {
  const [reverted, setReverted] = React.useState(false)

  const toggle = React.useCallback(() => {
    setReverted(!reverted)
  }, [reverted])

  const rateDesc = React.useMemo(() => {
    if (!price || !inputAsset || !outputAsset) {
      return ''
    }

    if (reverted) {
      return `1 ${outputAsset.ticker} = ${price.toFixedRaw(6)} ${
        inputAsset.ticker
      }`
    }
    return `1 ${inputAsset.ticker} = ${price.toFixedInverted(6)} ${
      outputAsset.ticker
    }`
  }, [reverted, price, inputAsset, outputAsset])

  return (
    <Styled.Container>
      <Information title="Rate" description={rateDesc} />
      <Styled.ReverseBtn onClick={toggle}>
        <Repeat size={10} />
      </Styled.ReverseBtn>
    </Styled.Container>
  )
}
