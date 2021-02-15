import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { useDispatch } from 'react-redux'

import { ColumnType } from 'antd/lib/table'
import { AssetIcon, Helmet, PoolStatusFilter, Table } from 'components'
import { PoolStatus } from 'midgard-sdk'
import { Amount, Percent, Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import * as Styled from './Home.style'

const Home = () => {
  const dispatch = useDispatch()
  const { actions, pools, poolLoading } = useMidgard()

  const [selectedPoolStatus, setSelectedPoolStatus] = useState<PoolStatus>(
    'available',
  )

  const poolObjs: Pool[] = useMemo(
    () =>
      pools.reduce((res: Pool[], poolDetail) => {
        const poolObj = Pool.fromPoolData(poolDetail)
        if (poolObj) {
          res.push(poolObj)
        }
        return res
      }, []),
    [pools],
  )

  useEffect(() => {
    dispatch(actions.getPools(selectedPoolStatus))
  }, [dispatch, actions, selectedPoolStatus])

  const handleSelectPoolStatus = useCallback((status: PoolStatus) => {
    setSelectedPoolStatus(status)
  }, [])

  const poolColumns: ColumnType<Pool>[] = useMemo(
    () => [
      {
        key: 'Pool',
        title: 'Pool',
        render: (pool: Pool) => <AssetIcon asset={pool.asset} />,
        alignItem: 'center',
      },
      {
        key: 'Symbol',
        title: 'Symbol',
        render: (pool: Pool) => pool.asset.ticker,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) => a.asset.sortsBefore(b.asset),
      },
      {
        key: 'Price',
        title: 'Price',
        render: (pool: Pool) =>
          Amount.fromMidgard(pool.detail.assetPrice).toFixed(8),
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Amount.fromMidgard(a.detail.assetPrice),
            Amount.fromMidgard(b.detail.assetPrice),
          ),
      },
      {
        key: 'Depth',
        title: 'Depth',
        render: (pool: Pool) =>
          Amount.fromMidgard(pool.detail.runeDepth).mul(2).toFixed(0),
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
        render: (pool: Pool) =>
          Amount.fromMidgard(pool.detail.volume24h).toFixed(0),
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
        render: (pool: Pool) =>
          `${new Percent(pool.detail.poolAPY).toFixed(0)}%`,
        sortDirections: ['descend', 'ascend'],
        sorter: (a: Pool, b: Pool) =>
          Amount.sorter(
            Percent.fromMidgard(a.detail.poolAPY),
            Percent.fromMidgard(b.detail.poolAPY),
          ),
      },
    ],
    [],
  )

  const renderPoolview = () => (
    <Table
      columns={poolColumns}
      dataSource={poolObjs}
      loading={poolLoading}
      rowKey="key"
    />
  )

  return (
    <Styled.HomeContainer>
      <Helmet title="Asgardex" content="Multichain Asgardex web app" />
      <PoolStatusFilter
        selected={selectedPoolStatus}
        onClick={handleSelectPoolStatus}
      />
      <Styled.PoolTableView>{renderPoolview()}</Styled.PoolTableView>
    </Styled.HomeContainer>
  )
}

export default Home
