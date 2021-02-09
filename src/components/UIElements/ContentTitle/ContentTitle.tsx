import React from 'react'

import { ContentTitleWrapper } from './ContentTitle.style'

export type Props = {
  children: React.ReactNode
}

const ContentTitle = (props: Props) => {
  return <ContentTitleWrapper {...props} />
}

export default ContentTitle
