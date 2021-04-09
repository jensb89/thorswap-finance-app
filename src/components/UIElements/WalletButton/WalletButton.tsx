import React from 'react'

import { Grid } from 'antd'

import { Button, ButtonProps } from '../Button'

type ComponentProps = {
  connected?: boolean
  loading?: boolean
}

export type Props = ComponentProps & ButtonProps

export const WalletButton: React.FC<Props> = (props: Props): JSX.Element => {
  const { connected = false, loading = false, ...otherProps } = props
  const isDesktopView = Grid.useBreakpoint()?.sm ?? false

  const getBtnValue = () => {
    if (loading) return 'Loading...'

    if (!connected) {
      return (
        <span style={{ display: 'flex', alignItems: 'center' }}>Connect</span>
      )
    }

    if (connected) {
      if (isDesktopView) {
        return 'View Wallet'
      }

      return 'Wallet'
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
