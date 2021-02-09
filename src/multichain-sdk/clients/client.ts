import { TxHash } from '@xchainjs/xchain-client'
import { Chain } from '@xchainjs/xchain-util'

import { Asset, AssetAmount } from '../entities'
import { TxParams } from './types'

export interface IClient {
  chain: Chain
  balance: AssetAmount[]

  loadBalance(): Promise<AssetAmount[]>
  hasAmountInBalance(assetAmount: AssetAmount): Promise<boolean>
  getAssetBalance(asset: Asset): Promise<AssetAmount>

  transfer(tx: TxParams): Promise<TxHash>
}
