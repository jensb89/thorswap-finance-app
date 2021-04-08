import styled from 'styled-components/macro'

import { media } from 'helpers/style'

export const Container = styled.div`
  position: absolute;
  top: 70px;
  left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  display: none;

  ${media.sm`
    display: block;
  `}
`
