import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'

import {
  ContentTitle,
  Helmet,
  AssetInputCard,
  Slider,
  Input,
  Drag,
  ConfirmModal,
  Information,
  Notification,
} from 'components'
import {
  getWalletAssets,
  Amount,
  Asset,
  AssetAmount,
  getAssetBalance,
  getWalletAddressByChain,
  Swap,
  Percent,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { multichain } from 'services/multichain'

import { getSwapRoute } from 'settings/constants'

import * as Styled from './Swap.style'
import { Pair } from './types'
import { getSwapPair } from './utils'

const SwapView = () => {
  const { pair } = useParams<{ pair: string }>()

  const swapPair = getSwapPair(pair)

  if (swapPair) {
    const { inputAsset, outputAsset } = swapPair
    return <SwapPage inputAsset={inputAsset} outputAsset={outputAsset} />
  }

  return null
}

const SwapPage = ({ inputAsset, outputAsset }: Pair) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { pools, poolLoading } = useMidgard()

  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])
  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet])

  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) return null

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)
      return new Swap(inputAsset, outputAsset, pools, inputAssetAmount)
    } catch (error) {
      console.log(error)
    }

    return null
  }, [inputAsset, outputAsset, pools, inputAmount, poolLoading])
  const outputAmount: Amount = useMemo(() => {
    if (swap) {
      return swap.outputAmount.amount
    }

    return Amount.fromAssetAmount(0, 8)
  }, [swap])
  const slipPercent: Percent = useMemo(() => {
    if (swap) {
      return swap.slip
    }

    return new Percent(0)
  }, [swap])
  const rate: string = useMemo(() => {
    if (swap) {
      return `1 ${swap.inputAsset.ticker} = ${swap.price.toFixedInverted(3)} ${
        swap.outputAsset.ticker
      }`
    }

    return ''
  }, [swap])

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  const assetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(inputAsset, wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [inputAsset, wallet])

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setRecipient(addr)
    },
    [],
  )

  const handleSelectInputAsset = useCallback(
    (input: Asset) => {
      history.push(getSwapRoute(input, outputAsset))
    },
    [history, outputAsset],
  )

  const handleSelectOutputAsset = useCallback(
    (output: Asset) => {
      history.push(getSwapRoute(inputAsset, output))
    },
    [history, inputAsset],
  )

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(assetBalance)) {
        setInputAmount(assetBalance)
        setPercent(100)
      } else {
        setInputAmount(amount)
        setPercent(amount.div(assetBalance).mul(100).assetAmount.toNumber())
      }
    },
    [assetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = assetBalance.mul(p).div(100)
      setInputAmount(newAmount)
    },
    [assetBalance],
  )

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet && swap) {
      const txHash = await multichain.swap(swap, recipient)

      console.log('txhash', txHash)
    }
  }, [wallet, swap, recipient])

  const handleCancel = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleDrag = useCallback(() => {
    if (wallet && swap) {
      if (swap.hasInSufficientFee) {
        Notification({
          type: 'error',
          message: 'Swap Insufficient Fee',
          description: 'Input amount is not enough to cover the fee',
        })
        return
      }

      setVisibleConfirmModal(true)
    } else {
      Notification({
        type: 'error',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet, swap])

  const renderConfirmModalContent = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Send"
          description={`${inputAmount.toFixed()} ${inputAsset.ticker.toUpperCase()}`}
        />
        <Information
          title="Receive"
          description={`${outputAmount.toFixed()} ${outputAsset.ticker.toUpperCase()}`}
        />
        <Information title="Slip" description={slipPercent.toFixed(2)} />
        {!!recipient && (
          <Information title="Recipient" description={recipient} />
        )}
      </Styled.ConfirmModalContent>
    )
  }, [
    inputAmount,
    outputAmount,
    inputAsset,
    outputAsset,
    recipient,
    slipPercent,
  ])

  const title = useMemo(
    () => `Swap ${inputAsset.ticker} >> ${outputAsset.ticker}`,
    [inputAsset, outputAsset],
  )

  return (
    <Styled.Container>
      <Styled.ContentPanel>
        <Helmet title={title} content={title} />
        <ContentTitle>{title}</ContentTitle>

        <Styled.CardContainer>
          <AssetInputCard
            title="send"
            asset={inputAsset}
            assets={walletAssets}
            amount={inputAmount}
            onChange={handleChangeInputAmount}
            onSelect={handleSelectInputAsset}
          />
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.CardContainer>
        <AssetInputCard
          title="receive"
          asset={outputAsset}
          assets={poolAssets}
          amount={outputAmount}
          onSelect={handleSelectOutputAsset}
          inputProps={{ disabled: true }}
        />
        <Styled.FormItem>
          <Styled.FormLabel>Recipient (Optional)</Styled.FormLabel>
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={recipient}
            onChange={handleChangeRecipient}
            placeholder="Recipient"
          />
        </Styled.FormItem>

        <Styled.SwapInfo>
          <Information title="Rate" description={rate} />
          <Information title="Slip" description={slipPercent.toFixed(2)} />
        </Styled.SwapInfo>

        <Styled.DragContainer>
          <Drag
            title="Drag to swap"
            source={inputAsset}
            target={outputAsset}
            onConfirm={handleDrag}
          />
        </Styled.DragContainer>
      </Styled.ContentPanel>

      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
    </Styled.Container>
  )
}

export default SwapView
