import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useParams } from 'react-router'

import {
  PanelView,
  Slider,
  ConfirmModal,
  Information,
  Notification,
  FancyButton,
  LiquidityTypeOption,
  LiquidityType,
  MemberPoolData,
  Label,
} from 'components'
import { MemberPool } from 'midgard-sdk'
import {
  Amount,
  Asset,
  Pool,
  Price,
  Liquidity,
  getMemberDetailByPool,
  Percent,
  AmountType,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetworkFee from 'hooks/useNetworkFee'

import { multichain } from 'services/multichain'

import * as Styled from './Withdraw.style'

const WithdrawView = () => {
  const { asset } = useParams<{ asset: string }>()
  const [assetObj, setAssetObj] = useState<Asset>()
  const [pool, setPool] = useState<Pool>()

  const { pools, poolLoading } = useMidgard()

  useEffect(() => {
    if (!poolLoading && pools.length && assetObj) {
      const assetPool = Pool.byAsset(assetObj, pools)

      if (assetPool) {
        setPool(assetPool)
      }
    }
  }, [pools, poolLoading, assetObj])

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!asset) {
        return
      }
      const assetEntity = Asset.fromAssetString(asset)

      if (assetEntity) {
        if (assetEntity.isRUNE()) return

        await assetEntity.setDecimal()

        setAssetObj(assetEntity)
      }
    }

    getAssetEntity()
  }, [asset])

  if (pool && pools.length) {
    return <WithdrawPanel pool={pool} pools={pools} />
  }

  return null
}

const WithdrawPanel = ({ pool, pools }: { pool: Pool; pools: Pool[] }) => {
  const { wallet } = useWallet()
  const { getMemberDetails, memberDetails } = useMidgard()

  const poolAsset = useMemo(() => pool.asset, [pool])

  const [liquidityType, setLiquidityType] = useState(
    LiquidityTypeOption.SYMMETRICAL,
  )
  // const isSymWithdraw = useMemo(
  //   () => liquidityType === LiquidityTypeOption.SYMMETRICAL,
  //   [liquidityType],
  // )

  const [percent, setPercent] = useState(0)
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)

  const [isApproved, setApproved] = useState<boolean | null>(null)

  const networkFee = useNetworkFee(poolAsset)

  useEffect(() => {
    getMemberDetails()
  }, [getMemberDetails])

  const poolMemberDetail: MemberPool | undefined = useMemo(() => {
    return getMemberDetailByPool({ memberDetails, pool })
  }, [memberDetails, pool])

  const liquidityUnits = useMemo(() => {
    if (!poolMemberDetail) return Amount.fromMidgard(0)

    return Amount.fromMidgard(poolMemberDetail.liquidityUnits)
  }, [poolMemberDetail])
  const liquidityEntity = useMemo(() => {
    return new Liquidity(pool, liquidityUnits)
  }, [pool, liquidityUnits])

  useEffect(() => {
    const checkApproved = async () => {
      const approved = await multichain.isAssetApproved(poolAsset)
      setApproved(approved)
    }

    if (wallet) {
      checkApproved()
    }
  }, [poolAsset, wallet])

  const { runeAmount, assetAmount } = useMemo(() => {
    return liquidityEntity.getWithdrawAmount(
      new Percent(percent, AmountType.BASE_AMOUNT),
    )
  }, [percent, liquidityEntity])

  const runePriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  )

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: pool.asset,
        pools,
        priceAmount: assetAmount,
      }),
    [pool, assetAmount, pools],
  )

  const handleChangePercent = useCallback((p: number) => {
    setPercent(p)
  }, [])

  const handleConfirmWithdraw = useCallback(async () => {
    setVisibleConfirmModal(false)
    if (wallet) {
      const txRes = await multichain.withdraw({
        pool,
        percent: new Percent(percent, AmountType.BASE_AMOUNT),
      })

      const txUrl = multichain.getExplorerTxUrl(pool.asset.chain, txRes)

      Notification({
        type: 'open',
        message: 'View Withdraw Tx.',
        description: 'Transaction submitted successfully!',
        btn: (
          <a href={txUrl} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        ),
        duration: 20,
      })
    }
  }, [wallet, pool, percent])

  const handleCancel = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false)

    if (wallet) {
      const txHash = await multichain.approveAsset(poolAsset)

      if (txHash) {
        console.log('txhash', txHash)
        const txURL = multichain.getExplorerTxUrl(poolAsset.chain, txHash)

        Notification({
          type: 'open',
          message: 'View Approve Tx.',
          description: 'Transaction submitted successfully!',
          btn: (
            <a href={txURL} target="_blank" rel="noopener noreferrer">
              View Transaction
            </a>
          ),
          duration: 20,
        })
      }
    }
  }, [poolAsset, wallet])

  const handleAddLiquidity = useCallback(() => {
    if (wallet) {
      setVisibleConfirmModal(true)
    } else {
      Notification({
        type: 'info',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet])

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true)
    } else {
      Notification({
        type: 'info',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet])

  const renderConfirmModalContent = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Add"
          description={`${assetAmount.toFixed()} ${poolAsset.ticker.toUpperCase()}, ${runeAmount.toFixed()} RUNE`}
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.ConfirmModalContent>
    )
  }, [assetAmount, runeAmount, poolAsset, networkFee])

  const renderApproveModal = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Add"
          description={`${assetAmount.toFixed()} ${poolAsset.ticker.toUpperCase()}, ${runeAmount.toFixed()} RUNE`}
        />
        <Information
          title="Approve Transaction"
          description={`${poolAsset.ticker.toUpperCase()}`}
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.ConfirmModalContent>
    )
  }, [poolAsset, assetAmount, runeAmount, networkFee])

  const title = useMemo(() => `Withdraw ${poolAsset.ticker} Liquidity`, [
    poolAsset,
  ])

  if (!wallet) {
    return (
      <PanelView meta={title} poolAsset={poolAsset} type="withdraw">
        <Label>Please connect wallet.</Label>
      </PanelView>
    )
  }

  if (!poolMemberDetail) {
    return (
      <PanelView meta={title} poolAsset={poolAsset} type="withdraw">
        <Label>You don't have any {poolAsset.ticker} liquidity.</Label>
      </PanelView>
    )
  }

  return (
    <PanelView meta={title} poolAsset={poolAsset} type="withdraw">
      <LiquidityType
        poolAsset={poolAsset}
        selected={liquidityType}
        onSelect={setLiquidityType}
      />
      <MemberPoolData
        data={poolMemberDetail}
        share={liquidityEntity.poolShare}
      />
      <Styled.ToolContainer>
        <Styled.SliderWrapper>
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.SliderWrapper>
      </Styled.ToolContainer>

      <Styled.DetailContent>
        <Information
          title="RUNE"
          description={`${runeAmount.toFixed(
            3,
          )} RUNE ($${runePriceInUSD.toFixed(2)})`}
          tooltip="You are removing RUNE from the liquidity"
        />
        <Information
          title={poolAsset.ticker}
          description={`${assetAmount.toFixed(3)} ${
            poolAsset.ticker
          } ($${assetPriceInUSD.toFixed(2)})`}
          tooltip="You are removing ASSET from the liquidity"
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.DetailContent>

      {isApproved !== null && wallet && (
        <Styled.ConfirmButtonContainer>
          {!isApproved && (
            <Styled.ApproveBtn onClick={handleApprove}>
              Approve
            </Styled.ApproveBtn>
          )}
          <FancyButton disabled={!isApproved} onClick={handleAddLiquidity}>
            Withdraw
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      )}
      {!wallet && (
        <Styled.ConfirmButtonContainer>
          <FancyButton onClick={handleAddLiquidity}>Withdraw</FancyButton>
        </Styled.ConfirmButtonContainer>
      )}

      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirmWithdraw}
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

export default WithdrawView
