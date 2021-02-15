import React from 'react'

import { AsgardexIcon, ThorChainIcon } from 'components/Icons'

import { LogoWrapper } from './Logo.style'

export type Props = {
  type: 'thorchain' | 'asgardex'
}

export const Logo = (props: Props) => {
  const { type } = props

  return (
    <LogoWrapper>
      {type === 'thorchain' ? <ThorChainIcon /> : <AsgardexIcon />}
    </LogoWrapper>
  )
}
