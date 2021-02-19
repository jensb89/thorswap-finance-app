import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { useHistory } from 'react-router-dom'

import { Grid, Form } from 'antd'
import {
  Helmet,
  TxFilter,
  TxInfo,
  TxLabel,
  Button,
  Table,
  Label,
} from 'components'
import { ActionType, Action } from 'midgard-sdk'
import moment from 'moment'
import { AlignType } from 'rc-table/lib/interface'

import { useMidgard } from 'redux/midgard/hooks'

import usePrevious from 'hooks/usePrevious'
import useQuery from 'hooks/useQuery'

import { getTxViewURL } from 'helpers/router'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants'

import {
  ContentWrapper,
  FilterContainer,
  StyledPagination,
  Input,
  TxToolsContainer,
} from './TransactionView.style'
import { TxFilterType } from './types'

const Transaction: React.FC = (): JSX.Element => {
  const { txData, txDataLoading, getTxData } = useMidgard()

  const history = useHistory()
  const query = useQuery()
  const type = (query?.type ?? 'all') as string
  const offset = Number(query?.offset ?? 0)
  const address = query?.address as string
  const txId = query?.txId as string
  const asset = query?.asset as string

  const isValidFilter = useCallback((filter: TxFilterType) => {
    const { type, offset = 0, address, txId, asset } = filter
    if (
      type === '' ||
      Number.isNaN(offset) ||
      address === '' ||
      txId === '' ||
      asset === ''
    ) {
      return false
    }
    return true
  }, [])

  const initialFilter: TxFilterType = useMemo(
    () => ({
      limit: TX_PUBLIC_PAGE_LIMIT,
      type: (type || 'all') as ActionType,
      offset,
      address,
      txId,
      asset,
    }),
    [offset, type, address, txId, asset],
  )

  const [filter, setFilter] = useState<TxFilterType>(initialFilter)
  const [page, setPage] = useState<number>(Number(offset) + 1)

  const [filterInput, setFilterInput] = useState(address || txId || '')

  const isDesktopView = Grid.useBreakpoint().lg
  console.log('filterInput', filterInput)

  useEffect(() => {
    const { address, txId, type, offset = 0 } = initialFilter

    if (isValidFilter(initialFilter)) {
      getTxData({
        ...initialFilter,
        type: (type === 'all' ? undefined : type) as ActionType,
        offset,
      })
    } else {
      history.push('/tx')
    }

    setFilterInput(address || txId || '')
    setPage(offset + 1)
    setFilter({
      ...initialFilter,
      type: type || 'all',
    })
  }, [getTxData, initialFilter, isValidFilter, history])

  useEffect(() => {
    history.push(getTxViewURL(filter))
  }, [history, filter])

  const handleResetFilters = useCallback(() => {
    history.push('/tx')
  }, [history])

  const handleSelectFilter = useCallback(
    (value: string) => {
      const newFilter = {
        ...filter,
        type: (value === 'all' ? undefined : value) as ActionType,
      }
      setFilter(newFilter)
    },
    [filter],
  )

  const handleChangePage = useCallback(
    (value: number) => {
      setPage(value)
      const newFilter = {
        ...filter,
        offset: value - 1,
      }
      setFilter(newFilter)
    },
    [filter],
  )
  const centerAlign = 'center' as AlignType

  // reset filter, page after refresh
  const prevRefreshTxStatus = usePrevious(txDataLoading)
  useEffect(() => {
    if (!txDataLoading && prevRefreshTxStatus) {
      setPage(1)
      setFilterInput('')
    }
  }, [txDataLoading, prevRefreshTxStatus])

  const filterCol = useMemo(
    () => ({
      key: 'filter',
      width: 200,
      align: centerAlign,
      title: 'Type',
      render: (text: string, rowData: Action) => {
        const { type } = rowData

        return <TxLabel type={type} />
      },
    }),
    [],
  )

  const handleSearchWithFilter = () => {
    if (!filterInput) {
      setFilter({
        ...filter,
        address: undefined,
        txId: undefined,
      })
    }
    setFilter({
      ...filter,
      txId: filterInput,
    })
  }

  const handleChangeFilterInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value

      setFilterInput(text)
    },
    [],
  )

  const renderFilter = () => {
    const type = filter?.type ?? 'all'

    return (
      <FilterContainer>
        <TxFilter value={type} onClick={handleSelectFilter} />
        <Form onFinish={handleSearchWithFilter} autoComplete="off">
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={filterInput}
            onChange={handleChangeFilterInput}
            autoComplete="off"
            placeholder="Searcy by Address / Tx ID"
          />
        </Form>
      </FilterContainer>
    )
  }

  const desktopColumns = useMemo(
    () => [
      filterCol,
      {
        key: 'history',
        title: 'history',
        align: centerAlign,
        render: (text: string, rowData: Action) => {
          return <TxInfo data={rowData} />
        },
      },
      {
        key: 'date',
        title: 'date',
        align: centerAlign,
        width: 200,
        render: (text: string, rowData: Action) => {
          return (
            <Label>
              {moment
                .unix(Number(rowData?.date ?? 0) / 1000000000)
                .format('YY-MM-DD')}
            </Label>
          )
        },
      },
    ],
    [filterCol],
  )

  const mobileColumns = useMemo(
    () => [
      {
        key: 'history',
        align: centerAlign,
        title: 'Type',
        render: (_: string, rowData: Action) => {
          const { type } = rowData

          return (
            <div className="tx-history-row">
              <div className="tx-history-data">
                <TxLabel type={type} />
              </div>
              <div className="tx-history-info">
                <TxInfo data={rowData} />
              </div>
              <div className="tx-history-detail">
                <Label>
                  {moment
                    .unix(Number(rowData?.date ?? 0) / 1000000000)
                    .format('YY-MM-DD')}
                </Label>
              </div>
            </div>
          )
        },
      },
    ],
    [],
  )

  const renderTxTable = (data: Action[], loading: boolean) => {
    const columns = isDesktopView ? desktopColumns : mobileColumns

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record: Action) => record?.date ?? 0}
        size="small"
        loading={loading}
      />
    )
  }

  const pageContent = (data: Action[], count: number, loading: boolean) => {
    return (
      <ContentWrapper>
        <Helmet title="Transactions" content="Transactions" />
        <ContentWrapper>
          <TxToolsContainer>
            <Button
              sizevalue="small"
              color="primary"
              typevalue="outline"
              onClick={handleResetFilters}
              fixedWidth={false}
            >
              Reset Filters
            </Button>
          </TxToolsContainer>
          {renderFilter()}
          {renderTxTable(data, loading)}
        </ContentWrapper>
        {count ? (
          <StyledPagination
            current={page}
            onChange={handleChangePage}
            pageSize={TX_PUBLIC_PAGE_LIMIT}
            total={count}
            showSizeChanger={false}
          />
        ) : (
          ''
        )}
      </ContentWrapper>
    )
  }

  const renderPage = () => {
    if (txDataLoading || !txData) {
      return pageContent([], 0, true)
    }
    const { count, actions } = txData
    return pageContent(actions, Number(count), false)
  }

  return renderPage()
}

export default Transaction
