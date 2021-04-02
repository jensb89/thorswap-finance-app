import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'

import { SwapOutlined } from '@ant-design/icons'
import {
  PanelView,
  AssetInputCard,
  Slider,
  ConfirmModal,
  Information,
  Notification,
  IconButton,
  FancyButton,
  PriceRate,
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
  Memo,
  Price,
} from 'multichain-sdk'

import { useApp } from 'redux/app/hooks'
import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetworkFee from 'hooks/useNetworkFee'

import { multichain } from 'services/multichain'

import { getSwapRoute } from 'settings/constants'

import * as Styled from './Swap.style'
import { Pair } from './types'
import { getSwapPair } from './utils'

const SwapView = () => {
  const { pair } = useParams<{ pair: string }>()
  const [swapPair, setSwapPair] = useState<Pair>()

  useEffect(() => {
    const getPair = async () => {
      const swapPairData = await getSwapPair(pair)

      if (swapPairData) {
        setSwapPair(swapPairData)
      }
    }

    getPair()
  }, [pair])

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
  const { slippageTolerance } = useApp()

  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])
  const walletAssets = useMemo(
    () => (wallet ? getWalletAssets(wallet) : poolAssets),
    [wallet, poolAssets],
  )

  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)

  const [isApproved, setApproved] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApproved = async () => {
      const approved = await multichain.isAssetApproved(inputAsset)
      setApproved(approved)
    }

    if (wallet) {
      checkApproved()
    }
  }, [inputAsset, wallet])

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) return null

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)
      return new Swap(
        inputAsset,
        outputAsset,
        pools,
        inputAssetAmount,
        slippageTolerance,
      )
    } catch (error) {
      console.log(error)
      return null
    }
  }, [
    inputAsset,
    outputAsset,
    pools,
    inputAmount,
    slippageTolerance,
    poolLoading,
  ])

  const outputAmount: Amount = useMemo(() => {
    if (swap) {
      return swap.outputAmount.amount
    }

    return Amount.fromAssetAmount(0, 8)
  }, [swap])

  const slipPercent: Percent = useMemo(
    () => (swap ? swap.slip : new Percent(0)),
    [swap],
  )

  const minReceive: Amount = useMemo(
    () => (swap ? swap.minOutputAmount : Amount.fromAssetAmount(0, 8)),
    [swap],
  )

  const inputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: inputAsset,
        pools,
        priceAmount: inputAmount,
      }),
    [inputAsset, inputAmount, pools],
  )

  const outputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: outputAsset,
        pools,
        priceAmount: outputAmount,
      }),
    [outputAsset, outputAmount, pools],
  )

  const txParam = useMemo(() => {
    if (!swap) return undefined

    const assetAmount = new AssetAmount(swap.inputAsset, swap.inputAmount)
    const memo = Memo.swapMemo(
      swap.outputAsset,
      recipient,
      swap.minOutputAmount, // slip limit
    )

    return {
      assetAmount,
      recipient,
      memo,
    }
  }, [recipient, swap])

  const networkFee = useNetworkFee(inputAsset, txParam)

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  const inputAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(inputAsset, wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [inputAsset, wallet])

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

  const handleSwitchPair = useCallback(() => {
    history.push(getSwapRoute(outputAsset, inputAsset))
  }, [history, inputAsset, outputAsset])

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(inputAssetBalance)) {
        setInputAmount(inputAssetBalance)
        setPercent(100)
      } else {
        setInputAmount(amount)
        setPercent(
          amount.div(inputAssetBalance).mul(100).assetAmount.toNumber(),
        )
      }
    },
    [inputAssetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = inputAssetBalance.mul(p).div(100)
      setInputAmount(newAmount)
    },
    [inputAssetBalance],
  )

  const handleSelectMax = useCallback(() => {
    handleChangePercent(100)
  }, [handleChangePercent])

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet && swap) {
      const txHash = await multichain.swap(swap, recipient)

      console.log('txhash', txHash)

      const txURL = multichain.getExplorerTxUrl(swap.inputAsset.chain, txHash)

      Notification({
        type: 'open',
        message: 'View Send Tx.',
        description: 'Transaction submitted successfully!',
        btn: (
          <a href={txURL} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        ),
        duration: 20,
      })
    }
  }, [wallet, swap, recipient])

  const handleCancel = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false)

    if (wallet) {
      const txHash = await multichain.approveAsset(inputAsset)

      if (txHash) {
        console.log('txhash', txHash)
        const txURL = multichain.getExplorerTxUrl(inputAsset.chain, txHash)

        Notification({
          type: 'open',
          message: 'View Approve Tx.',
          description: 'Transaction sent successfully!',
          btn: (
            <a href={txURL} target="_blank" rel="noopener noreferrer">
              View Transaction
            </a>
          ),
          duration: 20,
        })
      }
    }
  }, [inputAsset, wallet])

  const handleSwap = useCallback(() => {
    if (wallet && swap) {
      if (swap.hasInSufficientFee) {
        Notification({
          type: 'info',
          message: 'Swap Insufficient Fee',
          description: 'Input amount is not enough to cover the fee',
        })
        return
      }

      setVisibleConfirmModal(true)
    } else {
      Notification({
        type: 'info',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet, swap])

  const handleApprove = useCallback(() => {
    if (wallet && swap) {
      setVisibleApproveModal(true)
    } else {
      Notification({
        type: 'info',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet, swap])

  const isValidSwap = useMemo(() => swap?.isValid() ?? false, [swap])
  const isValidSlip = useMemo(() => swap?.isSlipValid() ?? false, [swap])

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
        <Information
          title="Slip"
          description={slipPercent.toFixed(3)}
          error={!isValidSlip}
          tooltip="The difference between the market price and estimated price due to trade size."
        />
        <Information
          title="Minimum Received"
          description={`${minReceive.toFixed(
            6,
          )} ${outputAsset.ticker.toUpperCase()}`}
          tooltip="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.ConfirmModalContent>
    )
  }, [
    inputAmount,
    outputAmount,
    inputAsset,
    outputAsset,
    slipPercent,
    isValidSlip,
    minReceive,
    networkFee,
  ])

  const renderApproveModal = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Approve Transaction"
          description={`${inputAsset.ticker.toUpperCase()}`}
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.ConfirmModalContent>
    )
  }, [networkFee, inputAsset])

  const title = useMemo(
    () => `Swap ${inputAsset.ticker} >> ${outputAsset.ticker}`,
    [inputAsset, outputAsset],
  )
  const poolAsset = useMemo(
    () => (inputAsset.isRUNE() ? outputAsset : inputAsset),
    [inputAsset, outputAsset],
  )

  return (
    <PanelView meta={title} poolAsset={poolAsset} type="swap">
      <AssetInputCard
        title="send"
        asset={inputAsset}
        assets={walletAssets}
        amount={inputAmount}
        balance={inputAssetBalance}
        onChange={handleChangeInputAmount}
        onSelect={handleSelectInputAsset}
        onMax={handleSelectMax}
        usdPrice={inputAssetPriceInUSD}
      />
      <Styled.ToolContainer>
        <Styled.SliderWrapper>
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.SliderWrapper>
        <Styled.SwitchPair>
          <IconButton onClick={handleSwitchPair}>
            <SwapOutlined />
          </IconButton>
        </Styled.SwitchPair>
      </Styled.ToolContainer>
      <AssetInputCard
        title="receive"
        asset={outputAsset}
        assets={poolAssets}
        amount={outputAmount}
        onSelect={handleSelectOutputAsset}
        inputProps={{ disabled: true }}
        usdPrice={outputAssetPriceInUSD}
      />

      <Styled.SwapInfo>
        <PriceRate
          price={swap?.price}
          inputAsset={swap?.inputAsset}
          outputAsset={swap?.outputAsset}
        />
        <Information
          title="Slip"
          description={slipPercent.toFixed(3)}
          error={!isValidSlip}
          tooltip="The difference between the market price and estimated price due to trade size."
        />
        <Information
          title="Minimum Received"
          description={`${minReceive.toFixed(
            6,
          )} ${outputAsset.ticker.toUpperCase()}`}
          tooltip="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.SwapInfo>

      {isApproved !== null && (
        <Styled.ConfirmButtonContainer>
          {!isApproved && (
            <Styled.ApproveBtn onClick={handleApprove} error={!isValidSwap}>
              Approve
            </Styled.ApproveBtn>
          )}
          <FancyButton
            disabled={!isApproved}
            onClick={handleSwap}
            error={!isValidSwap}
          >
            Swap
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      )}
      {!wallet && (
        <Styled.ConfirmButtonContainer>
          <FancyButton onClick={handleSwap} error={!isValidSwap}>
            Swap
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      )}

      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
      <ConfirmModal
        visible={visibleApproveModal}
        onOk={handleConfirmApprove}
        onCancel={() => setVisibleApproveModal(false)}
      >
        {renderApproveModal}
      </ConfirmModal>
    </PanelView>
  )
}

export default SwapView
