import React from 'react'

import { Footer } from 'components/Footer'
import { Header } from 'components/Header'

import { useGlobalState } from 'redux/hooks'

import * as Styled from './Layout.style'

export type Props = {
  transparent?: boolean
  children: React.ReactNode
}

export const Layout = (props: Props) => {
  const { children, transparent = false } = props

  useGlobalState()

  return (
    <Styled.LayoutWrapper>
      <Header />
      <Styled.ContentWrapper transparent={transparent}>
        {children}
      </Styled.ContentWrapper>
      <Footer />
    </Styled.LayoutWrapper>
  )
}
