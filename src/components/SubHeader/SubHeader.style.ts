import { transparentize } from 'polished'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 10px !important;
  ${media.sm`
    margin-bottom: 20px !important;
  `}
`

export const Notify = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;

  color: ${palette('warning', 0)};
  border: 1px solid ${palette('warning', 0)};
  border-radius: 6px;

  cursor: pointer;

  &:hover {
    background: ${transparentize(0.9, '#fff')};
  }
`
