import React from 'react'

import { BackLink } from '../BackLink'
import * as Styled from './SubHeader.style'

export type SubHeaderProps = {
  hasBack: boolean
}

export const SubHeader = ({ hasBack }: SubHeaderProps) => {
  return <Styled.Container>{hasBack && <BackLink />}</Styled.Container>
}
