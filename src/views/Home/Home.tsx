import React, { useState, useCallback, useMemo } from 'react'

import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { SyncOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons'
import { chainToString } from '@xchainjs/xchain-util'
import { Breakpoint } from 'antd/lib/_util/responsiveObserve'
import { ColumnType } from 'antd/lib/table'
import {
  TxTable,
  GlobalStats,
  GlobalChart,
  AssetIcon,
  Helmet,
  PoolStatusFilter,
  Button,
  Input,
} from 'components'
import { PoolStatus } from 'midgard-sdk'
import { Amount, Asset, Percent, Pool } from 'multichain-sdk'
import { AlignType } from 'rc-table/lib/interface'

import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

import {
  getSwapRoute,
  getPoolDetailRoute,
  getAddLiquidityRoute,
} from 'settings/constants'

import * as Styled from './Home.style'

const Home = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { runeToCurrency } = useGlobalState()
  const { actions, pools, poolLoading } = useMidgard()

  const [selectedPoolStatus, setSelectedPoolStatus] = useState<PoolStatus>(
    'available',
  )

  const [keyword, setKeyword] = useState('')

  const handleLoadPoolData = useCallback(() => {
    dispatch(actions.getPools(selectedPoolStatus))
  }, [dispatch, actions, selectedPoolStatus])

  const handleSelectPoolStatus = useCallback((status: PoolStatus) => {
    setSelectedPoolStatus(status)
  }, [])

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  const centerAlign = 'center' as AlignType
  const rightAlign = 'right' as AlignType

  const poolActions = useMemo(
    () => ({
      key: 'action',
      align: centerAlign,
      responsive: ['md'] as Breakpoint[],
      title: (
        <Styled.ActionContainer>
          <Button
            onClick={handleLoadPoolData}
            typevalue="outline"
            round
            fixedWidth={false}
          >
            <SyncOutlined />
            refresh
          </Button>
        </Styled.ActionContainer>
      ),
      render: (_: string, pool: Pool) => {
        const swapRouter = getSwapRoute(Asset.BNB(), pool.asset)
        const liquidityRouter = getAddLiquidityRoute(pool.asset)

        return (
          <Styled.ActionContainer>
            <Link to={swapRouter} onClick={(e) => e.stopPropagation()}>
              <Button round style={{ marginRight: '8px' }}>
                <SwapOutlined />
                SWAP
              </Button>
            </Link>
            <Link to={liquidityRouter} onClick={(e) => e.stopPropagation()}>
              <Button round>Liquidity</Button>
            </Link>
          </Styled.ActionContainer>
        )
      },
    }),
    [handleLoadPoolData],
  )

  const poolColumns: ColumnType<Pool>[] = useMemo(
    () => [
      {
        key: 'Pool',
        title: 'Pool',
        render: (pool: Pool) => (
          <Styled.ActionContainer>
            <AssetIcon asset={pool.asset} />
          </Styled.ActionContainer>
        ),
        align: centerAlign,
      },
      {
        key: 'Symbol',
        title: 'Symbol',
        align: centerAlign,
        render: (pool: Pool) => pool.asset.ticker,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) => a.asset.sortsBefore(b.asset),
      },
      {
        key: 'Chain',
        title: 'Chain',
        align: centerAlign,
        responsive: ['md'] as Breakpoint[],
        render: (pool: Pool) => chainToString(pool.asset.chain),
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          chainToString(a.asset.chain).localeCompare(
            chainToString(b.asset.chain),
          ),
      },
      {
        key: 'Price',
        title: 'USD Price',
        render: (pool: Pool) =>
          `$${Amount.fromAssetAmount(pool.detail.assetPriceUSD, 8).toFixed(3)}`,
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromAssetAmount(a.detail.assetPriceUSD, 8),
            Amount.fromAssetAmount(b.detail.assetPriceUSD, 8),
          ),
      },
      {
        key: 'Depth',
        title: 'Depth',
        render: (pool: Pool) =>
          runeToCurrency(
            Amount.fromMidgard(pool.detail.runeDepth).mul(2),
          ).toCurrencyFormat(0),
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromMidgard(a.detail.runeDepth),
            Amount.fromMidgard(b.detail.runeDepth),
          ),
      },
      {
        key: 'Volume24h',
        title: 'Volume 24h',
        responsive: ['md'] as Breakpoint[],
        render: (pool: Pool) =>
          runeToCurrency(
            Amount.fromMidgard(pool.detail.volume24h),
          ).toCurrencyFormat(0),
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromMidgard(a.detail.volume24h),
            Amount.fromMidgard(b.detail.volume24h),
          ),
      },
      {
        key: 'APY',
        title: 'APY',
        responsive: ['md'] as Breakpoint[],
        render: (pool: Pool) =>
          `${new Percent(pool.detail.poolAPY).toFixed(0)}`,
        align: rightAlign,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Percent.fromMidgard(a.detail.poolAPY),
            Percent.fromMidgard(b.detail.poolAPY),
          ),
      },
      poolActions,
    ],
    [poolActions, runeToCurrency],
  )

  const filteredPools = useMemo(() => {
    if (!keyword) return pools

    return pools.filter((pool) =>
      pool.asset.toString().toLowerCase().includes(keyword),
    )
  }, [pools, keyword])

  const renderPoolview = useMemo(
    () => (
      <Styled.Table
        columns={poolColumns}
        dataSource={filteredPools}
        loading={poolLoading}
        onRow={(record: Pool) => ({
          onClick: () => history.push(getPoolDetailRoute(record)),
        })}
        rowKey="key"
      />
    ),
    [poolColumns, filteredPools, poolLoading, history],
  )

  return (
    <Styled.HomeContainer>
      <Helmet title="THORSwap" content="THORSwap" />
      <Styled.Section>
        <GlobalStats />
      </Styled.Section>
      <Styled.Section>
        <GlobalChart />
      </Styled.Section>
      <PoolStatusFilter
        selected={selectedPoolStatus}
        onClick={handleSelectPoolStatus}
      />
      <Styled.PoolTableView>
        <Input
          prefix={<SearchOutlined />}
          sizevalue="big"
          placeholder="Search pools..."
          value={keyword}
          onChange={handleChangeKeyword}
        />
        {renderPoolview}
      </Styled.PoolTableView>
      <TxTable />
    </Styled.HomeContainer>
  )
}

export default Home
