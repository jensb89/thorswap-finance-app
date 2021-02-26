import React from 'react'

import { Transaction } from 'midgard-sdk'
import { Asset, Amount } from 'multichain-sdk'

import { multichain } from 'services/multichain'

import { Label } from '../../UIElements/Label'
import { TxStatusWrapper, TxStatusContent, Seperator } from './TxStatus.style'

export type RoundValue = 'left' | 'right'

export type Props = {
  type: string
  data: Transaction[]
  round: RoundValue
}

export const TxStatus: React.FC<Props> = (props: Props): JSX.Element => {
  const { type, data, round } = props

  return (
    <TxStatusWrapper className="txStatus-wrapper" round={round}>
      <p className="txStatus-type">{type}</p>
      {data.map((txObj: Transaction, index: number) => {
        const txHash = txObj.txID
        const coinAsset = txObj.coins?.[0]

        if (!coinAsset) {
          return (
            <TxStatusContent className="tx-status-content" key={index}>
              <Label color="gray">N/A</Label>
            </TxStatusContent>
          )
        }

        const { asset: assetName, amount } = coinAsset
        const assetObj = Asset.fromAssetString(assetName)
        const assetValue = assetObj?.ticker ?? 'N/A'
        const amountValue = Amount.fromMidgard(amount).toFixed(3)

        const txUrl = assetObj
          ? multichain.getExplorerTxUrl(assetObj.chain, txHash)
          : '#'

        return (
          <a href={txUrl} target="_blank" rel="noopener noreferrer" key={index}>
            <TxStatusContent className="tx-status-content" key={index}>
              <p className="txStatus-amount">{amountValue}</p>
              <p className="txStatus-asset">{assetValue}</p>
              {index < data.length - 1 ? <Seperator /> : ''}
            </TxStatusContent>
          </a>
        )
      })}
    </TxStatusWrapper>
  )
}
