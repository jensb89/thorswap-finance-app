import React, { useCallback, useState } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { ThemeSwitch, WalletButton, WalletDrawer } from 'components'

import { Logo } from 'components/Logo'

import { useWallet } from 'redux/wallet/hooks'

import { CONNECT_WALLET_ROUTE, HOME_ROUTE } from 'settings/constants'

import * as Styled from './Header.style'

export const Header = () => {
  const history = useHistory()
  const { wallet } = useWallet()

  const [drawerVisible, setDrawerVisible] = useState(false)

  const isConnected = !!wallet

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected) {
      history.push(CONNECT_WALLET_ROUTE)
    } else {
      setDrawerVisible(true)
    }
  }, [history, isConnected])

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false)
  }, [])

  return (
    <Styled.HeaderContainer>
      <Styled.HeaderLogo>
        <Link to={HOME_ROUTE}>
          <Logo type="asgardex" />
        </Link>
      </Styled.HeaderLogo>
      <Styled.HeaderAction>
        <WalletButton onClick={handleClickWalletBtn} connected={isConnected} />
        <WalletDrawer visible={drawerVisible} onClose={handleCloseDrawer} />
        <ThemeSwitch />
      </Styled.HeaderAction>
    </Styled.HeaderContainer>
  )
}
