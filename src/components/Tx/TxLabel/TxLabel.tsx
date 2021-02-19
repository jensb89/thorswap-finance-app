import React from 'react'

import {
  SwapOutlined,
  DoubleRightOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { ActionTypeEnum } from 'midgard-sdk'

import { TxLabelWrapper } from './TxLabel.style'

type Props = {
  type?: ActionTypeEnum
}

export const TxLabel: React.FC<Props> = (props: Props): JSX.Element => {
  const { type } = props
  let label = ''
  let TxIcon = <SwapOutlined />

  if (type === ActionTypeEnum.Swap) {
    label = 'swap'
    TxIcon = <SwapOutlined />
  }

  if (type === ActionTypeEnum.Withdraw) {
    label = 'withdraw'
    TxIcon = <ImportOutlined />
  }

  if (type === ActionTypeEnum.AddLiquidity) {
    label = 'add liquidity'
    TxIcon = <DoubleRightOutlined />
  }

  return (
    <TxLabelWrapper className="txLabel-wrapper">
      <p>{label}</p>
      <div className="tx-label-icon">{TxIcon}</div>
    </TxLabelWrapper>
  )
}
