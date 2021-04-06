import React from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import styled from 'styled-components'

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80vh;
`

export const PageLoader: React.FC = (): JSX.Element => {
  return (
    <LoaderWrapper>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </LoaderWrapper>
  )
}
