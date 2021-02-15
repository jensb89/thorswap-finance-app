import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { useDispatch } from 'react-redux'

import { AssetIcon, Helmet, PoolStatusFilter, Table } from 'components'
import { PoolStatus } from 'midgard-sdk'
import { Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import * as Styled from './Home.style'

const Home = () => {
  const dispatch = useDispatch()
  const { actions, pools, poolLoading } = useMidgard()

  const [selectedPoolStatus, setSelectedPoolStatus] = useState<PoolStatus>(
    'available',
  )

  useEffect(() => {
    dispatch(actions.getPools())
  }, [dispatch, actions])

  const handleSelectPoolStatus = useCallback((status: PoolStatus) => {
    setSelectedPoolStatus(status)
  }, [])

  const poolColumns = useMemo(
    () => [
      {
        key: 'Pool',
        title: 'Pool',
        render: (pool: Pool) => <AssetIcon asset={pool.asset} />,
      },
      {
        key: 'Symbol',
        title: 'Symbol',
        render: (pool: Pool) => pool.asset.symbol,
      },
    ],
    [],
  )

  const renderPoolview = () => (
    <Table
      columns={poolColumns}
      dataSource={pools}
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
