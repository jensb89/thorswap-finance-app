import React from 'react'

import { ActionTypeEnum, Action } from 'midgard-sdk'
import { AmountType, Percent } from 'multichain-sdk'

import { TxStatus } from '../TxStatus'
import { TxInfoWrapper, Seperator, Dash } from './TxInfo.style'

type Props = {
  data: Action
}

export const TxInfo: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    data: { type, metadata, in: inData, out: outData },
  } = props

  // swap tx
  const slipValueLabel = new Percent(
    Number(metadata?.swap?.tradeSlip ?? 0) / 100,
    AmountType.BASE_AMOUNT,
  ).toFixed(3)

  return (
    <TxInfoWrapper className="txInfo-wrapper swap-tx">
      <div className="txInfo-main-data">
        <TxStatus type="in" data={inData} round="left" />
        <Seperator />
        <TxStatus type="out" data={outData} round="right" />
      </div>
      {type === ActionTypeEnum.Swap && (
        <div className="txInfo-extra-data">
          <Dash />
          <div className="tx-event-label">
            <p className="tx-event-title">SLIP</p>
            <p className="tx-event-value">{slipValueLabel}</p>
          </div>
        </div>
      )}
    </TxInfoWrapper>
  )
}
