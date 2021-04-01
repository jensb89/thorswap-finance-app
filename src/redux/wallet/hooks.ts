import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Keystore } from '@xchainjs/xchain-crypto'

import { RootState } from 'redux/store'
import * as walletActions from 'redux/wallet/actions'
import { actions } from 'redux/wallet/slice'

import { multichain } from 'services/multichain'

export const useWallet = () => {
  const dispatch = useDispatch()

  const walletState = useSelector((state: RootState) => state.wallet)

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string) => {
      // set multichain phrase
      multichain.setPhrase(phrase)

      dispatch(actions.connectWallet(keystore))
      dispatch(walletActions.loadAllWallets())
    },
    [dispatch],
  )

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible))
    },
    [dispatch],
  )

  const disconnectWallet = useCallback(() => {
    dispatch(actions.disconnect())
  }, [dispatch])

  return {
    ...walletState,
    ...walletActions,
    unlockWallet,
    setIsConnectModalOpen,
    disconnectWallet,
  }
}
