import React, { useCallback, useState } from 'react'

import { SyncOutlined } from '@ant-design/icons'

import { StyledButton } from './Refresh.style'

export type RefreshProps = {
  onRefresh: () => void
}

export const Refresh = ({ onRefresh }: RefreshProps): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const handleRefresh = useCallback(() => {
    setLoading(true)
    onRefresh()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [onRefresh])

  return (
    <StyledButton onClick={handleRefresh} typevalue="outline" round>
      <SyncOutlined spin={loading} />
    </StyledButton>
  )
}
