/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useMemo, useEffect } from 'react'

import { LinkOutlined } from '@ant-design/icons'
import { THORChain } from '@xchainjs/xchain-util'
import { Grid, Tag } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ActionTypeEnum, ActionType, Action, Transaction } from 'midgard-sdk'
import moment from 'moment'
import { Amount, Asset } from 'multichain-sdk'
import { FixmeType } from 'types'

import { useMidgard } from 'redux/midgard/hooks'

import { multichain } from 'services/multichain'

import { truncateAddress } from 'helpers/string'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants'

import { Label } from '../../UIElements/Label'
import { Table } from '../../UIElements/Table'
import {
  StyledTx,
  StyledText,
  StyledLink,
  StyledLinkText,
  TransactionWrapper,
  StyledPagination,
} from './TxTable.style'

type Column = 'address' | 'date' | 'type' | 'in' | 'out'

const tags: Record<ActionTypeEnum, string> = {
  swap: '#2db7f5',
  addLiquidity: '#87d068',
  withdraw: '#f50',
  donate: '#2db7f5',
  refund: '#f50',
}

type Props = {
  address?: string
  txId?: string
  asset?: string
  type?: ActionType
  limit?: number
}

export const TxTable: React.FC<Props> = React.memo(
  (props: Props): JSX.Element => {
    const { address, txId, asset, type, limit = TX_PUBLIC_PAGE_LIMIT } = props

    const { getTxData, txData, txDataLoading } = useMidgard()

    const isDesktopView = Grid.useBreakpoint()?.lg ?? false
    const [currentTxPage, setCurrentTxPage] = useState<number>(1)

    useEffect(() => {
      const offset = (currentTxPage - 1) * limit

      getTxData({
        address,
        txId,
        asset,
        type,
        offset,
      })
    }, [address, txId, asset, type, limit, currentTxPage, getTxData])

    const renderTxAssets = useCallback((tx: Transaction[]) => {
      if (tx.length === 0) {
        return <StyledLinkText>N/A</StyledLinkText>
      }

      return (
        <StyledTx>
          {tx.map((txObj: Transaction, index: number) => {
            const txHash = txObj.txID
            const coinAsset = txObj.coins?.[0]

            if (!coinAsset) {
              const txUrl = multichain.getExplorerTxUrl(THORChain, txHash)

              return (
                <StyledLink
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <LinkOutlined />
                </StyledLink>
              )
            }

            const { asset: assetName, amount } = coinAsset
            const assetObj = Asset.fromAssetString(assetName)
            const assetValue = assetObj?.ticker ?? 'N/A'
            const amountValue = Amount.fromMidgard(amount).toFixed(3)

            const txUrl = assetObj
              ? multichain.getExplorerTxUrl(assetObj.chain, txHash)
              : '#'

            const displayLabel = `${assetValue}: ${amountValue}`

            return (
              <>
                <StyledLink
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <LinkOutlined />
                  <StyledLinkText>{displayLabel}</StyledLinkText>
                </StyledLink>
              </>
            )
          })}
        </StyledTx>
      )
    }, [])

    const getColumnRenderer = useCallback((): Record<
      Column,
      (value: FixmeType, row: Action) => JSX.Element
    > => {
      return {
        address: (_, row) => {
          return (
            <StyledText>
              {truncateAddress(row?.in?.[0]?.address ?? '')}
            </StyledText>
          )
        },
        type: (_, row) => {
          return (
            <Tag color={tags[row?.type ?? ActionTypeEnum.Swap]}>{row.type}</Tag>
          )
        },
        in: (_, row) => renderTxAssets(row.in),
        out: (_, row) => renderTxAssets(row.out),
        date: (_, row) => {
          return (
            <span>
              {moment.unix(Number(row?.date ?? 0) / 1000000000).fromNow()}
            </span>
          )
        },
      }
    }, [renderTxAssets])

    const columnRenders = useMemo(() => getColumnRenderer(), [
      getColumnRenderer,
    ])

    const addressColumn: ColumnType<Action> = useMemo(
      () => ({
        key: 'address',
        title: 'Address',
        dataIndex: 'address',
        align: 'left',
        render: columnRenders.address,
      }),
      [columnRenders.address],
    )

    const dateColumn: ColumnType<Action> = useMemo(
      () => ({
        key: 'date',
        title: 'Time',
        dataIndex: 'date',
        align: 'right',
        render: columnRenders.date,
      }),
      [columnRenders.date],
    )

    const typeColumn: ColumnType<Action> = useMemo(
      () => ({
        key: 'type',
        title: 'type',
        dataIndex: 'type',
        align: 'center',
        render: columnRenders.type,
      }),
      [columnRenders.type],
    )

    const inColumn: ColumnType<Action> = useMemo(
      () => ({
        key: 'in',
        title: 'In',
        dataIndex: 'in',
        align: 'left',
        render: columnRenders.in,
      }),
      [columnRenders.in],
    )

    const outColumn: ColumnType<Action> = useMemo(
      () => ({
        key: 'out',
        title: 'Out',
        dataIndex: 'out',
        align: 'left',
        render: columnRenders.out,
      }),
      [columnRenders.out],
    )

    const desktopColumns = useMemo(
      () => [addressColumn, typeColumn, inColumn, outColumn, dateColumn],
      [addressColumn, typeColumn, inColumn, outColumn, dateColumn],
    )

    const mobileColumns = useMemo(
      () => [addressColumn, typeColumn, dateColumn],
      [addressColumn, typeColumn, dateColumn],
    )

    return (
      <TransactionWrapper>
        <Label size="big" color="primary">
          Transactions ({txData ? txData.count : 0})
        </Label>
        <Table
          loading={txDataLoading}
          columns={isDesktopView ? desktopColumns : mobileColumns}
          dataSource={txData ? txData.actions : []}
          size="small"
        />
        <StyledPagination
          defaultCurrent={1}
          current={currentTxPage}
          total={txData ? Number(txData.count) : 0}
          showSizeChanger={false}
          onChange={setCurrentTxPage}
        />
      </TransactionWrapper>
    )
  },
)
