import React, { useCallback } from 'react'

import { useHistory } from 'react-router'

import { LeftOutlined } from '@ant-design/icons'

import { BackLinkWrapper } from './BackLink.style'

const BackLink = () => {
  const history = useHistory()

  const handleGoBack = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <BackLinkWrapper onClick={handleGoBack}>
      <LeftOutlined />
      <span>Back</span>
    </BackLinkWrapper>
  )
}

export default BackLink
