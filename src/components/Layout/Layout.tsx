import React from 'react'

import { Footer } from 'components/Footer'
import { Header } from 'components/Header'

import WalletModal from '../WalletModal'
import * as Styled from './Layout.style'

export type Props = {
  transparent?: boolean
  children: React.ReactNode
}

export const Layout = (props: Props) => {
  const { children, transparent = false } = props

  return (
    <Styled.LayoutWrapper>
      <Header />
      <Styled.ContentWrapper transparent={transparent}>
        {children}
      </Styled.ContentWrapper>
      <Footer />
      <WalletModal />
    </Styled.LayoutWrapper>
  )
}
