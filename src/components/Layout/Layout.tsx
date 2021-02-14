import React from 'react'

import BackLink from 'components/BackLink'
import Footer from 'components/Footer'
import Header from 'components/Header'

import * as Styled from './Layout.style'

export type Props = {
  children: React.ReactNode
}

const Layout = (props: Props) => {
  const { children } = props

  return (
    <Styled.LayoutWrapper>
      <Header />
      <Styled.ContentWrapper>
        <BackLink />
        {children}
      </Styled.ContentWrapper>
      <Footer />
    </Styled.LayoutWrapper>
  )
}

export default Layout
