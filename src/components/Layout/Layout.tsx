import React, { useCallback, useMemo } from 'react'

import { useHistory } from 'react-router'

import { getRuneToUpgrade } from 'multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import {
  SWAP_ROUTE,
  UPGRADE_RUNE_ROUTE,
  ADD_LIQUIDITY_ROUTE,
  WITHDRAW_ROUTE,
  LIQUIDITY_ROUTE,
} from 'settings/constants'

import { Footer } from '../Footer'
import { Header } from '../Header'
import WalletModal from '../WalletModal'
import * as Styled from './Layout.style'

export type Props = {
  transparent?: boolean
  children: React.ReactNode
}

export const Layout = (props: Props) => {
  const { children, transparent = false } = props

  const history = useHistory()
  const { wallet } = useWallet()
  const oldRune: string | null = useMemo(() => {
    if (wallet) {
      const runesToUpgrade = getRuneToUpgrade(wallet)

      if (runesToUpgrade.length > 0) {
        const oldRuneChain = `${runesToUpgrade?.[0]?.chain ?? ''} ${
          runesToUpgrade?.[1]?.chain ?? ''
        }`
        return `${oldRuneChain} RUNE Detected, Click to Upgrade to Native Rune.`
      }
    }

    return null
  }, [wallet])
  const handleUpgrade = useCallback(() => {
    history.push(UPGRADE_RUNE_ROUTE)
  }, [history])

  const isTxPage = useMemo(() => {
    const { pathname } = window.location

    return (
      pathname.includes(SWAP_ROUTE) ||
      pathname.includes(ADD_LIQUIDITY_ROUTE) ||
      pathname.includes(WITHDRAW_ROUTE) ||
      pathname.includes(LIQUIDITY_ROUTE)
    )
  }, [])

  return (
    <Styled.LayoutWrapper>
      <Header />
      <Styled.ContentWrapper transparent={transparent}>
        {isTxPage && oldRune && (
          <Styled.NotifyWrapper>
            <Styled.Notify onClick={handleUpgrade}>{oldRune}</Styled.Notify>
          </Styled.NotifyWrapper>
        )}
        {children}
      </Styled.ContentWrapper>
      <Footer />
      <WalletModal />
    </Styled.LayoutWrapper>
  )
}
