import { Network } from 'multichain-sdk'

const safeEnv = (defaultEnv: string, env?: string) => {
  return env || defaultEnv
}

export type Config = {
  network: Network
}

export const config: Config = {
  network: safeEnv('testnet', process.env.REACT_APP_NETWORK) as Network,
}
