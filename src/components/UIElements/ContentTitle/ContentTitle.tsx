import React from 'react'

import { ContentTitleWrapper } from './ContentTitle.style'

export type Props = {
  children: React.ReactNode
}

export const ContentTitle = (props: Props) => {
  return <ContentTitleWrapper {...props} />
}
