import React from 'react'

import { ThemeType } from '@thorchain/asgardex-theme'

import {
  ThorswapBlackIcon,
  ThorswapWhiteIcon,
  ThorChainIcon,
} from 'components/Icons'

import { LogoWrapper } from './Logo.style'

export type Props = {
  type: 'thorchain' | 'thorswap'
  color?: ThemeType
}

export const Logo = (props: Props) => {
  const { type, color = ThemeType.DARK } = props

  return (
    <LogoWrapper>
      {type === 'thorchain' && <ThorChainIcon />}
      {type === 'thorswap' &&
        (color === ThemeType.LIGHT ? (
          <ThorswapBlackIcon />
        ) : (
          <ThorswapWhiteIcon />
        ))}
    </LogoWrapper>
  )
}
