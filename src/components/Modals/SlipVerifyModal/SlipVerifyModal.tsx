import React from 'react'

import { ModalProps } from 'antd/lib/modal'

import { VerifyModal } from '../VerifyModal'

export interface Props extends ModalProps {
  slipPercent?: number
  onConfirm?: () => void
}

export const SlipVerifyModal: React.FC<Props> = (props: Props): JSX.Element => {
  const { slipPercent = 30, onConfirm = () => {}, ...otherProps } = props

  const slipPercentNum = slipPercent.toFixed(0)

  const verifyLevel = slipPercent > 10 ? 'high' : 'normal'
  const description =
    verifyLevel === 'high'
      ? `The slip is ${slipPercentNum}%, Please Type CONFIRM to continue.`
      : `The slip is ${slipPercentNum}%, Are you sure you want to continue?`

  return (
    <VerifyModal
      title="SLIP CONFIRMATION"
      verifyLevel={verifyLevel}
      description={description}
      onConfirm={onConfirm}
      {...otherProps}
    />
  )
}
