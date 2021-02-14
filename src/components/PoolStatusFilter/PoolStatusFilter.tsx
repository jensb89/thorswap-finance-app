/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from 'react'

import { CheckCircleOutlined, FieldTimeOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import Button from 'components/UIElements/Button'
import { getAppContainer } from 'helpers/element'
import { PoolStatus } from 'midgard-sdk'

import {
  PoolFilterWrapper,
  PopoverContent,
  PopoverIcon,
} from './PoolStatusFilter.style'

export type Props = {
  selected: PoolStatus
  onClick: (key: PoolStatus) => void
}

const PoolFilter: React.FC<Props> = (props: Props): JSX.Element => {
  const { selected, onClick } = props

  const handleClick = useCallback(
    (key: PoolStatus) => {
      onClick(key)
    },
    [onClick],
  )

  const renderPopoverContent = () => (
    <PopoverContent>
      Pools don't immediately become enabled on THORChain and must participate
      in a liquidity competition to become enabled. Every 50k blocks (approx 3
      days), the pool with the most liquidity wins & becomes enabled. During
      this time swapping is disabled but liquidity can be added & withdrawn.
    </PopoverContent>
  )

  return (
    <PoolFilterWrapper className="pool-filter">
      <Button
        typevalue="outline"
        round
        onClick={() => handleClick('available')}
        focused={selected === 'available'}
      >
        <CheckCircleOutlined />
        Active
      </Button>
      <Button
        typevalue="outline"
        round
        onClick={() => handleClick('staged')}
        focused={selected === 'staged'}
      >
        <FieldTimeOutlined />
        Pending
      </Button>
      <Popover
        content={renderPopoverContent}
        getPopupContainer={getAppContainer}
        placement="bottomRight"
        overlayClassName="pool-filter-info"
        overlayStyle={{
          padding: '6px',
          animationDuration: '0s !important',
          animation: 'none !important',
        }}
      >
        <PopoverIcon />
      </Popover>
    </PoolFilterWrapper>
  )
}

export default PoolFilter
