import styled from 'styled-components/macro'

import { media } from 'helpers/style'

export const StatusItem = styled.div`
  padding-left: 10px;
`

export const DropdownLink = styled.a`
  align-items: center;

  svg {
    margin-left: 8px;
  }

  display: none;
  ${media.sm`
    display: flex;
  `}
`
