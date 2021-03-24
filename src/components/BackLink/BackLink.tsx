import React, { useCallback } from 'react'

import { useHistory } from 'react-router'

import { LeftOutlined } from '@ant-design/icons'

import { IconButton } from 'components/UIElements'

import { BackLinkWrapper } from './BackLink.style'

export const BackLink = () => {
  const history = useHistory()

  const handleGoBack = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <BackLinkWrapper onClick={handleGoBack}>
      <IconButton>
        <LeftOutlined />
        <span>Back</span>
      </IconButton>
    </BackLinkWrapper>
  )
}
