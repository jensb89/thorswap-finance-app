import React, { useMemo } from 'react'

import {
  MenuFoldOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { TxTracker, TxTrackerStatus } from 'redux/midgard/types'

import { useTxManager } from 'hooks/useTxManager'

import { Label, CoreButton } from '../UIElements'
import * as Styled from './TxManager.style'
import { TxMonitor } from './TxMonitor'

export const TxManager = () => {
  const {
    txTrackers,
    txCollapsed,
    setTxCollapsed,
    clearTxTrackers,
  } = useTxManager()

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

  const handleClearHistory = React.useCallback(() => {
    clearTxTrackers()
  }, [clearTxTrackers])

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
            <Styled.Content>
              {renderAllTxTrackers}
              <Styled.ClearRow onClick={handleClearHistory}>
                <Label>Clear History</Label>
                <DeleteOutlined />
              </Styled.ClearRow>
            </Styled.Content>
          )}
        </>
      )}
    </Styled.Container>
  )
}
