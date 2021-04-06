import React from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import { TableProps } from 'antd/lib/table'

import { TableWrapper } from './Table.style'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = TableProps<any>

export const Table = (props: Props) => {
  const { size, loading = false, ...others } = props

  return (
    <TableWrapper
      pagination={false}
      sizeValue={size}
      loading={{
        spinning: loading as boolean,
        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
      }}
      {...others}
    />
  )
}
