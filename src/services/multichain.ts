import { MultiChain } from 'multichain-sdk'

import { config } from 'settings/config'

const multichain = new MultiChain({
  network: config.network,
})

export const setMultichainPhrase = (phrase: string) => {
  multichain.setPhrase(phrase)
}

export { multichain }
