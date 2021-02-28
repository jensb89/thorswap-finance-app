import { useState, useEffect } from 'react'

import { ETHChain } from '@xchainjs/xchain-util'
import { Asset, Amount, TxParams, chainToFeeAsset } from 'multichain-sdk'

import { multichain } from 'services/multichain'

import useDebounce from './useDebounce'

const useNetworkFee = (asset: Asset, txParam?: TxParams): string => {
  const [networkFee, setNetworkFee] = useState('')

  const debouncedTxParams = useDebounce(txParam, 1000)

  useEffect(() => {
    const getFeeValue = async () => {
      const { chain } = asset
      let feeStr = ''

      setNetworkFee('...')
      try {
        if (chain === ETHChain) {
          if (txParam) {
            const ethPoolAddress = await multichain.getPoolAddressByChain(
              ETHChain,
            )
            const feeValue = await multichain.getFees(asset.chain, {
              ...txParam,
              recipient: ethPoolAddress,
            })
            feeStr = Amount.fromBaseAmount(
              feeValue.fastest.amount(),
              asset.decimal,
            ).toFixed(8)
          }
        } else {
          const feeValue = await multichain.getFees(asset.chain)
          feeStr = Amount.fromBaseAmount(
            feeValue.fastest.amount(),
            asset.decimal,
          ).toFixed(8)
        }
      } catch (error) {
        console.log('quote fee error', error)
      }

      const feeAsset = chainToFeeAsset(chain)
      setNetworkFee(`${feeStr} ${feeAsset}`)
    }

    getFeeValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTxParams, asset])

  return networkFee
}

export default useNetworkFee