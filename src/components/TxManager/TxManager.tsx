import React, { useMemo } from 'react'

import { MenuFoldOutlined, LoadingOutlined } from '@ant-design/icons'

import { TxTracker, TxTrackerStatus } from 'redux/midgard/types'

import { useTxManager } from 'hooks/useTxManager'

import { Label, CoreButton } from '../UIElements'
import * as Styled from './TxManager.style'
import { TxMonitor } from './TxMonitor'

export const TxManager = () => {
  const { txTrackers, txCollapsed, setTxCollapsed } = useTxManager()

  const toggle = React.useCallback(() => {
    setTxCollapsed(!txCollapsed)
  }, [setTxCollapsed, txCollapsed])

  const hasPendingTx = useMemo(
    () =>
      txTrackers.filter((tracker) => tracker.status !== TxTrackerStatus.Success)
        .length > 0,
    [txTrackers],
  )
  const hasTxHistory = useMemo(() => txTrackers.length > 0, [txTrackers])

  const renderAllTxTrackers = useMemo(
    () =>
      txTrackers.map((tracker: TxTracker) => (
        <TxMonitor key={tracker.uuid} txTracker={tracker} />
      )),
    [txTrackers],
  )

  return (
    <Styled.Container collapsed={txCollapsed}>
      <Styled.Header>
        <CoreButton onClick={toggle}>
          {hasPendingTx ? <LoadingOutlined /> : <MenuFoldOutlined />}
        </CoreButton>
      </Styled.Header>
      {!txCollapsed && (
        <>
          {!hasTxHistory && (
            <Styled.EmptyContent>
              <Label>No transactions.</Label>
            </Styled.EmptyContent>
          )}
          {hasTxHistory && (
            <Styled.Content>{renderAllTxTrackers}</Styled.Content>
          )}
        </>
      )}
    </Styled.Container>
  )
}
