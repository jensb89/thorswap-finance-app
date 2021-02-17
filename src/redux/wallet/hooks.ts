import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { Keystore } from '@xchainjs/xchain-crypto'
import { delay } from '@xchainjs/xchain-util'

import { RootState } from 'redux/store'
import * as walletActions from 'redux/wallet/actions'
import { actions } from 'redux/wallet/slice'

import { multichain } from 'helpers/multichain'

export const useWallet = () => {
  const dispatch = useDispatch()

  const walletState = useSelector((state: RootState) => state.wallet)

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string) => {
      // set multichain phrase
      multichain.setPhrase(phrase)

      await delay(5000)

      dispatch(actions.connectWallet(keystore))
      dispatch(walletActions.loadAllWallets())
    },
    [dispatch],
  )

  return {
    ...walletState,
    ...walletActions,
    unlockWallet,
  }
}
