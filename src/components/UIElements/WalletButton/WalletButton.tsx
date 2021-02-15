import React from 'react'

import { PlusOutlined } from '@ant-design/icons'

import { Button, ButtonProps } from '../Button'

type ComponentProps = {
  address?: string
}

export type Props = ComponentProps & ButtonProps

export const WalletButton: React.FC<Props> = (props: Props): JSX.Element => {
  const { address = '', ...otherProps } = props

  const getBtnValue = () => {
    if (!address) {
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

    if (address) {
      if (address && address.length > 9) {
        const first = address.substr(0, 6)
        const last = address.substr(address.length - 3, 3)
        return `${first}...${last}`
      }
      return address
    }
  }

  return (
    <Button sizevalue="normal" round fixedWidth={false} {...otherProps}>
      {getBtnValue()}
    </Button>
  )
}
