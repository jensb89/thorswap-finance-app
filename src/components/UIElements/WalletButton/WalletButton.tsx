import React from 'react'

import { PlusOutlined } from '@ant-design/icons'

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
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined
            style={{
              marginRight: '6px',
              top: '1px',
              position: 'relative',
            }}
          />
          Add Wallet
        </span>
      )
    }

    if (connected) {
      return 'View Wallet'
    }
  }

  return (
    <Button sizevalue="normal" round fixedWidth={false} {...otherProps}>
      {getBtnValue()}
    </Button>
  )
}
