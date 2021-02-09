import React from 'react'

import { FolderAddFilled } from '@ant-design/icons'

import Button, { Props as ButtonProps } from '../Button'

type ComponentProps = {
  connected?: boolean
  address?: string
}

export type Props = ComponentProps & ButtonProps

const WalletButton: React.FC<Props> = (props: Props): JSX.Element => {
  const { connected = false, address = '', ...otherProps } = props

  const getBtnValue = () => {
    if (!connected) {
      return (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FolderAddFilled
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
      if (address && address.length > 9) {
        const first = address.substr(0, 6)
        const last = address.substr(address.length - 3, 3)
        return `${first}...${last}`
      }
      return address
    }
  }

  return (
    <Button sizevalue="normal" round {...otherProps}>
      {getBtnValue()}
    </Button>
  )
}

export default WalletButton
