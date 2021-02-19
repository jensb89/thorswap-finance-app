import React from 'react'

import { Coin } from 'midgard-sdk'
import { Asset, Amount } from 'multichain-sdk'

import { Label } from '../../UIElements/Label'
import { TxStatusWrapper, TxStatusContent, Seperator } from './TxStatus.style'

export type RoundValue = 'left' | 'right'

export type Props = {
  type: string
  data: Coin[]
  txID?: string
  round: RoundValue
}

export const TxStatus: React.FC<Props> = (props: Props): JSX.Element => {
  const { type, data, round, txID } = props
  const txURL = '#'

  const renderTxStatus = () => {
    return (
      <TxStatusWrapper className="txStatus-wrapper" round={round}>
        <p className="txStatus-type">{type}</p>
        {data.map((txDetail: Coin, index) => {
          const { asset, amount } = txDetail
          const assetValue = Asset.fromAssetString(asset)?.ticker ?? 'N/A'
          const amountValue = Amount.fromMidgard(amount).toFixed(2)

          return (
            <TxStatusContent className="tx-status-content" key={index}>
              <p className="txStatus-amount">{amountValue}</p>
              <p className="txStatus-asset">{assetValue}</p>
              {index < data.length - 1 ? <Seperator /> : ''}
            </TxStatusContent>
          )
        })}
        {!data.length && <Label color="gray">PENDING</Label>}
      </TxStatusWrapper>
    )
  }
  if (txID) {
    return (
      <a href={txURL} target="_blank" rel="noopener noreferrer">
        {renderTxStatus()}
      </a>
    )
  }
  return renderTxStatus()
}
