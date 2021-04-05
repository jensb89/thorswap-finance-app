import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'

import { PlusOutlined } from '@ant-design/icons'
import {
  PanelView,
  AssetInputCard,
  Slider,
  ConfirmModal,
  Information,
  Notification,
  FancyButton,
  LiquidityTypeOption,
  LiquidityType,
} from 'components'
import { MemberPool } from 'midgard-sdk'
import {
  getWalletAssets,
  Amount,
  Asset,
  getAssetBalance,
  Pool,
  Price,
  Liquidity,
  getMemberDetailByPool,
  AssetAmount,
  Percent,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import useNetworkFee from 'hooks/useNetworkFee'

import { multichain } from 'services/multichain'

import { getAddLiquidityRoute } from 'settings/constants'

import * as Styled from './Add.style'

const AddLiquidityView = () => {
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
    return <AddLiquidityPanel pool={pool} pools={pools} />
  }

  return null
}

const AddLiquidityPanel = ({ pool, pools }: { pool: Pool; pools: Pool[] }) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { getMemberDetails, memberDetails } = useMidgard()

  const poolAsset = useMemo(() => pool.asset, [pool])
  const poolAssets = useMemo(() => {
    const assets = pools.map((poolData) => poolData.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])
  const walletAssets = useMemo(
    () => (wallet ? getWalletAssets(wallet) : poolAssets),
    [wallet, poolAssets],
  )

  const [liquidityType, setLiquidityType] = useState(
    LiquidityTypeOption.SYMMETRICAL,
  )
  const isSymDeposit = useMemo(
    () => liquidityType === LiquidityTypeOption.SYMMETRICAL,
    [liquidityType],
  )

  const [assetAmount, setAssetAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [runeAmount, setRuneAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
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

  const addLiquiditySlip = useMemo(() => {
    return (liquidityEntity.getLiquiditySlip(
      runeAmount,
      assetAmount,
    ) as Percent).toFixed(2)
  }, [liquidityEntity, assetAmount, runeAmount])

  const poolShareEst = useMemo(() => {
    return liquidityEntity.getPoolShareEst(runeAmount, assetAmount).toFixed(2)
  }, [liquidityEntity, assetAmount, runeAmount])

  useEffect(() => {
    const checkApproved = async () => {
      const approved = await multichain.isAssetApproved(poolAsset)
      setApproved(approved)
    }

    if (wallet) {
      checkApproved()
    }
  }, [poolAsset, wallet])

  const poolAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: poolAsset,
        pools,
        priceAmount: assetAmount,
      }),
    [poolAsset, assetAmount, pools],
  )

  const runeAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  )

  const poolAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset, wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [poolAsset, wallet])

  const runeBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(Asset.RUNE(), wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [wallet])

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      history.push(getAddLiquidityRoute(poolAssetData))
    },
    [history],
  )

  const handleChangeAssetAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(poolAssetBalance)) {
        setAssetAmount(poolAssetBalance)
        setPercent(100)

        if (isSymDeposit) {
          setRuneAmount(poolAssetBalance.mul(pool.assetPriceInRune))
        }
      } else {
        setAssetAmount(amount)
        setPercent(amount.div(poolAssetBalance).mul(100).assetAmount.toNumber())

        if (isSymDeposit) {
          setRuneAmount(amount.mul(pool.assetPriceInRune))
        }
      }
    },
    [poolAssetBalance, pool, isSymDeposit],
  )

  const handleChangeAssetPercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = poolAssetBalance.mul(p).div(100)
      setAssetAmount(newAmount)

      if (isSymDeposit) {
        setRuneAmount(newAmount.mul(pool.assetPriceInRune))
      }
    },
    [poolAssetBalance, isSymDeposit, pool],
  )

  const handleSelectAssetMax = useCallback(() => {
    handleChangeAssetPercent(100)
  }, [handleChangeAssetPercent])

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(runeBalance)) {
        setRuneAmount(runeBalance)

        if (isSymDeposit) {
          setAssetAmount(runeBalance.mul(pool.runePriceInAsset))
        }
      } else {
        setRuneAmount(amount)

        if (isSymDeposit) {
          setAssetAmount(amount.mul(pool.runePriceInAsset))
        }
      }
    },
    [runeBalance, pool, isSymDeposit],
  )

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false)
    if (wallet) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? new AssetAmount(Asset.RUNE(), runeAmount)
          : undefined
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? new AssetAmount(poolAsset, assetAmount)
          : undefined

      const txRes = await multichain.addLiquidity({
        pool,
        runeAmount: runeAssetAmount,
        assetAmount: poolAssetAmount,
      })

      const runeTxHash = txRes?.runeTx
      const assetTxHash = txRes?.assetTx

      if (runeTxHash) {
        const runeTxURL = multichain.getExplorerTxUrl(
          Asset.RUNE().chain,
          runeTxHash,
        )

        Notification({
          type: 'open',
          message: 'View Add RUNE Tx.',
          description: 'Transaction submitted successfully!',
          btn: (
            <a href={runeTxURL} target="_blank" rel="noopener noreferrer">
              View Transaction
            </a>
          ),
          duration: 20,
        })
      }

      if (assetTxHash) {
        const assetTxURL = multichain.getExplorerTxUrl(
          poolAsset.chain,
          assetTxHash,
        )

        Notification({
          type: 'open',
          message: 'View Add Asset Tx.',
          description: 'Transaction submitted successfully!',
          btn: (
            <a href={assetTxURL} target="_blank" rel="noopener noreferrer">
              View Transaction
            </a>
          ),
          duration: 20,
        })
      }
    }
  }, [wallet, pool, poolAsset, runeAmount, assetAmount, liquidityType])

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
          title="Slip"
          description={addLiquiditySlip}
          tooltip="The difference between the market price and estimated price due to trade size."
        />
        <Information
          title="Pool Share Estimated"
          description={poolShareEst}
          tooltip="Your pool share percentage after providing the liquidity."
        />
        <Information
          title="Network Fee"
          description={networkFee}
          tooltip="Gas fee used for submitting the transaction using the thorchain protocol"
        />
      </Styled.ConfirmModalContent>
    )
  }, [
    assetAmount,
    runeAmount,
    poolAsset,
    addLiquiditySlip,
    poolShareEst,
    networkFee,
  ])

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

  const title = useMemo(() => `Add ${poolAsset.ticker} Liquidity`, [poolAsset])

  return (
    <PanelView meta={title} poolAsset={poolAsset} type="add">
      <LiquidityType
        poolAsset={poolAsset}
        selected={liquidityType}
        onSelect={setLiquidityType}
      />
      <AssetInputCard
        title="Add"
        asset={poolAsset}
        assets={walletAssets}
        amount={assetAmount}
        balance={poolAssetBalance}
        onChange={handleChangeAssetAmount}
        onSelect={handleSelectPoolAsset}
        onMax={handleSelectAssetMax}
        usdPrice={poolAssetPriceInUSD}
        inputProps={{ disabled: liquidityType === LiquidityTypeOption.RUNE }}
      />
      <Styled.ToolContainer>
        <Styled.SliderWrapper>
          <Slider
            value={percent}
            onChange={handleChangeAssetPercent}
            withLabel
          />
        </Styled.SliderWrapper>
        <Styled.SwitchPair>
          <PlusOutlined />
        </Styled.SwitchPair>
      </Styled.ToolContainer>
      <AssetInputCard
        title="Add"
        asset={Asset.RUNE()}
        amount={runeAmount}
        usdPrice={runeAssetPriceInUSD}
        selectDisabled={false}
        balance={runeBalance}
        onChange={handleChangeRuneAmount}
        inputProps={{ disabled: liquidityType === LiquidityTypeOption.ASSET }}
      />

      <Styled.DetailContent>
        <Information
          title="Slip"
          description={addLiquiditySlip}
          tooltip="The difference between the market price and estimated price due to trade size."
        />
        <Information
          title="Pool Share Estimated"
          description={poolShareEst}
          tooltip="Your pool share percentage after providing the liquidity."
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
            Add
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      )}
      {!wallet && (
        <Styled.ConfirmButtonContainer>
          <FancyButton onClick={handleAddLiquidity}>Add Liquidity</FancyButton>
        </Styled.ConfirmButtonContainer>
      )}

      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirmAdd}
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

export default AddLiquidityView
