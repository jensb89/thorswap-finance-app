import React, { useCallback } from 'react'

import { useDispatch } from 'react-redux'

import { SyncOutlined } from '@ant-design/icons'
import { SupportedChain } from 'multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import { BalanceView } from '../BalanceView'
import { Label } from '../UIElements/Label'
import { Drawer } from './WalletDrawer.style'
import * as Styled from './WalletDrawer.style'

export type WalletDrawerProps = {
  visible: boolean
  onClose?: () => void
}

export const WalletDrawer = (props: WalletDrawerProps) => {
  const { visible, onClose = () => {} } = props

  const dispatch = useDispatch()

  const {
    loadAllWallets,
    getWalletByChain,
    walletLoading,
    wallet,
  } = useWallet()

  const handleRefresh = useCallback(() => {
    dispatch(loadAllWallets())
  }, [loadAllWallets, dispatch])

  const handleReloadChain = useCallback(
    (chain: SupportedChain) => {
      dispatch(getWalletByChain(chain))
    },
    [dispatch, getWalletByChain],
  )

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      placement="right"
      closable={false}
      width={350}
    >
      <Styled.Refresh onClick={handleRefresh}>
        <Label size="big" color="primary">
          Refresh
        </Label>
        <SyncOutlined spin={walletLoading} />
      </Styled.Refresh>
      {!wallet && <Label>Please connect wallet.</Label>}
      {wallet && (
        <BalanceView wallet={wallet} onReloadChain={handleReloadChain} />
      )}
    </Drawer>
  )
}
