import { AssetETH, Asset } from '@xchainjs/xchain-util'

export const AssetUSDTERC20: Asset = {
  chain: 'ETH',
  symbol: 'USDT-0x62e273709da575835c7f6aef4a31140ca5b1d190',
  ticker: 'USDT',
}

export const AssetRuneEthERC20: Asset = {
  chain: 'ETH',
  symbol: 'RUNE-0xd601c6A3a36721320573885A8d8420746dA3d7A0',
  ticker: 'RUNE',
}

// ETH.THOR - for testnet only
export const AssetThorERC20: Asset = {
  chain: 'ETH',
  symbol: 'THOR-0xA0b515c058F127a15Dd3326F490eBF47d215588e',
  ticker: 'THOR',
}

export const AssetTKN8ERC20: Asset = {
  chain: 'ETH',
  symbol: 'TKN8-0x242aD49dAcd38aC23caF2ccc118482714206beD4',
  ticker: 'TKN8',
}

export const AssetTKN18ERC20: Asset = {
  chain: 'ETH',
  symbol: 'TKN18-0x8E3f9E9b5B26AAaE9d31364d2a8e8a9dd2BE3B82',
  ticker: 'TKN18',
}

export const AssetWETHERC20: Asset = {
  chain: 'ETH',
  symbol: 'WETH-0xbCA556c912754Bc8E7D4Aad20Ad69a1B1444F42d',
  ticker: 'WETH',
}

// This hardcode list is for testnet only
export const ERC20Assets = [
  AssetUSDTERC20,
  AssetRuneEthERC20,
  AssetThorERC20,
  AssetTKN8ERC20,
  AssetTKN18ERC20,
  AssetWETHERC20,
]
export const ETHAssets = [AssetETH, ...ERC20Assets]
