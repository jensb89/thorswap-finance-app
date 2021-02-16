import { Keystore } from '@xchainjs/xchain-crypto'
import { Wallet } from 'multichain-sdk'

export interface State {
  keystore: Keystore | null
  wallet: Wallet | null
  walletLoading: boolean
}
