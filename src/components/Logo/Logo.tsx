import React from 'react'

import { ThemeType } from '@thorchain/asgardex-theme'

import {
  ThorswapBlackIcon,
  ThorswapWhiteIcon,
  ThorChainIcon,
  ThorswapMiniIcon,
} from 'components/Icons'

import { LogoWrapper } from './Logo.style'

export type Props = {
  type: 'thorchain' | 'thorswap'
  color?: ThemeType
  mini?: boolean
}

export const Logo = (props: Props) => {
  const { mini = false, type, color = ThemeType.DARK } = props

  return (
    <LogoWrapper>
      {mini && <ThorswapMiniIcon />}
      {!mini && type === 'thorchain' && <ThorChainIcon />}
      {!mini &&
        type === 'thorswap' &&
        (color === ThemeType.LIGHT ? (
          <ThorswapBlackIcon />
        ) : (
          <ThorswapWhiteIcon />
        ))}
    </LogoWrapper>
  )
}
