import React, { useCallback, useState, useEffect } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { Asset } from 'multichain-sdk'

import { CurrencySelector } from 'components/CurrencySelector'

import { useApp } from 'redux/app/hooks'
import { useGlobalState } from 'redux/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetwork from 'hooks/useNetwork'

import { HOME_ROUTE, TX_ROUTE } from 'settings/constants'
import { currencyIndexAssets } from 'settings/constants/currency'

import { TimerFullIcon } from '../Icons'
import { Logo } from '../Logo'
import { NetworkStatus } from '../NetworkStatus'
import { Refresh } from '../Refresh'
import { ThemeSwitch } from '../ThemeSwitch'
import { Tooltip, IconButton, Label } from '../UIElements'
import { WalletDrawer } from '../WalletDrawer'
import * as Styled from './Header.style'

export const Header = () => {
  const history = useHistory()

  const { themeType, baseCurrencyAsset, setBaseCurrency } = useApp()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { refreshPage } = useGlobalState()
  const { isValidFundCaps, globalRunePooledStatus, statusColor } = useNetwork()

  const [drawerVisible, setDrawerVisible] = useState(false)

  const isConnected = !!wallet

  useEffect(() => {
    refreshPage()
  }, [refreshPage])

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected) {
      setIsConnectModalOpen(true)
    } else {
      setDrawerVisible(true)
    }
  }, [isConnected, setIsConnectModalOpen])

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false)
  }, [])

  const handleClickTx = useCallback(() => {
    history.push(TX_ROUTE)
  }, [history])

  const handleSelectCurrency = useCallback(
    (baseAsset: Asset) => {
      setBaseCurrency(baseAsset)
    },
    [setBaseCurrency],
  )

  return (
    <Styled.HeaderContainer>
      <Styled.HeaderLogo>
        <Styled.LogoWrapper>
          <Link to={HOME_ROUTE}>
            <Logo type="thorswap" color={themeType} />
          </Link>
        </Styled.LogoWrapper>
        <Styled.HeaderAction>
          <NetworkStatus status={statusColor} />
          <ThemeSwitch />
        </Styled.HeaderAction>
      </Styled.HeaderLogo>

      <Styled.HeaderCenterWrapper>
        <Label weight="bold">
          {globalRunePooledStatus} {!isValidFundCaps && '(Funds Cap Reached)'}
        </Label>
      </Styled.HeaderCenterWrapper>

      <Styled.HeaderAction>
        <Styled.ToolWrapper>
          <CurrencySelector
            selected={baseCurrencyAsset}
            currencies={currencyIndexAssets}
            onSelect={handleSelectCurrency}
          />
        </Styled.ToolWrapper>
        <Tooltip tooltip="View Transaction">
          <IconButton onClick={handleClickTx}>
            <Styled.TxIcon>
              <TimerFullIcon />
            </Styled.TxIcon>
          </IconButton>
        </Tooltip>
        <Styled.WalletBtn
          onClick={handleClickWalletBtn}
          connected={isConnected}
        />
        <WalletDrawer visible={drawerVisible} onClose={handleCloseDrawer} />
        <Refresh onRefresh={refreshPage} />
      </Styled.HeaderAction>
    </Styled.HeaderContainer>
  )
}
