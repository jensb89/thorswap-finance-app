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
} from 'components'
// import { MemberPool } from 'midgard-sdk'
import {
  getWalletAssets,
  Amount,
  Asset,
  getAssetBalance,
  Pool,
  Price,
  // Liquidity,
  // getMemberDetailByPool,
  // MULTICHAIN_DECIMAL,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { multichain } from 'services/multichain'

import { getAddLiquidityRoute } from 'settings/constants'

import * as Styled from './Add.style'

const ProvideView = () => {
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
    return <ProvidePage pool={pool} pools={pools} />
  }

  return null
}

const ProvidePage = ({ pool, pools }: { pool: Pool; pools: Pool[] }) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { getMemberDetails } = useMidgard()

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

  useEffect(() => {
    getMemberDetails()
  }, [getMemberDetails])

  // const poolMemberDetail: MemberPool | undefined = useMemo(() => {
  //   return getMemberDetailByPool({ memberDetails, pool })
  // }, [memberDetails, pool])

  // const liquidityUnits = useMemo(() => {
  //   if (!poolMemberDetail) return Amount.fromAssetAmount(0, MULTICHAIN_DECIMAL)

  //   return Amount.fromMidgard(poolMemberDetail.liquidityUnits)
  // }, [poolMemberDetail])
  // const liquidityEntity = useMemo(() => {
  //   return new Liquidity(pool, liquidityUnits)
  // }, [pool, liquidityUnits])

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
      } else {
        setAssetAmount(amount)
        setPercent(amount.div(poolAssetBalance).mul(100).assetAmount.toNumber())
      }
    },
    [poolAssetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = poolAssetBalance.mul(p).div(100)
      setAssetAmount(newAmount)
    },
    [poolAssetBalance],
  )

  const handleSelectMax = useCallback(() => {
    handleChangePercent(100)
  }, [handleChangePercent])

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(runeBalance)) {
        setRuneAmount(runeBalance)
      } else {
        setRuneAmount(amount)
      }
    },
    [runeBalance],
  )

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet) {
    }
  }, [wallet])

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

  const handleProvide = useCallback(() => {
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
          title="Provide"
          description={`${assetAmount.toFixed()} ${poolAsset.ticker.toUpperCase()}`}
        />
      </Styled.ConfirmModalContent>
    )
  }, [assetAmount, poolAsset])

  const renderApproveModal = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Approve Transaction"
          description={`${poolAsset.ticker.toUpperCase()}`}
        />
      </Styled.ConfirmModalContent>
    )
  }, [poolAsset])

  const title = useMemo(() => `Provide ${poolAsset.ticker} Liquidity`, [
    poolAsset,
  ])

  return (
    <PanelView meta={title} poolAsset={poolAsset} type="add">
      <AssetInputCard
        title="Provide"
        asset={poolAsset}
        assets={walletAssets}
        amount={assetAmount}
        balance={poolAssetBalance}
        onChange={handleChangeAssetAmount}
        onSelect={handleSelectPoolAsset}
        onMax={handleSelectMax}
        usdPrice={poolAssetPriceInUSD}
      />
      <Styled.ToolContainer>
        <Styled.SliderWrapper>
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.SliderWrapper>
        <Styled.SwitchPair>
          <PlusOutlined />
        </Styled.SwitchPair>
      </Styled.ToolContainer>
      <AssetInputCard
        title="Provide"
        asset={Asset.RUNE()}
        amount={runeAmount}
        inputProps={{ disabled: true }}
        usdPrice={runeAssetPriceInUSD}
        selectDisabled={false}
        balance={runeBalance}
        onChange={handleChangeRuneAmount}
      />

      <Styled.DetailContent>
        <Information
          title="Slip"
          description="todo"
          tooltip="The difference between the market price and estimated price due to trade size."
        />
      </Styled.DetailContent>

      {isApproved !== null && (
        <Styled.ConfirmButtonContainer>
          {!isApproved && (
            <Styled.ApproveBtn onClick={handleApprove}>
              Approve
            </Styled.ApproveBtn>
          )}
          <FancyButton disabled={!isApproved} onClick={handleProvide}>
            Provide
          </FancyButton>
        </Styled.ConfirmButtonContainer>
      )}
      {!wallet && (
        <Styled.ConfirmButtonContainer>
          <FancyButton onClick={handleProvide}>Provide</FancyButton>
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

export default ProvideView
