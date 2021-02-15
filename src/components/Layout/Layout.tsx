import React from 'react'

import { Footer } from 'components/Footer'
import { Header } from 'components/Header'

import * as Styled from './Layout.style'

export type Props = {
  children: React.ReactNode
}

export const Layout = (props: Props) => {
  const { children } = props

  return (
    <Styled.LayoutWrapper>
      <Header />
      <Styled.ContentWrapper>{children}</Styled.ContentWrapper>
      <Footer />
    </Styled.LayoutWrapper>
  )
}
