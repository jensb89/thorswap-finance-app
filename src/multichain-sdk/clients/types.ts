import { FeeOptionKey, TxHash } from '@xchainjs/xchain-client'
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
} from '@xchainjs/xchain-util'

import { AssetAmount, Pool, Percent } from '../entities'

export type Network = 'testnet' | 'mainnet'

export type TxParams = {
  assetAmount: AssetAmount
  recipient: string
  memo?: string
  feeOptionKey?: FeeOptionKey
}

export type MultiSendParams = {
  assetAmount1: AssetAmount
  assetAmount2: AssetAmount
  recipient: string
  memo?: string
}

export type AddLiquidityParams = {
  pool: Pool
  runeAmount?: AssetAmount
  assetAmount: AssetAmount
}

export type AddLiquidityTxns = {
  runeTx?: TxHash
  assetTx?: TxHash
}

export type WithdrawParams = {
  pool: Pool
  percent: Percent
}

// note only supported chains
export const supportedChains = [
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
] as const
export type SupportedChain = typeof supportedChains[number]

export type ChainWallet = {
  address: string
  balance: AssetAmount[]
}

export type Wallet = Record<SupportedChain, ChainWallet>

export type ApproveParams = {
  spender: string
  sender: string
}

export type DepositParams = TxParams & {
  router: string
}
