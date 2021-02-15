import React, { useCallback } from 'react'

import { useHistory } from 'react-router'

import { Logo } from 'components/Logo'
import { ThemeSwitch } from 'components/ThemeSwitch'
import { WalletButton } from 'components/UIElements/WalletButton'
import { CONNECT_ROUTE } from 'settings/constants'

import * as Styled from './Header.style'

export const Header = () => {
  const history = useHistory()

  const handleClickWalletBtn = useCallback(() => {
    history.push(CONNECT_ROUTE)
  }, [history])

  return (
    <Styled.HeaderContainer>
      <Styled.HeaderLogo>
        <Logo type="asgardex" />
      </Styled.HeaderLogo>
      <Styled.HeaderAction>
        <WalletButton onClick={handleClickWalletBtn} />
        <ThemeSwitch />
      </Styled.HeaderAction>
    </Styled.HeaderContainer>
  )
}
