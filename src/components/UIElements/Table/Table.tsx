import React from 'react'

import { TableProps } from 'antd/lib/table'

import { TableWrapper } from './Table.style'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = TableProps<any>

export const Table = (props: Props) => {
  const { size, ...others } = props

  return <TableWrapper pagination={false} sizeValue={size} {...others} />
}
