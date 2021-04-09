import { useState, useEffect } from 'react'

import { ETHChain } from '@xchainjs/xchain-util'
import { Asset, Amount, TxParams, chainToFeeAsset } from 'multichain-sdk'

import { multichain } from 'services/multichain'

import useDebounce from './useDebounce'

// TODO: update network fee logic
const useNetworkFee = (asset: Asset, txParam?: TxParams): string => {
  const [networkFee, setNetworkFee] = useState('')

  // debounce tx param per 5 secs
  const debouncedTxParams = useDebounce(txParam, 5000)

  useEffect(() => {
    const getFeeValue = async () => {
      const { chain } = asset
      let feeStr = ''

      setNetworkFee('fee estimating...')
      try {
        if (chain === ETHChain) {
          if (!asset.isETH()) {
            setNetworkFee('Ethereum Gas Fee')
          } else if (txParam) {
            const {
              router: ethPoolAddress,
            } = await multichain.getPoolAddressDataByChain(ETHChain)

            if (ethPoolAddress) {
              const feeValue = await multichain.getFees(asset.chain, {
                ...txParam,
                recipient: ethPoolAddress,
              })
              feeStr = Amount.fromBaseAmount(
                feeValue.fastest.amount(),
                asset.decimal,
              ).toFixed(8)
            } else {
              setNetworkFee(`${chain} Gas Fee`)
            }
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
        setNetworkFee(`${chain} Gas Fee`)
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
