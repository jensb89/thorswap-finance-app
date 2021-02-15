import React, { useCallback } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { Logo } from 'components/Logo'
import { ThemeSwitch } from 'components/ThemeSwitch'
import { WalletButton } from 'components/UIElements/WalletButton'

import { CONNECT_WALLET_ROUTE, HOME_ROUTE } from 'settings/constants'

import * as Styled from './Header.style'

export const Header = () => {
  const history = useHistory()

  const handleClickWalletBtn = useCallback(() => {
    history.push(CONNECT_WALLET_ROUTE)
  }, [history])

  return (
    <Styled.HeaderContainer>
      <Styled.HeaderLogo>
        <Link to={HOME_ROUTE}>
          <Logo type="asgardex" />
        </Link>
      </Styled.HeaderLogo>
      <Styled.HeaderAction>
        <WalletButton onClick={handleClickWalletBtn} />
        <ThemeSwitch />
      </Styled.HeaderAction>
    </Styled.HeaderContainer>
  )
}
