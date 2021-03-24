import { ThemeType } from '@thorchain/asgardex-theme'
import { FeeOptionKey } from '@xchainjs/xchain-client'

export enum FeeOptions {
  'average' = 'average',
  'fast' = 'fast',
  'fastest' = 'fastest',
}

export interface State {
  themeType: ThemeType
  baseCurrency: string
  isSettingOpen: boolean
  slippageTolerance: number
  feeOptionType: FeeOptionKey
}
