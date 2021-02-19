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
    data: { type, metadata, in: _in, out },
  } = props

  // swap tx
  if (type === ActionTypeEnum.Swap) {
    const inData = _in?.[0].coins?.[0]
    const outData = out?.[0]?.coins?.[0]
    const slipValueLabel = new Percent(
      Number(metadata?.swap?.tradeSlip ?? 0) / 100,
      AmountType.BASE_AMOUNT,
    ).toFixed(3)

    return (
      <TxInfoWrapper className="txInfo-wrapper swap-tx">
        <div className="txInfo-main-data">
          <TxStatus
            type="in"
            data={inData ? [inData] : []}
            txID={_in?.[0].txID}
            round="left"
          />
          <Seperator />
          <TxStatus
            type="out"
            data={outData ? [outData] : []}
            txID={out?.[0]?.txID}
            round="right"
          />
        </div>
        <div className="txInfo-extra-data">
          <Dash />
          <div className="tx-event-label">
            <p className="tx-event-title">SLIP</p>
            <p className="tx-event-value">{slipValueLabel}</p>
          </div>
        </div>
      </TxInfoWrapper>
    )
  }

  // withdraw tx
  if (type === ActionTypeEnum.Withdraw) {
    const outData1 = out?.[0]?.coins?.[0]
    const outData2 = out?.[1]?.coins?.[0]
    const outData = outData1 && outData2 ? [outData1, outData2] : []

    return (
      <TxInfoWrapper className="txInfo-wrapper withdraw-tx">
        <div className="txInfo-main-data">
          <TxStatus
            type="out"
            data={outData || []}
            txID={out?.[0]?.txID}
            round="right"
          />
        </div>
      </TxInfoWrapper>
    )
  }

  // stake tx
  if (type === ActionTypeEnum.AddLiquidity) {
    const inData1 = _in?.[0].coins?.[0]
    const inData2 = _in?.[0].coins?.[1]
    // eslint-disable-next-line no-nested-ternary
    const inData =
      inData1 && inData2 ? [inData1, inData2] : inData1 ? [inData1] : []

    return (
      <TxInfoWrapper className="txInfo-wrapper stake-tx">
        <div className="txInfo-main-data">
          <TxStatus type="in" data={inData} txID={_in?.[0].txID} round="left" />
        </div>
      </TxInfoWrapper>
    )
  }
  return <TxInfoWrapper className="txInfo-wrapper" />
}
