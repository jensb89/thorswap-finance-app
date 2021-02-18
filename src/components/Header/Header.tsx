import React, { useCallback, useState } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { useGlobalState } from 'redux/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetwork from 'hooks/useNetwork'

import { CONNECT_WALLET_ROUTE, HOME_ROUTE } from 'settings/constants'

import { Logo } from '../Logo'
import { NetworkStatus } from '../NetworkStatus'
import { Refresh } from '../Refresh'
import { ThemeSwitch } from '../ThemeSwitch'
import { WalletButton, Label } from '../UIElements'
import { WalletDrawer } from '../WalletDrawer'
import * as Styled from './Header.style'

export const Header = () => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { refreshPage } = useGlobalState()
  const { isValidFundCaps, globalRunePooledStatus, statusColor } = useNetwork()

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
        <NetworkStatus status={statusColor} />
      </Styled.HeaderLogo>

      <Styled.HeaderCenterWrapper>
        <Label weight="bold">
          {globalRunePooledStatus} {!isValidFundCaps && '(Funds Cap Reached)'}
        </Label>
      </Styled.HeaderCenterWrapper>
      <Styled.HeaderAction>
        <ThemeSwitch />
        <WalletButton onClick={handleClickWalletBtn} connected={isConnected} />
        <WalletDrawer visible={drawerVisible} onClose={handleCloseDrawer} />
        <Refresh onRefresh={refreshPage} />
      </Styled.HeaderAction>
    </Styled.HeaderContainer>
  )
}
