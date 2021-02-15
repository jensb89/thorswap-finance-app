import React from 'react'

import { ContentViewWrapper } from './ContentView.style'

export type Props = {
  children?: React.ReactNode
}

export const ContentView = (props: Props) => {
  return <ContentViewWrapper {...props} />
}
