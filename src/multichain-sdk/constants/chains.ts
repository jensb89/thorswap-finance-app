import {
  Chain,
  BNBChain,
  BTCChain,
  ETHChain,
  LTCChain,
  BCHChain,
} from '@xchainjs/xchain-util'

export const getChainName = (chain: Chain): string => {
  if (chain === BTCChain || chain === LTCChain || chain === BCHChain) {
    return 'Native'
  }

  if (chain === BNBChain) {
    return 'BEP2'
  }

  if (chain === ETHChain) {
    return 'ERC20'
  }

  // thorchain

  return 'THORChain'
}
