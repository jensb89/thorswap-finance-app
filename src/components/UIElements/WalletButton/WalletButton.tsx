import React from 'react'

import { Button, ButtonProps } from '../Button'

type ComponentProps = {
  connected?: boolean
}

export type Props = ComponentProps & ButtonProps

export const WalletButton: React.FC<Props> = (props: Props): JSX.Element => {
  const { connected = '', ...otherProps } = props

  const getBtnValue = () => {
    if (!connected) {
      return (
        <span style={{ display: 'flex', alignItems: 'center' }}>Connect</span>
      )
    }

    if (connected) {
      return 'View Wallet'
    }
  }

  return (
    <Button
      sizevalue="normal"
      color={connected ? 'primary' : 'warning'}
      round
      fixedWidth={false}
      {...otherProps}
    >
      {getBtnValue()}
    </Button>
  )
}
